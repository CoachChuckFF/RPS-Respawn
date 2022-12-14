import { web3, Program, AnchorProvider } from "@project-serum/anchor";
import { RespawnNft } from "../models/idl/respawn-nft";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { RESPAWN_NFT_ID, RESPAWN_NFT_IDL } from "../models/program-ids";
import {
    ConnectionContextState,
    WalletContextState,
} from "@solana/wallet-adapter-react";

export interface RespawnNFTProgram {
    isBurner: boolean;
    program: Program<RespawnNft>;
}

/**
 * Returns a program right fromt the Solana Wallet Adapter hooks
 *
 * @param useWallet The Solana Wallet Adapter useWallet hook `useWallet()`
 * @param useConnection The Solana Wallet Adapter useConnection hook `useConnection()`
 * @param connectionConfig Connection config
 * @returns DRMProgram
 */
export function getProgramFromReactHooks(
    useWallet: WalletContextState,
    useConnection: ConnectionContextState,
    connectionConfig?: web3.ConnectionConfig
) {
    if (
        useWallet.publicKey &&
        useWallet.signTransaction &&
        useWallet.signAllTransactions
    ) {
        return getConnectedProgram(
            useWallet.publicKey,
            useWallet.signTransaction,
            useWallet.signAllTransactions,
            useConnection.connection,
            connectionConfig
        );
    }

    return getBurnerProgram(useConnection.connection, connectionConfig);
}

/**
 * Returns a burner program ( only good for fetching accounts )
 *
 * @param connection Connection
 * @param connectionConfig Connection Config
 * @returns DRMProgram
 */
export function getBurnerProgram(
    connection: web3.Connection,
    connectionConfig?: web3.ConnectionConfig
) {
    return {
        isBurner: true,
        program: new Program<RespawnNft>(
            RESPAWN_NFT_IDL as any,
            RESPAWN_NFT_ID,
            new AnchorProvider(
                connection,
                new NodeWallet(web3.Keypair.generate()),
                connectionConfig ?? {}
            )
        ),
    };
}

/**
 * Returns a non-burner Program - good for all transactions
 *
 *
 * @param publicKey The public key of the signer
 * @param signTransaction The signTransaction function
 * @param signAllTransactions The signTransactions function
 * @param connection Connection
 * @param connectionConfig Connection Config
 * @returns
 */
export function getConnectedProgram(
    publicKey: web3.PublicKey,
    signTransaction: (tx: web3.Transaction) => Promise<web3.Transaction>,
    signAllTransactions: (
        txs: web3.Transaction[]
    ) => Promise<web3.Transaction[]>,
    connection: web3.Connection,
    connectionConfig?: web3.ConnectionConfig
) {
    return {
        isBurner: false,
        program: new Program<RespawnNft>(
            RESPAWN_NFT_IDL as any,
            RESPAWN_NFT_ID,
            new AnchorProvider(
                connection,
                {
                    publicKey,
                    signTransaction,
                    signAllTransactions,
                },
                connectionConfig ?? {}
            )
        ),
    };
}

/**
 * Returns a non-burner Program - good for all transactions
 *
 *
 * @param publicKey The public key of the signer
 * @param signTransaction The signTransaction function
 * @param signAllTransactions The signTransactions function
 * @param connection Connection
 * @param connectionConfig Connection Config
 * @returns
 */
 export function getConnectedProgramFromNodeWallet(
    wallet: NodeWallet,
    connection: web3.Connection,
    connectionConfig?: web3.ConnectionConfig,
) {
    return {
        isBurner: false,
        program: new Program<RespawnNft>(
            RESPAWN_NFT_IDL as any,
            RESPAWN_NFT_ID,
            new AnchorProvider(
                connection,
                wallet,
                connectionConfig ?? {}
            )
        ),
    };
}
