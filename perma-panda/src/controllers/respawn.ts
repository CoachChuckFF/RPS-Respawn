import { PublicKey } from "@solana/web3.js";
import { RespawnPanda } from "../pages/HomePage/HomePage";
import { RespawnNFTProgram } from "./Respawn/accounts/program";
import {
    fetchRespawnPointAccountFromGenesisMint,
    respawnNft,
} from "./Respawn/accounts/respawn-point";
import Mapping from "./panda-mappings.json";
import { Metaplex } from "@metaplex-foundation/js";
import { ACCOUNT_FETCH_STATE } from "./Respawn/models/fetch-response";

export enum RespawningState {
    blacklisted = "Blacklisted",
    idle = "Idle",
    respawning = "Respawning",
    error = "Error",
    success = "Success",
}

export async function respawnRPSPanda(
    metaplex: Metaplex,
    program: RespawnNFTProgram,
    panda: RespawnPanda
): Promise<[RespawningState, string]> {
    return new Promise<[RespawningState, string]>((resolve) => {
        metaplex
            .nfts()
            .findByMetadata({ metadata: panda.address })
            .run()
            .then((pandaAccount) => {
                const mint = pandaAccount.mint.address;

                if (checkIfBlackListed(mint)) {
                    resolve([
                        RespawningState.blacklisted,
                        "Panda is blacklisted",
                    ]);
                }

                // Fetch Panda Escrow
                fetchRespawnPointAccountFromGenesisMint(program, mint)
                    .then((respawnPoint) => {
                        if (!respawnPoint.account) {
                            resolve([
                                RespawningState.error,
                                "Respawn Point does not exist",
                            ]);
                        }
                        respawnNft(program, respawnPoint.account)
                            .then((signature) => {
                                resolve([
                                    RespawningState.success,
                                    `${panda.name} Respawned!: ${signature}`,
                                ]);
                            })
                            .catch((e) => {
                                resolve([
                                    RespawningState.error,
                                    `Error respawning ${panda.name}: ${e}`,
                                ]);
                            });
                    })
                    .catch((e) => {
                        resolve([
                            RespawningState.error,
                            `Error getting respawn ${panda.name}: ${e}`,
                        ]);
                    });
            })
            .catch((e) => {
                resolve([
                    RespawningState.error,
                    `Error fetching ${panda.name}: ${e}`,
                ]);
            });
    });
}

interface SearchableMapping {
    [key: string]: {
        oldMint: string;
        newMint: string;
        blacklisted: boolean;
        name?: string;
        error?: string;
    };
}

export function checkIfBlackListed(mint: PublicKey) {
    return (Mapping as unknown as SearchableMapping)[mint.toString()]
        .blacklisted;
}
