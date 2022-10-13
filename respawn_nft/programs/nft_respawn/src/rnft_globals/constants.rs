// STRUCT SIZES
pub const ACCOUNT_DISCRIMINATOR_SIZE: usize = 8;
pub const PUBKEY_SIZE: usize = 32;
pub const VEC_SIZE: usize = 4;
pub const U64_SIZE: usize = 8;
pub const U16_SIZE: usize = 2;
pub const U8_SIZE: usize = 1;
pub const OPTION_SIZE: usize = 1;
pub const URI_SIZE: usize = 200;
pub const STRING_SIZE: usize = 128;

//SEEDS
pub const RESPAWN_POINT_SEED: &[u8] = b"RESPAWN_POINT";

//RENT REFUND
pub const RENT_REFUND: u64 = 8_465_320;