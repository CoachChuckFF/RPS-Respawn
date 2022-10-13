use crate::rnft_accounts::respawn_point_account::*;
use anchor_lang::prelude::*;
use crate::rnft_globals::constants::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Transfer, transfer, close_account, CloseAccount};
use anchor_spl::token::{Mint, Token, TokenAccount};
use mpl_token_metadata::pda::{find_master_edition_account, find_metadata_account};
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::sysvar::rent;
use mpl_token_metadata::instruction::{ burn_nft };
use anchor_lang::solana_program::system_instruction::transfer as system_transfer;


#[derive(Accounts)]
pub struct Respawn<'info> {
    // --------- Accounts ----------
    #[account(
        mut,
        close = community_wallet,
        seeds = [
            RESPAWN_POINT_SEED,
            genesis_mint.key().as_ref(),
        ],
        bump
    )]
    pub respawn_account: Box<Account<'info, RespawnPointAccount>>,

    #[account(mut, constraint = community_wallet.key() == respawn_account.community_wallet)]
    /// CHECK: Where we send the closed accounts funds to
    pub community_wallet: AccountInfo<'info>,


    // --------- TX ACCOUNTS ------------
    #[account(
        init,
        payer = claimer,
        associated_token::mint = clone_mint,
        associated_token::authority = claimer,
    )]
    pub claimer_clone_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        mut, 
        constraint = claimer_genesis_vault.owner == claimer.key() &&
            claimer_genesis_vault.mint == respawn_account.genesis_mint
    )]
    pub claimer_genesis_vault: Box<Account<'info, TokenAccount>>,

    #[account(
        mut, 
        constraint = respawn_vault.owner == respawn_account.key() && 
        respawn_vault.mint == respawn_account.clone_mint
    )]
    pub respawn_vault: Box<Account<'info, TokenAccount>>,



    // --------- CLONE DETAILS ----------
    #[account(mut, constraint = clone_mint.key() == respawn_account.clone_mint)]
    pub clone_mint: Box<Account<'info, Mint>>,

    // --------- GENESIS DETAILS ----------
    #[account(mut, constraint = genesis_mint.key() == respawn_account.genesis_mint)]
    pub genesis_mint: Box<Account<'info, Mint>>,

    #[account(mut, address=find_metadata_account(&genesis_mint.key()).0)]
    /// CHECK: As long as there is data here we should be OK
    pub genesis_metadata: UncheckedAccount<'info>,

    #[account(mut, address=find_master_edition_account(&genesis_mint.key()).0)]
    /// CHECK: As long as there is data here we should be OK
    pub genesis_master_edition: UncheckedAccount<'info>,

    // --------- Programs ----------
    #[account(address = mpl_token_metadata::ID)]
    /// CHECK: We check it by address here
    pub token_metadata_program: UncheckedAccount<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    #[account(address = rent::id())]
    /// CHECK: We check it by address here
    pub rent: AccountInfo<'info>,

    // --------- Signers ----------
    #[account(mut)]
    pub claimer: Signer<'info>,
}

pub fn run_respawn(ctx: Context<Respawn>) -> Result<()> {
    {
        msg!("Transfer Clone");

        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.respawn_vault.to_account_info(),
                    to: ctx.accounts.claimer_clone_vault.to_account_info(),
                    authority: ctx.accounts.respawn_account.to_account_info(),
                },
                &[&[
                    RESPAWN_POINT_SEED,
                    ctx.accounts.genesis_mint.key().as_ref(),
                    &[ctx.accounts.respawn_account.bump],
                ]],
            ),
            1
        )?;
    }

    {
        msg!("Burn Genesis NFT");

        let burn_nft_infos = vec![
            ctx.accounts.genesis_metadata.to_account_info(), // Metadata account
            ctx.accounts.claimer.to_account_info(), // Owner
            ctx.accounts.genesis_mint.to_account_info(),    // Mint
            ctx.accounts.claimer_genesis_vault.to_account_info(), // Token Account
            ctx.accounts.genesis_master_edition.to_account_info(), // Edition Account
            ctx.accounts.token_program.to_account_info(), // Token Program
        ];
        invoke(
            &burn_nft(
                ctx.accounts.token_metadata_program.key(),
                ctx.accounts.genesis_metadata.key(),
                ctx.accounts.claimer.key(),
                ctx.accounts.genesis_mint.key(),
                ctx.accounts.claimer_genesis_vault.key(),
                ctx.accounts.genesis_master_edition.key(),
                ctx.accounts.token_program.key(),
                None,
            ),
            burn_nft_infos.as_slice(),
        )?;
    }

    {
        msg!("Return Rent to Community Wallet");

        let tx_sol_infos = vec![
            ctx.accounts.claimer.to_account_info(),
            ctx.accounts.community_wallet.to_account_info(),
        ];

        invoke(
            &system_transfer(
                &ctx.accounts.claimer.key(),
                &ctx.accounts.community_wallet.key(),
                RENT_REFUND,
            ),
            &tx_sol_infos,
        )?;
    }

    {
        msg!("Close Creator Token Account");
        
        close_account(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                CloseAccount {
                    account: ctx.accounts.respawn_vault.to_account_info(),
                    destination: ctx.accounts.community_wallet.to_account_info(),
                    authority: ctx.accounts.respawn_account.to_account_info(),
                },
                &[&[
                    RESPAWN_POINT_SEED,
                    ctx.accounts.genesis_mint.key().as_ref(),
                    &[ctx.accounts.respawn_account.bump],
                ]],
            ),
        )?;
    }

    Ok(())
}
