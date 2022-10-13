import { FaGithub } from "react-icons/fa";

const GithubButton = () => {
    return (
        <a
            href="https://github.com/CoachChuckFF/RPS-Respawn"
            target="_blank"
            className="fixed left-5 top-5 z-50 px-2 py-2 opacity-70 shadow-lg hover:animate-pulse"
        >
            <FaGithub size={21} color="white" />
        </a>
    );
};
export default GithubButton;
