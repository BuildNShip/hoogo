import { motion } from "framer-motion";
import { Network, Users, Share } from "lucide-react";
import styles from "./NetworkingSection.module.css";

export default function NetworkingSection() {
  return (
    <section className={styles.networkingSection}>
      <motion.div
        className={styles.networkingContent}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.sectionTitle}>
          Transform Your{" "}
          <span className={styles.highlight}>Offline Events</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Make networking fun, engaging, and memorable with Hoogo
        </p>

        <div className={styles.featuresGrid}>
          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Network className={styles.featureIcon} />
            <h3>Interactive Networking</h3>
            <p>
              Break the ice naturally through fun, gamified interactions that
              get people talking
            </p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Users className={styles.featureIcon} />
            <h3>Perfect for Events</h3>
            <p>
              Ideal for conferences, meetups, team buildings, and any gathering
              where connections matter
            </p>
          </motion.div>

          <motion.div
            className={styles.featureCard}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Share className={styles.featureIcon} />
            <h3>Memorable Connections</h3>
            <p>
              Create lasting relationships through meaningful interactions and
              shared experiences
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
