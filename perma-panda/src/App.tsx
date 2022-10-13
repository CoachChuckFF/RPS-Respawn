import SolanaWalletProvider from "./controllers/SolanaProvider/SolanaProvider";
import StoreProvider from "./controllers/Store/StoreProvider";
import Router from "./pages/Router";

function App() {
    return (
        <>
            <SolanaWalletProvider>
                <StoreProvider>
                    <Router />
                </StoreProvider>
            </SolanaWalletProvider>
        </>
    );
}
export default App;
