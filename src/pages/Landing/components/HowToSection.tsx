import { motion } from "framer-motion";
import { Sparkles, Users, Share2 } from "lucide-react";
import styles from "./HowToSection.module.css";

const steps = [
  {
    icon: <Sparkles className={styles.stepIcon} />,
    title: "Create Your Grid",
    description:
      "Design your custom Hoogo grid with fun networking prompts and challenges tailored to your event.",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    icon: <Users className={styles.stepIcon} />,
    title: "Connect & Play",
    description:
      "Share your grid with event participants and start networking through engaging challenges.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
  {
    icon: <Share2 className={styles.stepIcon} />,
    title: "Share & Remember",
    description:
      "Complete 5 cells to unlock your shareable Hoogo grid - a perfect memento of your networking success!",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
  },
];

export default function HowToSection() {
  return (
    <section className={styles.howToSection}>
      <motion.div
        className={styles.howToContent}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.sectionTitle}>
          How to Create Your <span className={styles.highlight}>Hoogo</span>
        </h2>
        <p className={styles.sectionSubtitle}>
          Three simple steps to transform your networking experience
        </p>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={styles.stepCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className={styles.stepIconWrapper}>{step.icon}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
              <div className={styles.stepImageWrapper}>
                <img
                  src={step.image}
                  alt={step.title}
                  className={styles.stepImage}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
