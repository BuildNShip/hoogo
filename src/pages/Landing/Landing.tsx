import React from "react";
import styles from "./Landing.module.css";
import FloatingImages from "./FloatingImages";

const HoogoLanding: React.FC = () => {
  return (
    <div className={styles.container}>
      <FloatingImages />
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}></span> Hoogo
        </div>
      </header>
      <div className={styles.row}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <span className={styles.highlight}>Play</span> human bingo <br />
            <span className={styles.highlight}>in-minutes,</span>
            not hours
          </h1>
          <p className={styles.subtitle}>
            The ultimate tool for community meetups and team-building events.
            Create, play, and share your Hoogo games faster than ever.
          </p>
          <div className={styles.rating}>
            <span>★★★★★</span> 124 players build connections faster
          </div>
          <a
            href="https://wa.me/916238450178"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className={styles.ctaButton}>Get Hoogo</button>
          </a>
          <div className={styles.offer}>
            Still not convinced? Try Hoogo for free for one event.
          </div>
          <div className={styles.offer}></div>
        </main>
        <div className={styles.imageGrid}>
          {/* Replace with actual Hoogo game board images */}
          <img
            src="/landingimage.png"
            alt="Hoogo Game Board 1"
            className={styles.gridImage}
          />
        </div>
      </div>
    </div>
  );
};

export default HoogoLanding;
