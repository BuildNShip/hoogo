import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import styles from "./Footer.module.css";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <>
      <div className={styles.footerOuterContainer}>
        <div className={styles.footer}>
          <a href="https://makemypass.com/">
            <img src="/logod.png" alt="logo" />
          </a>
          <div className={styles.social_container}>
            <a href="https://www.instagram.com/makemypass/">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.linkedin.com/company/makemypass/">
              <FaLinkedinIn size={20} />
            </a>
            <a href="https://x.com/makemypass_x">
              <FaXTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
