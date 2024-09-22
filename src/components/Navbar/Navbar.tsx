import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLogo}>
          <img src="/navlogo.png" alt="hoogo" className={styles.logo} />
        </div>
      </div>
    </>
  );
};

export default Navbar;
