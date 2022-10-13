use crate::rnft_globals::constants::*;
use anchor_lang::prelude::*;

/// RespawnPointAccount
/// PDA: genesis mint
///
#[account]
pub struct RespawnPointAccount {
    pub bump: u8,
    pub genesis_mint: Pubkey,
    pub clone_mint: Pubkey,
    pub community_wallet: Pubkey, // Who gets the account rent back
}
pub fn get_respawn_size() -> usize {
    return ACCOUNT_DISCRIMINATOR_SIZE + // Account
    U8_SIZE + // Bump
    PUBKEY_SIZE + // Genesis
    PUBKEY_SIZE + // Clone
    PUBKEY_SIZE; // Community Wallet
}
