import { motion } from "framer-motion";
import styles from "./BackgroundEffects.module.css";

export default function BackgroundEffects() {
  return (
    <>
      <div className="network-grid" />
      <div className={styles.connectionLines}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="connection-line"
            style={{
              top: `${20 + i * 15}%`,
              left: `${i * 5}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
