import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export interface LogoutButtonProps {
    title: string;
}

const NavbarTitle = (props: LogoutButtonProps) => {
    const { title } = props;
    return (
        <div className="absolute left-0 top-5 z-30 w-screen">
            <div className="flex flex-col items-center justify-center px-2 py-2 opacity-70 shadow-lg hover:animate-pulse">
                <h1>{title}</h1>
            </div>
        </div>
    );
};
export default NavbarTitle;
