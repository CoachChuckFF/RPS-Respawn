import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as anchor from "@project-serum/anchor";
import * as RPS from "./metadata";
import {
    RPSMetadata,
    RPSCreator,
    RPSFile,
    RPSCollection,
    RPSAtrributes,
} from "./metadata";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { createRespawnPoint } from "./Respawn/accounts/respawn-point";
import { getConnectedProgramFromNodeWallet } from "./Respawn/accounts/program";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

const download = require("download");
const fs = require("fs");

const TOKEN_METADATA_PROGRAM = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// https://solscan.io/token/7hURxptm3XJ3NeRQgjSvBNGiCY4gbHFd7h6XyJeV3yvj
const FIRST_CREATOR_ID = new PublicKey(
    "4xESs1McQbwhXhWjpVBZ7Tb6gXNqH7grVbwTKZNjjk6V"
);

const keypairFile = require("/Users/drkrueger/.config/solana/programs/rps.json");
const walletKeypair = Keypair.fromSecretKey(new Uint8Array(keypairFile));
const connection = new Connection(
    "https://quiet-muddy-log.solana-mainnet.quiknode.pro/4fffdad3de6974646ada97e9a6941f6aa3c5fd8e/",
    { commitment: "max" }
);
const metaplex = Metaplex.make(connection).use(keypairIdentity(walletKeypair));
const program = getConnectedProgramFromNodeWallet(
    new NodeWallet(walletKeypair),
    connection,
    { commitment: "max" }
);

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;
const MAX_CREATOR_LEN = 32 + 1 + 1;
const MAX_CREATOR_LIMIT = 5;
const MAX_DATA_SIZE =
    4 +
    MAX_NAME_LENGTH +
    4 +
    MAX_SYMBOL_LENGTH +
    4 +
    MAX_URI_LENGTH +
    2 +
    1 +
    4 +
    MAX_CREATOR_LIMIT * MAX_CREATOR_LEN;
const MAX_METADATA_LEN = 1 + 32 + 32 + MAX_DATA_SIZE + 1 + 1 + 9 + 172;
const CREATOR_ARRAY_START =
    1 +
    32 +
    32 +
    4 +
    MAX_NAME_LENGTH +
    4 +
    MAX_URI_LENGTH +
    4 +
    MAX_SYMBOL_LENGTH +
    2 +
    1 +
    4;

const getMintAddresses = async (firstCreatorAddress: PublicKey) => {
    const metadataAccounts = await connection.getProgramAccounts(
        TOKEN_METADATA_PROGRAM,
        {
            // The mint address is located at byte 33 and lasts for 32 bytes.
            dataSlice: { offset: 33, length: 32 },

            filters: [
                // Only get Metadata accounts.
                { dataSize: MAX_METADATA_LEN },

                // Filter using the first creator.
                {
                    memcmp: {
                        offset: CREATOR_ARRAY_START,
                        bytes: firstCreatorAddress.toBase58(),
                    },
                },
            ],
        }
    );

    return metadataAccounts.map((metadataAccountInfo) =>
        bs58.encode(metadataAccountInfo.account.data)
    );
};

const downloadFile = (
    url: string,
    dir: string,
    filename: string,
    returnJson: boolean = false
) => {
    return new Promise<any>(async (resolve, reject) => {
        try {
            let data = await download(url);
            fs.writeFileSync(dir + filename, data);

            if (returnJson) {
                resolve(JSON.parse(data.toString()));
            }
            resolve({});
        } catch (error) {
            reject(error);
        }
    });
};

interface OutputMetadata {
    metadataURL: string;
    photoURL: string;
    name: string;
    mint: string;
}

type MetaEntry = {
    [key: string]: OutputMetadata;
};

async function stepOne() {
    console.log("Getting mint addresses...");
    const data = await getMintAddresses(FIRST_CREATOR_ID);
    console.log("Writing metadata...");
    fs.writeFileSync("./mints.json", JSON.stringify(data));
    fs.writeFileSync("./output.json", JSON.stringify({}));
}

