use crate::rnft_accounts::respawn_point_account::*;
use crate::rnft_globals::errors::*;
use crate::rnft_globals::constants::*;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::rent;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Transfer, transfer, close_account, CloseAccount};
use anchor_spl::token::{Mint, Token, TokenAccount};
use mpl_token_metadata::pda::{find_master_edition_account, find_metadata_account};
use mpl_token_metadata::state::{Metadata, TokenMetadataAccount};

#[derive(Accounts)]
pub struct CreateRespawnPoint<'info> {
    // --------- Accounts ----------
    #[account(
        init,
        space = get_respawn_size(),
        payer = creator,
        seeds = [
            RESPAWN_POINT_SEED,
            genesis_mint.key().as_ref(),
        ],
        bump
    )]
    pub respawn_account: Box<Account<'info, RespawnPointAccount>>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = clone_mint,
        associated_token::authority = respawn_account,
    )]
    pub respawn_vault: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    /// CHECK: Where we send the closed accounts funds to
    pub community_wallet: AccountInfo<'info>,

    // --------- GENESIS DETAILS ----------
    #[account(mut)]
    pub genesis_mint: Box<Account<'info, Mint>>,

    #[account(mut, address=find_metadata_account(&genesis_mint.key()).0)]
    /// CHECK: As long as there is data here we should be OK
    pub genesis_metadata: UncheckedAccount<'info>,

    #[account(mut, address=find_master_edition_account(&genesis_mint.key()).0)]
    /// CHECK: As long as there is data here we should be OK
    pub genesis_master_edition: UncheckedAccount<'info>,

    // --------- CLONE DETAILS ----------
    #[account(mut)]
    pub clone_mint: Box<Account<'info, Mint>>,

    #[account(mut, address=find_metadata_account(&clone_mint.key()).0)]
    /// CHECK: As long as there is data here we should be OK
    pub clone_metadata: UncheckedAccount<'info>,

    #[account(mut, address=find_master_edition_account(&clone_mint.key()).0)]
    /// CHECK: As long as there is data here we should be OK
    pub clone_master_edition: UncheckedAccount<'info>,

    #[account(
        mut, 
        constraint = clone_vault.owner == creator.key() && 
            clone_vault.mint == clone_mint.key()
    )]
    pub clone_vault: Box<Account<'info, TokenAccount>>,

    // --------- Programs ----------
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    #[account(address = rent::id())]
    /// CHECK: We check it by address here
    pub rent: AccountInfo<'info>,

    // --------- Signers ----------
    #[account(mut)]
    pub creator: Signer<'info>,
}

pub fn run_create_respawn_point(ctx: Context<CreateRespawnPoint>, bump: u8, should_check_name: u8) -> Result<()> {
    {
        msg!("Check Bump");

        let respawn_account = Pubkey::create_program_address(
            &[
                RESPAWN_POINT_SEED,
                ctx.accounts.genesis_mint.to_account_info().key.as_ref(), 
                &[bump]
            ],
            ctx.program_id,
        )
        .map_err(|_| error!(BNMErrorCode::BadProgramAccount))?;

        if respawn_account != ctx.accounts.respawn_account.key() {
            return Err(error!(BNMErrorCode::BumpDoesNotMatch));
        }
    }

    if should_check_name > 0 {
        msg!("Check Metadatas Match");

        let genesis_metadata =
        Metadata::from_account_info::<Metadata>(ctx.accounts.genesis_metadata.to_account_info().as_ref())?;

        let clone_metadata =
        Metadata::from_account_info::<Metadata>(ctx.accounts.clone_metadata.to_account_info().as_ref())?;

        if genesis_metadata.data.name != clone_metadata.data.name {
            return Err(error!(BNMErrorCode::NameDoesNotMatch));
        }
    } else {
        msg!("Check Metadata Check Skipped");
    }

    {
        msg!("Transfer Clone to Respawn Point");

        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.clone_vault.to_account_info(),
                    to: ctx.accounts.respawn_vault.to_account_info(),
                    authority: ctx.accounts.creator.to_account_info(),
                },
            ),
            ctx.accounts.clone_vault.amount,
        )?;

    }

    {
        msg!("Close Creator Token Account");

        close_account(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                CloseAccount {
                    account: ctx.accounts.clone_vault.to_account_info(),
                    destination: ctx.accounts.creator.to_account_info(),
                    authority: ctx.accounts.creator.to_account_info(),
                },
            )
        )?;
    }

    {
        msg!("Set Respawn Account");
        let respawn_account = &mut ctx.accounts.respawn_account;
        respawn_account.bump = bump;
        respawn_account.genesis_mint = ctx.accounts.genesis_mint.key();
        respawn_account.clone_mint = ctx.accounts.clone_mint.key();
        respawn_account.community_wallet = ctx.accounts.community_wallet.key();
    }

    Ok(())
}
