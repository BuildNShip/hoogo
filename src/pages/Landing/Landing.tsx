import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import styles from "./Landing.module.css";
import BackgroundEffects from "./components/BangroundEffects";
import Navbar from "./components/Navbar";
import NetworkingSection from "./components/NetworkingSection";
import UnlockRewards from "./components/UnlockRewards";
import HowToSection from "./components/HowToSection";
import TestimonialsSection from "./components/TestimonialSection";

function Landing() {
  return (
    <div className={styles.container}>
      <BackgroundEffects />
      <Navbar />

      <main className={styles.main}>
        <section className={styles.hero}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              className={styles.preTitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              from the <span>team of makemypass.com</span>
            </motion.p>
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className={styles.highlight}>Play</span> human bingo <br />
              <span className={styles.highlight}>in-minutes,</span> not hours
            </motion.h1>
            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Transform your networking experience at events with our
              interactive human bingo platform. Make meaningful connections,
              naturally.
            </motion.p>
            <motion.div
              className={styles.cta}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a href="/login">
                <button className={styles.ctaButton}>
                  Create Hoogo <ArrowRight size={20} />
                </button>
              </a>
              <div className={styles.rating}>
                <span>★★★★★</span> 2461 players connected
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className={styles.heroImageWrapper}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src="/landing/hero.png"
              alt="People networking"
              className={styles.heroImage}
            />
            <p className={styles.imageAlert}>
              People networking get to share their experience as in above
              templates
            </p>
          </motion.div>
        </section>

        <div id="how-it-works">
          <HowToSection />
        </div>
        <NetworkingSection />
        <div id="rewards">
          <UnlockRewards />
        </div>
        <TestimonialsSection />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2024 Hoomans Project Pvt Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