// async function stepTwo() {
//     const mints = require("./mints.json") as string[];
//     const progressData = require("./output.json") as MetaEntry;

//     const data = { ...progressData } as MetaEntry;
//     let count = 0;

//     const metadataDirPath = __dirname + "/metadata";
//     if (!fs.existsSync(metadataDirPath)) {
//         fs.mkdirSync(metadataDirPath, { recursive: true });
//     }

//     const imgDirPath = __dirname + "/img";
//     if (!fs.existsSync(imgDirPath)) {
//         fs.mkdirSync(imgDirPath, { recursive: true });
//     }

//     process.on("SIGINT", () => {
//         console.log("Finishing up the file");
//         fs.writeFileSync("./output.json", JSON.stringify(data));
//         process.exit();
//     });

//     console.log(`Fetching Data for ${mints.length} mints...\n`);
//     for (const mint of mints) {
//         let logString = `${(++count).toString().padEnd(5, " ")}: `;
//         if (
//             !data[mint] ||
//             data[mint].metadataURL === "" ||
//             data[mint].photoURL === ""
//         ) {
//             try {
//                 // Get Metadata
//                 const metadata =
//                     await meta.programs.metadata.Metadata.findByMint(
//                         connection,
//                         new anchor.web3.PublicKey(mint)
//                     );

//                 const symbol = metadata.data.data.symbol;
//                 const name = metadata.data.data.name;
//                 const uri = metadata.data.data.uri;

//                 if (symbol !== "REDPANDA") {
//                     throw new Error("Bad metadata");
//                 }

//                 // Download JSON
//                 const jsonFile = await downloadFile(
//                     uri,
//                     "metadata/",
//                     `${mint}.json`,
//                     true
//                 );
//                 const imgURL = jsonFile.image;

//                 // Download IMG
//                 await downloadFile(imgURL, "img/", `${mint}.png`, false);

//                 data[mint] = {
//                     metadataURL: uri,
//                     photoURL: imgURL,
//                     name: name,
//                     mint: mint,
//                 };

//                 logString += `💾 ${name}`;
//             } catch (error) {
//                 logString += `❌ - ${mint}`;
//             }

//             console.log(logString);
//         } else {
//             logString += "✅";
//             // console.log(logString);
//         }
//     }

//     fs.writeFileSync("./output.json", JSON.stringify(data));
// }

interface RPSMapping {
    old: string;
    new: string;
}
// Keypair.fromSecretKey(new Uint8Array(JSON.parse(privateKey)))
async function stepThree() {
    const filetype = ".json";
    const dir = "./new-mints/";
    const mints = require("./mints.json") as string[];

    let mappings = [] as RPSMapping[];

    let count = 1;
    for (const mint of mints) {
        const generatedKeypair = Keypair.generate();
        const keypairString = `[${generatedKeypair.secretKey.toString()}]`;
        fs.writeFileSync(dir + mint + filetype, keypairString);

        console.log(
            `${count.toString().padEnd(5)}: ${mint.substring(
                0,
                8
            )} === ${generatedKeypair.publicKey.toString().substring(0, 8)}`
        );
        count++;

        mappings.push({
            old: mint,
            new: generatedKeypair.publicKey.toString(),
        });
    }

    fs.writeFileSync("./mint-map.json", JSON.stringify(mappings));
}

async function stepFour() {
    const filetype = ".json";
    const imgFiletype = ".png";
    const oldDir = "./metadata/";
    const newDir = "./new-metadata/";
    const mints = require("./mints.json") as string[];

    let count = 1;
    for (const mint of mints) {
        const oldMeta = JSON.parse(
            fs.readFileSync(oldDir + mint + filetype, {
                encoding: "utf8",
                flag: "r",
            })
        );

        const newImageUrl = RPS.URL_BASE + mint + imgFiletype;

        const newMeta = {
            ...oldMeta,
            symbol: RPS.SYMBOL,
            seller_fee_basis_points: RPS.SELLER_FEE_BASIS_POINTS,
            collection: RPS.COLLECTION,
            image: newImageUrl,
            properties: {
                ...oldMeta.properties,
                files: [
                    {
                        uri: newImageUrl,
                        type: "image/png",
                    },
                    ...oldMeta.properties.files,
                ],
                creators: RPS.CREATORS,
            },
        } as RPSMetadata;

        fs.writeFileSync(newDir + mint + filetype, JSON.stringify(newMeta));

        console.log(`${count.toString().padEnd(5)}: ${newMeta.name}`);
        count++;
    }
}

