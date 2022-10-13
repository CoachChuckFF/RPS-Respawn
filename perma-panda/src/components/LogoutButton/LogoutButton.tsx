import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export interface LogoutButtonProps {
    onLogout: () => void;
}

const LogoutButton = (props: LogoutButtonProps) => {
    const { onLogout } = props;
    return (
        <div
            onClick={onLogout}
            className="fixed right-5 top-5 z-50 px-2 py-2 opacity-70 shadow-lg hover:animate-pulse"
        >
            <FontAwesomeIcon
                size="lg"
                color="white"
                icon={faRightFromBracket}
            />
        </div>
    );
};
export default LogoutButton;
