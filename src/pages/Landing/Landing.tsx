import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";

const testimonials = [
    {
        id: 1,
        name: "Muzammil Ibrahim",
        quote: "Impressed by the team's quick execution. Excited for a bug-free version next time!\"",
    },
    {
        id: 2,
        name: "Sangeeth Joseph",
        quote: "The Bingo app was fantastic! The gamified approach boosted socializing. Great idea and execution",
    },
    {
        id: 3,
        name: "Mohamed Aslam",
        quote: "Hoogo is  fun, interesting, and exciting game where can connect with each other while playing. It’s a great way to make connections in a programs like meet-up or community events.",
    },
    {
        id: 4,
        name: "Ashiq Ali N K",
        quote: "The game was fun and helped me connect with people, especially with all the selfies! With a bit more planning, the lag and bugs could’ve been avoided.",
    },
    {
        id: 5,
        name: "Anirudhan Vinod",
        quote: "Loved how the Hoogo team brought this idea to life! Perfect as a networking icebreaker. No bugs, and I connected with 7-8 new friends smoothly. Kudos to the team!",
    },
];

export default function Landing() {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    return (
        <motion.div
            className={styles.container}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.nav className={styles.navbar} variants={itemVariants}>
                <div className={styles.logo}>HOOGO</div>
                <div className={styles.navLinks}>
                    <button className={styles.signUpButton} onClick={() => navigate("/login")}>
                        Sign Up
                    </button>
                </div>
            </motion.nav>

            <motion.main className={styles.main} variants={itemVariants}>
                <div className={styles.content}>
                    <motion.p className={styles.preTitle} variants={itemVariants}>
                        from the <span>team of makemypass.com</span>
                    </motion.p>
                    <motion.h1 className={styles.title} variants={itemVariants}>
                        <span className={styles.highlight}>Play</span> human bingo <br />
                        <span className={styles.highlight}>in-minutes,</span> not hours
                    </motion.h1>
                    <motion.p className={styles.subtitle} variants={itemVariants}>
                        The ultimate tool for community meetups and team-building events. Create,
                        play, and make networking faster and fun.
                    </motion.p>
                    <motion.div className={styles.rating} variants={itemVariants}>
                        <span>★★★★★</span> 461 players build connections faster
                    </motion.div>
                    <motion.button
                        className={styles.ctaButton}
                        onClick={() => navigate("/dashboard")}
                        variants={itemVariants}
                        whileHover={{
                            scale: 1.05,
                            transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Playing
                    </motion.button>
                </div>
                <motion.div
                    className={styles.imageGrid}
                    variants={itemVariants}
                    whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 },
                    }}
                >
                    <img
                        src="/landingimage.png"
                        alt="Hoogo Game Board"
                        className={styles.gridImage}
                    />
                </motion.div>
            </motion.main>

            <motion.section
                className={styles.testimonialsSection}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.6,
                        ease: "easeOut",
                    },
                }}
                viewport={{ once: true }}
            >
                <div className={styles.testimonialsContent}>
                    <motion.h2
                        className={styles.testimonialsTitle}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5 },
                        }}
                        viewport={{ once: true }}
                    >
                        What <span className={styles.highlight}>Players</span> Say
                    </motion.h2>
                    <div className={styles.testimonialsGrid}>
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className={styles.testimonialCard}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.5,
                                        delay: index * 0.2,
                                    },
                                }}
                                viewport={{ once: true }}
                                whileHover={{
                                    scale: 1.03,
                                    transition: { duration: 0.2 },
                                }}
                            >
                                <p className={styles.testimonialQuote}>"{testimonial.quote}"</p>
                                <div className={styles.testimonialAuthor}>
                                    <p className={styles.testimonialName}>{testimonial.name}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <footer className={styles.footer}>
                <div className={styles.footerBottom}>
                    <p>&copy; 2024 Hoogo. All rights reserved.</p>
                </div>
            </footer>
        </motion.div>
    );
}