async function stepFourPointFive() {
    const filetype = ".json";
    const imgFiletype = ".png";
    const oldImageDir = "./img/";
    const oldDir = "./metadata/";
    const newDir = "../sugar/assets/";
    const mints = require("./mints.json") as string[];

    let count = 1;
    for (const mint of mints) {
        const oldMeta = JSON.parse(
            fs.readFileSync(oldDir + mint + filetype, {
                encoding: "utf8",
                flag: "r",
            })
        );

        // const newImageUrl = RPS.URL_BASE + mint + imgFiletype;

        const number = Number.parseInt(oldMeta.name.split("#")[1]) - 1;
        const newImageUrl = `${number}.png`;

        const newMeta = {
            ...oldMeta,
            symbol: RPS.SYMBOL,
            seller_fee_basis_points: RPS.SELLER_FEE_BASIS_POINTS,
            collection: RPS.COLLECTION,
            image: newImageUrl,
            properties: {
                ...oldMeta.properties,
                files: [
                    {
                        uri: newImageUrl,
                        type: "image/png",
                    },
                    ...oldMeta.properties.files,
                ],
                // creators: RPS.CREATORS,
                creators: null,
            },
        } as RPSMetadata;

        fs.writeFileSync(newDir + number + filetype, JSON.stringify(newMeta));
        fs.copyFileSync(
            oldImageDir + mint + imgFiletype,
            newDir + number + imgFiletype
        );

        console.log(`${count.toString().padEnd(5)}: ${newMeta.name}`);
        count++;
    }
}

async function stepFive() {
    const collectionMetadata =
        require("./collection/collection.json") as RPSMetadata;
    const collectionMintFile = require("./test-mint/test-collection.json");
    const collectionMintKeypair = Keypair.fromSecretKey(
        new Uint8Array(collectionMintFile)
    );

    const creators = [
        {
            address: walletKeypair.publicKey,
            share: 0,
            authority: walletKeypair,
        },
        ...RPS.CREATORS_KEYS,
    ] as any;

    const resp = await metaplex
        .nfts()
        .create({
            payer: walletKeypair,
            updateAuthority: walletKeypair,
            mintAuthority: walletKeypair,
            collectionAuthority: walletKeypair,
            collectionAuthorityIsDelegated: false,
            // useNewMint: collectionMintKeypair,
            uri: RPS.URL_BASE + "collection.json",
            name: collectionMetadata.name,
            sellerFeeBasisPoints: collectionMetadata.seller_fee_basis_points,
            symbol: collectionMetadata.symbol,
            creators: creators,
            isMutable: true,
            isCollection: true,
            collectionIsSized: true,
        })
        .run();

    console.log(resp);
    fs.writeFileSync("./temp.json", JSON.stringify(resp));
}

