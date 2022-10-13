import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Metaplex, keypairIdentity, CreateNftOutput, CreateNftInput, lamports } from "@metaplex-foundation/js";
import { createRespawnPoint, fetchRespawnPointAccount, fetchRespawnPointAccountFromGenesisMint, NULL_RESPAWN_POINT, respawnNft} from "../accounts/respawn-point";
import { getConnectedProgram, getConnectedProgramFromNodeWallet } from "../accounts/program";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";


async function createNFT(metaplex: Metaplex, nftParams: CreateNftInput){
    return await metaplex
    .nfts()
    .create(nftParams)
    .run(); 
}

async function getBalance(connection: anchor.web3.Connection, address: anchor.web3.PublicKey){
    return (await connection.getBalance(address, "max")) / anchor.web3.LAMPORTS_PER_SOL;
}

interface RespawnCostTable {
    mintNFT: number,
    createRespawn: number,
    respawn: number,
    reimbursed: number,
}

describe("respawn_nft", () => {
    // PROGRAM SETUP
    anchor.setProvider(anchor.AnchorProvider.env());
    const keypairFile = require("/Users/drkrueger/.config/solana/programs/rps.json");
    const walletKeypair = anchor.web3.Keypair.fromSecretKey(new Uint8Array(keypairFile));
    const connectionConfig = { commitment: "max" } as anchor.web3.ConnectionConfig
    const connection = new anchor.web3.Connection(
        "http://localhost:8899",
        connectionConfig
    );
    const nodeWallet = new NodeWallet(walletKeypair);

    const program = getConnectedProgramFromNodeWallet(
        nodeWallet,
        connection,
        connectionConfig
    )
    let balance = 0;
    let tempBalance = balance;

    // COMUNITY WALLET
    const communityWallet = anchor.web3.Keypair.generate()

    // METAPLEX SETUP
    const metaplex = Metaplex.make(connection).use(keypairIdentity(walletKeypair));

    const nftParams = {
        payer: walletKeypair,
        updateAuthority: walletKeypair,
        mintAuthority: walletKeypair,
        collectionAuthority: walletKeypair,
        collectionAuthorityIsDelegated: false,
        uri: "https://shdw-drive.genesysgo.net/3Sods1fRNiG1GSvAjXMfrh99XLe8wVN3JtAr4qA56F7Q/7174.json",
        name: "Red Panda #7175",
        sellerFeeBasisPoints: 750,
        symbol: "REDPANDA",
        creators: [
            {
                address: walletKeypair.publicKey,
                share: 100,
                authority: walletKeypair,
            },
        ],
        isMutable: true,
    }

    // NFT SETUP
    let genesis = (null as CreateNftOutput | null);
    let respawn = (null as CreateNftOutput | null);
    let genesisBad = (null as CreateNftOutput | null);
    let respawnBad = (null as CreateNftOutput | null);

    let respawnPointAccount = NULL_RESPAWN_POINT;

    let costs = {
        mintNFT: 0,
        createRespawn: 0,
        respawn: 0,
        reimbursed: 0,
    } as RespawnCostTable;

    before(async ()=>{
        console.log(`Fetching Balance...`);
        balance = await getBalance(connection, walletKeypair.publicKey);


        if(balance < 10){
            console.log(`Requesting Airdrop of 10 sol...`);
            await connection.requestAirdrop(walletKeypair.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL)
            balance = await getBalance(connection, walletKeypair.publicKey);
        }

        console.log(`Balance [ ${(balance).toFixed(3)} ]`);
        console.log(`Balance [ ${(balance).toFixed(3)} ]`);

    });

    after(async ()=>{

        costs = {...costs, reimbursed: await getBalance(connection, communityWallet.publicKey)}

        console.log("Solana")
        console.log(costs)

        const lamportCosts = {
            mintNFT: Math.round(costs.mintNFT * anchor.web3.LAMPORTS_PER_SOL),
            createRespawn: Math.round(costs.createRespawn * anchor.web3.LAMPORTS_PER_SOL),
            respawn: Math.round(costs.respawn * anchor.web3.LAMPORTS_PER_SOL),
            reimbursed: Math.round(costs.reimbursed * anchor.web3.LAMPORTS_PER_SOL),
        };

        console.log("\n\nLamports")
        console.log(lamportCosts)
    })

    beforeEach(async ()=>{
        balance = await getBalance(connection, walletKeypair.publicKey);
    })

    afterEach(async ()=>{
        tempBalance = await getBalance(connection, walletKeypair.publicKey);
        console.log(`Cost: ${(balance - tempBalance).toFixed(8)}`)
        balance = tempBalance;
    })

    it("Create Community Wallet", async ()=>{
        await anchor.web3.SystemProgram.createAccount({
            fromPubkey: walletKeypair.publicKey,
            newAccountPubkey: communityWallet.publicKey,
            lamports: 0,
            space: 0,
            programId: anchor.web3.SystemProgram.programId,
        })
        const communityBalance = await getBalance(connection, communityWallet.publicKey);
    })

    it("Create Genesis NFT", async ()=>{
        genesis = await createNFT(metaplex, nftParams);
    })

    it("Create Respawn NFT", async ()=>{
        respawn = await createNFT(metaplex, {...nftParams, name: "BAD"});
        costs = {...costs, mintNFT: await getBalance(connection, walletKeypair.publicKey)-balance}
    })

    it("Create Respawn Point", async () => {

        await createRespawnPoint(
            program,
            genesis.mintAddress,
            respawn.mintAddress,
            communityWallet.publicKey,
            true
        )

        costs = {...costs, createRespawn: await getBalance(connection, walletKeypair.publicKey)-balance}

        respawnPointAccount = await fetchRespawnPointAccountFromGenesisMint(program,genesis.mintAddress)

        if(!respawnPointAccount.account){
            throw new Error("Account should exsist");
        }
        
    });

    it("Respawn NFT", async () => {

        if(!respawnPointAccount.account){
            throw new Error("Account should exsist");
        }

        try {
            await respawnNft(
                program,
                respawnPointAccount.account,
            )
        } catch (e) {
            console.log(e);
        }


        costs = {...costs, respawn: await getBalance(connection, walletKeypair.publicKey)-balance}        
    });
});
