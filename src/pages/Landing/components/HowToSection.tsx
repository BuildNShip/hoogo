import { motion } from "framer-motion";
import { Sparkles, Users, Share2 } from "lucide-react";
import styles from "./HowToSection.module.css";

const steps = [
  {
    icon: <Sparkles className={styles.stepIcon} />,
    title: "Create Your Event",
    description:
      "Create an event by just giving a name for the same. and connect with makemypass.com for some cool features.",
    image: "/landing/ht1.png",
  },
  {
    icon: <Users className={styles.stepIcon} />,
    title: "Generate The Grid",
    description:
      "Using the names of the people who have came for the event, generate the grid. and share the public link",
    image: "/landing/ht2.png",
  },
  {
    icon: <Share2 className={styles.stepIcon} />,
    title: "Network & Share",
    description:
      "Now, let the magic happen. People can connect with each other and share their details with each other.",
    image: "/landing/ht3.png",
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
