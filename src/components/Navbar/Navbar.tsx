import { useParams } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { eventName } = useParams();
  return (
    <>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLogo}>
          <img src="/navlogo.png" alt="hoogo" className={styles.logo} />
        </div>
        <div className={styles.navLinks}>
          <a href="/login" className={styles.navLink}>
            Login
          </a>
          <a href={`${eventName}/admin/leaderboard`} className={styles.navLink}>
            Leaderboard
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
