import React, { useEffect } from "react";
import styles from "./Landing.module.css";
import FloatingImages from "./FloatingImages";
import TestimonialSection from "./TestimonialSection";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const HoogoLanding: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className={styles.container}>
        <FloatingImages />
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}></span> Hoogo
          </div>
        </header>
        <div className={styles.row}>
          <main className={styles.main}>
            <p className={styles.preTitle}>
              from the <span>team of makemypass.com</span>
            </p>
            <h1 className={styles.title}>
              <span className={styles.highlight}>Play</span> human bingo <br />
              <span className={styles.highlight}>in-minutes,</span>
              not hours
            </h1>
            <p className={styles.subtitle}>
              The ultimate tool for community meetups and team-building events.
              Create, play, and make networking faster and fun.
            </p>
            <div className={styles.rating}>
              <span>★★★★★</span> 124 players build connections faster
            </div>

            <button
              className={styles.ctaButton}
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Start Playing
            </button>
          </main>
          <div className={styles.imageGrid}>
            <img
              src="/landingimage.png"
              alt="Hoogo Game Board 1"
              className={styles.gridImage}
            />
          </div>
        </div>
        <TestimonialSection />
      </div>

      <Footer />
    </>
  );
};

export default HoogoLanding;
