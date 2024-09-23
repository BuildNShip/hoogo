import React from 'react';
import styles from './Landing.module.css';

const testimonials = [
  {
    id: 1,
    author: 'Muzammil Ibrahim',
    text: 'Impressed by the team\'s quick execution. Excited for a bug-free version next time!"',
  },
  {
    id: 2,
    author: 'Sangeeth Joseph',
    text: 'The Bingo app was fantastic! The gamified approach boosted socializing. Great idea and execution',
  },
  {
    id: 3,
    author: 'Mohamed Aslam',
    text: 'Hoogo is  fun, interesting, and exciting game where can connect with each other while playing. It’s a great way to make connections in a programs like meet-up or community events.',
  },
  {
    id: 4,
    author: 'Ashiq Ali N K',
    text: 'The game was fun and helped me connect with people, especially with all the selfies! With a bit more planning, the lag and bugs could’ve been avoided.',
  }
];

const TestimonialSection: React.FC = () => {
  return (
    <section className={styles.testimonialSection}>
      <h2 className={styles.sectionTitle}><span>let's hear</span> from them</h2>
      <div className={styles.testimonialGrid}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className={styles.testimonialCard}>
            <p className={styles.testimonialText}>{testimonial.text}</p>
            <div className={styles.testimonialAuthor}>
              <span className={styles.authorName}>{testimonial.author}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;