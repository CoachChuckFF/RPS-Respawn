use anchor_lang::prelude::*;
use anchor_lang::solana_program::log::sol_log_compute_units;
// Globals
mod rnft_globals;

// Accounts
mod rnft_accounts;

// Instructions
mod rnft_instructions;
use rnft_instructions::create_respawn_point_instruction::*;
use rnft_instructions::respawn_instruction::*;

declare_id!("Dou1Phg8n1T1UUGV67ba9ZPS17urgtZHZ9UYGmpwv5Mu");

#[program]
pub mod respawn_nft {
    use super::*;

    pub fn create_respawn_point(
        ctx: Context<CreateRespawnPoint>,
        bump: u8,
        should_check_name: u8,
    ) -> Result<()> {
        run_create_respawn_point(ctx, bump, should_check_name)?;
        sol_log_compute_units();

        Ok(())
    }

    pub fn respawn(ctx: Context<Respawn>) -> Result<()> {
        run_respawn(ctx)?;
        sol_log_compute_units();

        Ok(())
    }
}
