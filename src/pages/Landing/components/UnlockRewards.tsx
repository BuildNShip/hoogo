import { motion } from "framer-motion";
import { Trophy, Share2, Download } from "lucide-react";
import styles from "./UnlockRewards.module.css";

export default function UnlockRewards() {
  const rewards = [
    {
      icon: <Trophy />,
      title: "Achievement Grid",
      description:
        "Showcase your networking milestones with a beautifully designed achievement grid",
    },
    {
      icon: <Share2 />,
      title: "Social Sharing",
      description:
        "Share your connections and achievements across your professional networks",
    },
    {
      icon: <Download />,
      title: "Digital Memento",
      description:
        "Download a personalized memory(image in first section) of your event connections and experiences",
    },
  ];

  return (
    <section className={styles.rewardsSection} id="rewards">
      <motion.div
        className={styles.rewardsContent}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.title}>
          Unlock Special <span className={styles.highlight}>Rewards</span>
        </h2>
        <p className={styles.subtitle}>
          Connect with 5 people to unlock your personalized networking
          achievements
        </p>

        <div className={styles.rewardsGrid}>
          {rewards.map((reward, index) => (
            <motion.div
              key={index}
              className={styles.rewardCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.iconWrapper}>{reward.icon}</div>
              <h3>{reward.title}</h3>
              <p>{reward.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
