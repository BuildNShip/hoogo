import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { CreateEventTypes } from "../../pages/Admin/Dashboard/types";

const Navbar = ({
    setCreateEvent,
    showLogin = false,
}: {
    setCreateEvent?: React.Dispatch<React.SetStateAction<CreateEventTypes | undefined>>;
    showLogin?: boolean;
}) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("accessToken");
    return (
        <>
            <div className={styles.navbarContainer}>
                <p className={styles.navbarBrandingText}>
                    <img src="/hoogologo.png" alt="" className={styles.brandingImage} />
                </p>
                <div className={styles.buttonsContainer}>
                    {!showLogin && (
                        <button
                            className={styles.navbarCTAButton}
                            onClick={() => {
                                if (setCreateEvent) setCreateEvent({ name: "", showModal: true });
                                else navigate("/login");
                            }}
                        >
                            {isAuthenticated ? "Create Event" : "Login"}
                        </button>
                    )}
                    {isAuthenticated && (
                        <button
                            className={styles.navbarSecondaryCTA}
                            onClick={() => {
                                localStorage.clear();
                                navigate("/login");
                            }}
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
