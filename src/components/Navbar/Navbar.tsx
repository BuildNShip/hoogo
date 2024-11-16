import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.navbarContainer}>
        <p className={styles.navbarBrandingText}>Hoogo</p>
        {/* <button
          className={styles.navbarCTAButton}
          onClick={() => {
            navigate("/login");
          }}
        >
          Create Hoogo
        </button> */}
      </div>
    </>
  );
};

export default Navbar;
