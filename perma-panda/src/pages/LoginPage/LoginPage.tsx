import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Footer from "../../components/Footer/Footer";
import GithubButton from "../../components/GithubButton/GithubButton";
import PageWrapper from "../../components/PageWrapper/PageWrapper";

const LoginPage = () => {
    return (
        <PageWrapper>
            <GithubButton />
            <h1 className="mx-auto mb-5 text-center align-middle text-3xl text-white">
                RPS Respawn
            </h1>
            <WalletMultiButton className="mx-5" />
            <Footer />
        </PageWrapper>
    );
};
export default LoginPage;
