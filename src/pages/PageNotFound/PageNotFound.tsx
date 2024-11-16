import { useNavigate } from "react-router-dom";
import styles from "./PageNotFound.module.css";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className={styles.mainContainer}>
        <div className={styles.loginContainer}>
          <div className={styles.logoContainerHeader}>
            <h1 className={styles.pageHeaderText}>
              4<span>0</span>4
            </h1>
            <div>
              <p className={styles.loginContainerHeaderText}>Page Not Found</p>
              <p className={styles.loginContainerDescription}>
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>

          <div className={styles.inputFieldContainer}>
            <button
              onClick={() => navigate("/")}
              className={styles.loginButton}
            >
              Return Home
            </button>
          </div>

          <p className={styles.funFact}>
            It seems like you've entered the wrong URL or there isn't such an
            event. Kindly check the URL and try again.
          </p>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PageNotFound;
