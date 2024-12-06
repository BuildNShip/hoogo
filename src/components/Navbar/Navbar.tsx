import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { CreateEventTypes } from "../../pages/Admin/Dashboard/types";

const Navbar = ({
    setCreateEvent,
    showLogin = false,
    showActionButtons = true,
}: {
    setCreateEvent?: React.Dispatch<React.SetStateAction<CreateEventTypes | undefined>>;
    showLogin?: boolean;
    showActionButtons?: boolean;
}) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("accessToken");
    return (
        <>
            <div
                className={styles.navbarContainer}
                style={
                    showActionButtons
                        ? { justifyContent: "space-between" }
                        : { justifyContent: "center" }
                }
            >
                <p className={styles.navbarBrandingText}>
                    <img src="/hoogologo.png" alt="" className={styles.brandingImage} />
                </p>
                {showActionButtons && (
                    <div className={styles.buttonsContainer}>
                        {(!showLogin || setCreateEvent) && (
                            <button
                                className={styles.navbarCTAButton}
                                onClick={() => {
                                    if (setCreateEvent)
                                        setCreateEvent({ name: "", showModal: true });
                                    else navigate("/login");
                                }}
                            >
                                {isAuthenticated ? "Create Event" : "Login"}
                            </button>
                        )}
                        {isAuthenticated && (
                            <p className={styles.userEmail}>
                                Hi, {localStorage.getItem("userEmail")?.split("@")[0]}
                            </p>
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
                )}
            </div>
        </>
    );
};

export default Navbar;
