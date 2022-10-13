use anchor_lang::prelude::*;

#[error_code]
pub enum BNMErrorCode {
    // Create Respawn Point
    #[msg("Could not find program account.")]
    BadProgramAccount,
    #[msg("Bump does not match account")]
    BumpDoesNotMatch,
    #[msg("Metadata name does not match")]
    NameDoesNotMatch,
    // Respawn
}
