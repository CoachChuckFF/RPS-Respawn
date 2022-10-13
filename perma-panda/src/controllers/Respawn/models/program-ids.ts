import { web3, Idl } from "@project-serum/anchor"
import { TokenMetadataProgram } from "@metaplex-foundation/js"
import {
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token"
const IDL = require("./idl/respawn-nft.json")

export const RESPAWN_NFT_IDL = IDL as Idl

// Mainnet
export const RESPAWN_NFT_ID = new web3.PublicKey(
    "Dou1Phg8n1T1UUGV67ba9ZPS17urgtZHZ9UYGmpwv5Mu"
)

export const METAPLEX_METADATA_ID = TokenMetadataProgram.publicKey
export const SYSTEM_RENT_ID = web3.SYSVAR_RENT_PUBKEY
export const SYSTEM_ID = web3.SystemProgram.programId
export const TOKEN_ID = TOKEN_PROGRAM_ID
export const ASSOCIATED_TOKEN_ID = ASSOCIATED_TOKEN_PROGRAM_ID
