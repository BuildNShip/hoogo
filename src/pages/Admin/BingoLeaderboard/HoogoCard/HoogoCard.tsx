import { motion } from "framer-motion";
import styles from "./HoogoCard.module.css";
const dummyImageUrl = "/logoplace.png";

const HoogoCard = ({
    bingoAnswers,
}: {
    bingoAnswers: {
        name: string;
        image: string;
    }[][];
}) => {
    return (
        <>
            <div className={styles.grid}>
                {bingoAnswers.map((row, rowIndex) => (
                    <motion.div
                        key={rowIndex}
                        className={styles.row}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {row.map((cell, cellIndex) => (
                            <motion.div
                                key={cellIndex}
                                className={styles.cell}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={cell.image ? cell.image : dummyImageUrl}
                                    alt={cell.name}
                                    className={styles.image}
                                />
                                {cell.name && <p className={styles.nameOverlay}>{cell.name}</p>}
                            </motion.div>
                        ))}
                    </motion.div>
                ))}
            </div>
        </>
    );
};

export default HoogoCard;
