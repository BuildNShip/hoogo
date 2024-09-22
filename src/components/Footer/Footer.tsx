import { FaGithub, FaInstagram, FaTelegram, FaTwitter } from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <>
      <div className={styles.footer}>
        <a href="https://buildnship.in/">
          <img src="/blogo1.png" alt="logo" />
        </a>
        <div className={styles.social_container}>
          <a href="https://twitter.com/buildnship/">
            <FaTwitter size={25} />
          </a>
          <a href="https://instagram.com/buildnship?igshid=YmMyMTA2M2Y=">
            <FaInstagram size={25} />
          </a>
          <a href="https://github.com/BuildNShip">
            <FaGithub size={25} />
          </a>
          <a href="https://t.me/buildnship">
            <FaTelegram size={25} />
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
