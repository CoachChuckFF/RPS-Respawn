import { web3, BN } from "@project-serum/anchor";
import { ACCOUNT_FETCH_STATE } from "../models/fetch-response";
import { RESPAWN_POINT_SEED } from "../models/globals";
import { ASSOCIATED_TOKEN_ID, METAPLEX_METADATA_ID, RESPAWN_NFT_ID, SYSTEM_ID, SYSTEM_RENT_ID, TOKEN_ID } from "../models/program-ids";
import { getMetadataEditionKey, getMetadataKey, getVaultKey } from "./metaplex-accounts";
import { RespawnNFTProgram } from "./program";

export interface RespawnPointAccount {
    key: web3.PublicKey;
    bump: number;
    genesisMint: web3.PublicKey;
    cloneMint: web3.PublicKey;
    communityWallet: web3.PublicKey;
}

export interface RespawnPointAccountFetchResponse {
    state: ACCOUNT_FETCH_STATE;
    account: RespawnPointAccount | undefined;
}

export const NULL_RESPAWN_POINT = {
    state: ACCOUNT_FETCH_STATE.NOT_LOADED,
    account: undefined,
} as RespawnPointAccountFetchResponse;

/**
 * Fetches the RespawnPoint key from the contribution wallet and the media or user account key
 *
 * @param contributor
 * @param genesisMint
 * @returns PublicKey
 */
export function getRespawnPointKey(
    genesisMint: web3.PublicKey,
) {
    return web3.PublicKey.findProgramAddress(
        [
            Buffer.from(RESPAWN_POINT_SEED),
            genesisMint.toBuffer(),
        ],
        RESPAWN_NFT_ID
    );
}

export async function fetchRespawnPointAccount(
    program: RespawnNFTProgram,
    account: web3.PublicKey
) {
    return _fetchRespawnPointAccount(program, { account });
}

export async function fetchRespawnPointAccountFromGenesisMint(
    program: RespawnNFTProgram,
    genesisMint: web3.PublicKey
) {
    return _fetchRespawnPointAccount(program, { genesisMint });
}

async function _fetchRespawnPointAccount(
    program: RespawnNFTProgram,
    key: {
        account?: web3.PublicKey;
        genesisMint?: web3.PublicKey;
    }
) {
    let state = ACCOUNT_FETCH_STATE.NOT_LOADED;
    let account = undefined;

    const fetchKey =
        key.account ??
        (
            await getRespawnPointKey(
                key.genesisMint ?? web3.PublicKey.default,
            )
        )[0];

    try {
        const fetchData =
            await program.program.account.respawnPointAccount.fetch(fetchKey);

        account = {
            key: fetchKey,
            genesisMint: fetchData.genesisMint,
            cloneMint: fetchData.cloneMint,
            communityWallet: fetchData.communityWallet,
        } as RespawnPointAccount;

        state = ACCOUNT_FETCH_STATE.LOADED;
    } catch (e) {
        state = ACCOUNT_FETCH_STATE.DNE;
    }

    return {
        state,
        account,
    } as RespawnPointAccountFetchResponse;
}

export async function createRespawnPoint(
    program: RespawnNFTProgram,
    genesisMint: web3.PublicKey,
    cloneMint: web3.PublicKey,
    communityWallet: web3.PublicKey,
    shouldCheckName: boolean = false,
    opts?: web3.ConfirmOptions
) {
    // ------- CHECKS --------------------------
    const creator = program.program.provider.publicKey;

    if (program.isBurner) {
        throw new Error("Program cannot be a burner");
    }

    if (!creator) {
        throw new Error("Program needs a non-null provider publickey");
    }

    // ------- GATHER ALL ACCOUNTS -----------------
    const [respawnAccount, respawnAccountBump] = await getRespawnPointKey(genesisMint);

    const respawnVault = await getVaultKey(cloneMint, respawnAccount, true);

    // Genesis
    const [genesisMetadata] = await getMetadataKey(genesisMint);
    const [genesisMasterEdition] = await getMetadataEditionKey(genesisMint);

    // Clone
    const [cloneMetadata] = await getMetadataKey(cloneMint);
    const [cloneMasterEdition] = await getMetadataEditionKey(cloneMint);
    const cloneVault = await getVaultKey(cloneMint, creator, false);

    // ------- ACCOUNTS -----------------
    const accounts = {
        // --------- Accounts ----------
        respawnAccount,
        respawnVault,
        communityWallet,
        // --------- GENESIS DETAILS ----------
        genesisMint,
        genesisMetadata,
        genesisMasterEdition,
        // --------- CLONE DETAILS ----------
        cloneMint,
        cloneMetadata,
        cloneMasterEdition,
        cloneVault,
        // --------- Programs ----------
        associatedTokenProgram: ASSOCIATED_TOKEN_ID,
        systemProgram: SYSTEM_ID,
        tokenProgram: TOKEN_ID,
        rent: SYSTEM_RENT_ID,
        // --------- Signers ----------
        creator,
    };

    return program.program.methods
    .createRespawnPoint(respawnAccountBump, shouldCheckName ? 1 : 0)
    .accounts(accounts)
    .rpc({
        skipPreflight: true,
        ...opts,
    });


}

export async function respawnNft(
    program: RespawnNFTProgram,
    respawnPoint: RespawnPointAccount | web3.PublicKey,
    opts?: web3.ConfirmOptions
) {
    // ------- CHECKS --------------------------
    const claimer = program.program.provider.publicKey;
    let respawnPointAccountData = respawnPoint as RespawnPointAccount;

    if (program.isBurner) {
        throw new Error("Program cannot be a burner");
    }

    if (!claimer) {
        throw new Error("Program needs a non-null provider publickey");
    }

    if(! (respawnPoint as any).cloneMint){
        respawnPointAccountData = (await fetchRespawnPointAccount(program, respawnPoint as web3.PublicKey)).account
    } 

    // ------- GATHER ALL ACCOUNTS -----------------
    const respawnAccount = respawnPointAccountData.key;
    const communityWallet = respawnPointAccountData.communityWallet;

    // Vaults
    const claimerCloneVault = await getVaultKey(respawnPointAccountData.cloneMint, claimer);
    const claimerGenesisVault = await getVaultKey(respawnPointAccountData.genesisMint, claimer);
    const respawnVault = await getVaultKey(respawnPointAccountData.cloneMint, respawnPointAccountData.key);

    // Clone
    const cloneMint = respawnPointAccountData.cloneMint;

    // Genesis
    const genesisMint = respawnPointAccountData.genesisMint;
    const [genesisMetadata] = await getMetadataKey(genesisMint);
    const [genesisMasterEdition] = await getMetadataEditionKey(genesisMint);

    // ------- ACCOUNTS -----------------
    const accounts = {
        // --------- Accounts ----------
        respawnAccount,
        communityWallet,
        // --------- TX ACCOUNTS ------------
        claimerCloneVault,
        claimerGenesisVault,
        respawnVault,

        // --------- CLONE DETAILS ----------
        cloneMint,
        // --------- GENESIS DETAILS ----------
        genesisMint,
        genesisMetadata,
        genesisMasterEdition,
        // --------- Programs ----------
        tokenMetadataProgram: METAPLEX_METADATA_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_ID,
        systemProgram: SYSTEM_ID,
        tokenProgram: TOKEN_ID,
        rent: SYSTEM_RENT_ID,
        // --------- Signers ----------
        claimer,
    };

    return program.program.methods
        .respawn()
        .accounts(accounts)
        .rpc({
            skipPreflight: true,
            ...opts,
        });
}