async function stepSix() {
    const testMetadata =
        require("./test-mint/1eDhSDsTD2Pigu3b1LNiH4hCNx2pWcnZsqJi8B85gA6.json") as RPSMetadata;
    const collectionMintFile = require("./test-mint/test-mint.json");
    const collectionMintKeypair = Keypair.fromSecretKey(
        new Uint8Array(collectionMintFile)
    );

    const creators = [
        {
            address: walletKeypair.publicKey,
            share: 0,
            authority: walletKeypair,
        },
        ...RPS.CREATORS_KEYS,
    ] as any;

    const resp = await metaplex
        .nfts()
        .create({
            confirmOptions: {
                commitment: "max",
                skipPreflight: true,
                maxRetries: 3,
            },
            payer: walletKeypair,
            updateAuthority: walletKeypair,
            mintAuthority: walletKeypair,
            collectionAuthority: walletKeypair,
            collectionAuthorityIsDelegated: false,
            // useNewMint: collectionMintKeypair,
            uri:
                RPS.URL_BASE +
                "1eDhSDsTD2Pigu3b1LNiH4hCNx2pWcnZsqJi8B85gA6.json",
            name: testMetadata.name,
            sellerFeeBasisPoints: testMetadata.seller_fee_basis_points,
            symbol: testMetadata.symbol,
            creators: creators,
            isMutable: true,
            collection: new PublicKey(
                "D3CawCCpktY9wvpPUHST8R3SFZEdCJ3M567Khnwh4z8o"
            ),
            collectionIsSized: true,
        })
        .run();

    console.log("Done");
    fs.writeFileSync("./temp2.json", JSON.stringify(resp));
}

interface BlacklistMapping {
    old: string;
    new?: string;
    to: string;
}

// Get the blacklist Pandas
async function stepSeven() {
    const blacklist: BlacklistMapping[] = [];

    // Burned Panda
    blacklist.push({
        old: "CjkFgHJM4Gc33igrdssqvDfQL63NN33NDvDcEbsqN5Nd",
        to: "2xb1ZeULg784kkwvs3YtAJJUfipq8HDiAmk2k9hAGjjk",
    });

    // Ggfssp7rcAbppMBGeTEgvMKjranvRTnL4UTrp6hnELbP -> 2xb1ZeULg784kkwvs3YtAJJUfipq8HDiAmk2k9hAGjjk
    console.log("Fetching Wallet One");
    const blacklistWalletOne = await metaplex
        .nfts()
        .findAllByOwner({
            owner: new PublicKey(
                "Ggfssp7rcAbppMBGeTEgvMKjranvRTnL4UTrp6hnELbP"
            ),
        })
        .run();

    const blacklistPandasOne = blacklistWalletOne.filter((value) => {
        if (
            value.creators[0].address.equals(
                new PublicKey("4xESs1McQbwhXhWjpVBZ7Tb6gXNqH7grVbwTKZNjjk6V")
            )
        ) {
            return true;
        } else {
            return false;
        }
    });

    for (const panda of blacklistPandasOne) {
        console.log("Fetching Panda ", panda.name);
        const nft = await metaplex
            .nfts()
            .findByMetadata({ metadata: panda.address })
            .run();
        nft.mint.address;
        blacklist.push({
            old: nft.mint.address.toString(),
            to: "2xb1ZeULg784kkwvs3YtAJJUfipq8HDiAmk2k9hAGjjk",
        });
    }

    // 9gFTByoawNgJFB1psDgN5WqyUebJacqeL8Avmr1GChY9 -> 7WYgrY31WRx13MdCLB3A7u83QBH2K3HVP4wfz6xTuxdF
    console.log("Fetching Wallet Two");
    const blacklistWalletTwo = await metaplex
        .nfts()
        .findAllByOwner({
            owner: new PublicKey(
                "Ggfssp7rcAbppMBGeTEgvMKjranvRTnL4UTrp6hnELbP"
            ),
        })
        .run();

    const blacklistPandasTwo = blacklistWalletTwo.filter((value) => {
        if (
            value.creators[0].address.equals(
                new PublicKey("9gFTByoawNgJFB1psDgN5WqyUebJacqeL8Avmr1GChY9")
            )
        ) {
            return true;
        } else {
            return false;
        }
    });

    for (const panda of blacklistPandasTwo) {
        console.log("Fetching Panda ", panda.name);
        const nft = await metaplex
            .nfts()
            .findByMetadata({ metadata: panda.address })
            .run();
        nft.mint.address;
        blacklist.push({
            old: nft.mint.address.toString(),
            to: "7WYgrY31WRx13MdCLB3A7u83QBH2K3HVP4wfz6xTuxdF",
        });
    }

    console.log("Writing Output");
    fs.writeFileSync("./blacklist.json", JSON.stringify(blacklist));
}

