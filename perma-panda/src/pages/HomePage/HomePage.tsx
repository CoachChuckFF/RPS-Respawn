import { Metaplex } from "@metaplex-foundation/js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useContext, useEffect, useState } from "react";
import GithubButton from "../../components/GithubButton/GithubButton";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import NavbarTitle from "../../components/NavbarTitle/NavbarTitle";
import PageWrapper from "../../components/PageWrapper/PageWrapper";
import { checkIfBlackListed } from "../../controllers/respawn";
import { getProgramFromReactHooks } from "../../controllers/Respawn/accounts/program";
import { StoreContext } from "../../controllers/Store/StoreProvider";
import { PandaTile } from "./PandaTile";

export interface RespawnPanda {
    name: string;
    url: string;
    address: PublicKey;
}

enum LoadingState {
    notConnected = "not connected",
    loading = "loading",
    loaded = "loaded",
    error = "error",
}

function HomePage() {
    const walletContext = useWallet();
    const connectionContext = useConnection();

    const [state, setState] = useState<LoadingState>(LoadingState.notConnected);
    const [error, setError] = useState<string>("");
    const [pandasToRespawn, setPandasToRespawn] = useState<RespawnPanda[]>([]);

    const metaplex = Metaplex.make(connectionContext.connection);
    const program = getProgramFromReactHooks(walletContext, connectionContext);

    useEffect(() => {
        loadPandas();
    }, [walletContext.publicKey]);

    const loadPandas = async () => {
        if (walletContext.publicKey) {
            setState(LoadingState.loading);
            metaplex
                .nfts()
                .findAllByOwner({
                    owner: walletContext.publicKey,
                })
                .run()
                .then(async (nfts) => {
                    const pandaList: RespawnPanda[] = [];
                    const pandas = nfts.filter((value) => {
                        if (value.creators && value.creators.length > 0) {
                            return value.creators[0].address.equals(
                                new PublicKey(
                                    "4xESs1McQbwhXhWjpVBZ7Tb6gXNqH7grVbwTKZNjjk6V"
                                )
                            );
                        }

                        return false;
                    });
                    
                    for (const panda of pandas) {
                        pandaList.push({
                            name: panda.name,
                            url: panda.uri,
                            address: panda.address,
                        });
                    }

                    setPandasToRespawn(pandaList);
                    setState(LoadingState.loaded);
                })
                .catch((e) => {
                    setError(`${e}`);
                    console.log(`${e}`);
                    setState(LoadingState.error);
                });
        } else {
            setState(LoadingState.notConnected);
            setError("");
            setPandasToRespawn([]);
        }
    };

    const {
        logout: [logout],
    } = useContext(StoreContext);

    const renderState = () => {
        if (
            state !== LoadingState.loading &&
            state !== LoadingState.notConnected
        )
            return null;
        return <>{state + " " + error}</>;
    };

    const renderPandas = () => {
        if (state !== LoadingState.loaded) return null;

        if (pandasToRespawn.length === 0) {
            return <>No Pandas to Respawn</>;
        }

        return (
            <div className="grid h-screen grid-cols-2 gap-4 overflow-auto px-10 pt-20 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {pandasToRespawn.map((panda) => {
                    return (
                        <PandaTile
                            key={panda.address.toString() + "Render"}
                            panda={panda}
                            program={program}
                            metaplex={metaplex}
                        />
                    );
                })}
            </div>
        );
    };

    const renderActions = () => {
        return (
            <div className="pt-30 flex w-screen flex-col items-center justify-center">
                {renderPandas()}
                {renderState()}
            </div>
        );
    };

    return (
        <PageWrapper>
            <NavbarTitle title={walletContext.publicKey?.toString() ?? ""} />
            <LogoutButton onLogout={logout} />
            <GithubButton />
            {renderActions()}
        </PageWrapper>
    );
}
export default HomePage;
