import { useMemo } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// export const DEFAULT_RPC = "https://api.devnet.solana.com";
export const DEFAULT_RPC =
    "https://quiet-muddy-log.solana-mainnet.quiknode.pro/4fffdad3de6974646ada97e9a6941f6aa3c5fd8e/";
export const DEFAULT_NETWORK = "mainnet-beta";
// export const DEFAULT_NETWORK = "devnet";
export const DEFAULT_SKIP_PREFLIGHT = true;
export const DEFAULT_COMMITMENT = "max";
export const DEFAULT_AUTOCONNECT = true;

export default function SolanaWalletProvider({ children }: any) {
    const endpoint = useMemo(() => DEFAULT_RPC, [DEFAULT_NETWORK]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new GlowWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter({
                network: DEFAULT_NETWORK as WalletAdapterNetwork,
            }),
            new TorusWalletAdapter(),
        ],
        [DEFAULT_NETWORK]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={DEFAULT_AUTOCONNECT}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
