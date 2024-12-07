import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import styles from "./TestimonialSection.module.css";

const testimonials = [
  {
    id: 1,
    author: "Muzammil Ibrahim",
    text: "Impressed by the team's quick execution. Excited for a bug-free version next time!\"",
  },
  {
    id: 2,
    author: "Sangeeth Joseph",
    text: "The Bingo app was fantastic! The gamified approach boosted socializing. Great idea and execution",
  },
  {
    id: 3,
    author: "Mohamed Aslam",
    text: "Hoogo is fun, interesting, and exciting game where can connect with each other while playing. Its a great way to make connections in programs like meet-up or community events.",
  },
  {
    id: 4,
    author: "Ashiq Ali N K",
    text: "The game was fun and helped me connect with people, especially with all the selfies! With a bit more planning, the lag and bugs could have been avoided.",
  },
  {
    id: 5,
    author: "Anirudhan Vinod",
    text: "Loved how the Hoogo team brought this idea to life! Perfect as a networking icebreaker. No bugs, and I connected with 7-8 new friends smoothly. Kudos to the team!",
  },
];

export default function TestimonialsSection() {
  return (
    <section className={styles.testimonials} id="testimonials">
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.title}>
          What Our <span className={styles.highlight}>Players</span> Say
        </h2>
        <p className={styles.subtitle}>
          Join hundreds of Individuals who've transformed their networking
          experience
        </p>

        <div className={styles.grid}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <Quote className={styles.quoteIcon} size={24} />
              <p className={styles.text}>{testimonial.text}</p>
              <div className={styles.author}>
                <div className={styles.authorAvatar}>
                  {testimonial.author.charAt(0)}
                </div>
                <span className={styles.authorName}>{testimonial.author}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
