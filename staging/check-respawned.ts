import { Connection, PublicKey } from "@solana/web3.js";

const RESPAWN_PROGRAM_ACCOUNT = new PublicKey(
    "Dou1Phg8n1T1UUGV67ba9ZPS17urgtZHZ9UYGmpwv5Mu"
);
const connection = new Connection(
    "https://quiet-muddy-log.solana-mainnet.quiknode.pro/4fffdad3de6974646ada97e9a6941f6aa3c5fd8e/",
);

const getPandasRespawned = async (communityWallet: PublicKey) => {
    const respawnAccounts = await connection.getProgramAccounts(
        RESPAWN_PROGRAM_ACCOUNT,
        {
            // The mint address is located at byte 33 and lasts for 32 bytes.
            dataSlice: { offset: 73, length: 32 },

            filters: [
                // Only get Respawn Accounts
                { dataSize: 105 },

                // Filter Using Community Wallet
                {
                    memcmp: {
                        offset: 73,
                        bytes: communityWallet.toBase58(),
                    },
                },
            ],
        }
    );

    console.log("Panda's Not Respawned: " + respawnAccounts.length);

}

getPandasRespawned(new PublicKey("FWwWkx3i1enW7h6fZgGMuzYaLua7FEcFjANJd39wPipq"));