// Get Old Pandas
interface OldMintNameMap {
    mint: string;
    name: string;
}
// Map old mints to new mints
async function stepEight() {
    const mapping: OldMintNameMap[] = [];

    const filetype = ".json";
    const oldDir = "./metadata/";
    const mints = require("./mints.json") as string[];

    let count = 1;
    for (const mint of mints) {
        const oldMeta = JSON.parse(
            fs.readFileSync(oldDir + mint + filetype, {
                encoding: "utf8",
                flag: "r",
            })
        );

        const name = oldMeta.name;
        console.log("Reading ", name);

        mapping.push({
            mint,
            name,
        });
    }

    console.log("Writing Output");
    fs.writeFileSync("./mint-name-map.json", JSON.stringify(mapping));
}
interface OldNewMapping {
    oldMint: string;
    newMint: string;
    blacklisted: boolean;
    name?: string;
}
// Map old mints to new mints
async function stepEightPointTwo() {
    const mintNameMap = require("./mint-name-map.json") as OldMintNameMap[];
    const blacklist = require("./blacklist.json") as BlacklistMapping[];
    const mapping: OldNewMapping[] = [];

    console.log("Fetching Pandas... ");
    const nfts = await metaplex
        .nfts()
        .findAllByCreator({
            creator: new PublicKey(
                "Gx7eDqKHA9D9acZZ1ZKPqdWrecvzkg1dVkZBFbHyeE6v"
            ),
        })
        .run();

    for (const panda of nfts) {
        console.log("Matching ", panda.name);
        const nft = await metaplex
            .nfts()
            .findByMetadata({ metadata: panda.address })
            .run();
        const match = mintNameMap.find((value) => value.name === nft.name);

        if (match) {
            const oldMint = match.mint;
            const name = match.name;
            const newMint = nft.mint.address.toString();
            const blacklisted =
                blacklist.find((value) => value.old === match.mint) !==
                undefined;

            mapping.push({
                oldMint,
                newMint,
                name,
                blacklisted,
            });
        } else {
            throw new Error(`No matching Panda for ${nft.name}`);
        }
    }

    console.log("Writing Output");
    fs.writeFileSync("./old-new-mapping.json", JSON.stringify(mapping));
}

async function stepEightPointThree() {
    const mapping = require("./old-new-mapping.json") as OldNewMapping[];

    for (const panda of mapping) {
        console.log(
            `${panda.blacklisted ? "❌" : "✅"} ${panda.name?.padEnd(
                10
            )}: ${panda.oldMint.substring(0, 5)} -> ${panda.newMint.substring(
                0,
                5
            )}`
        );
    }
}

// spl-token transfer --fund-recipient 9JPNEKztHw5JrzbfJXQhszACAmYvCuA9hTpU1GV55Jsu 1 7RawqnUsUxA8pnb8nAUTgyzRaLVRYwR9yzPR3gfzbdht
async function stepEightPointThreeFour() {
    const mapping = require("./old-new-mapping.json") as OldNewMapping[];

    for (const panda of mapping) {
        if (panda.oldMint === "9JPNEKztHw5JrzbfJXQhszACAmYvCuA9hTpU1GV55Jsu") {
            try {
                await createRespawnPoint(
                    program,
                    new PublicKey(panda.oldMint),
                    new PublicKey(panda.newMint),
                    walletKeypair.publicKey
                );
            } catch (e) {
                console.log(e);
            }

            console.log("Done");
        }
    }
}

// Comment Out the stage you are at
// stepOne(); // Get all Mints from Collection
// stepTwo(); // Download all Assets
// stepThree(); // Generate new keypair mappings
// stepFour(); // Generate new metadata
// stepFourPointFive();
// stepSeven(); // Blacklist Pandas
// stepEight(); // Map Old-Name
// stepEightPointTwo(); // Map Old->New
// stepEightPointThree();
stepEightPointThreeFour();
// stepNine(); // Send Blacklist Pandas
// stepTen(); // Create Escrows
