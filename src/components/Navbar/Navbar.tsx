import styles from "./Navbar.module.css";

const Navbar = () => {
    return (
        <>
            <div className={styles.navbarContainer}>
                <p className={styles.navbarBrandingText}>Hoogo</p>
                <button className={styles.navbarCTAButton}>Create Hoogo</button>
            </div>
        </>
    );
};

export default Navbar;
