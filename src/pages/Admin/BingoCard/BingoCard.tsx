import { useParams } from "react-router-dom";
import styles from "./BingoCard.module.css";
import { useEffect, useState } from "react";
import { getBingoMatrix } from "../../../apis/common";
import Footer from "../../../components/Footer/Footer";
import Modal from "../../../components/Modal/Modal";

interface BingoItem {
    name: string;
    liner: string;
    image: string;
}

const BingoCard = () => {
    const { playerName, eventName } = useParams();
    const dummyImageUrl = "/logoplace.png";
    const [bingoAnswers, setBingoAnswers] = useState<BingoItem[][]>([]);

    const [selectedCell, setSelectedCell] = useState<BingoItem | null>(null);

    useEffect(() => {
        getBingoMatrix(eventName, playerName).then((data) => {
            setBingoAnswers(data.answer);
        });
    }, [eventName, playerName]);

    return (
        <div className={styles.container}>
            {selectedCell && (
                <Modal
                    onClose={() => {
                        setSelectedCell(null);
                    }}
                    title="Bingo Card"
                >
                    <div className={styles.personContainer}>
                        <div className={styles.floatingContainer}>
                            <div className={styles.floatingText}>
                                <p className={styles.personDescriptionHeader}>
                                    About <span>{selectedCell.name}</span>
                                </p>
                                <div className={styles.personDescription}>
                                    <div className={styles.personImageContainer}>
                                        <img
                                            className={styles.personImage}
                                            src={selectedCell.image}
                                            alt={selectedCell.name}
                                        />
                                    </div>
                                    {selectedCell.liner}
                                </div>
                            </div>
                        </div>

                        <button className={styles.backButton} onClick={() => setSelectedCell(null)}>
                            Back
                        </button>
                    </div>
                </Modal>
            )}
            <div className={styles.grid}>
                <p className={styles.playerName}>{playerName}'s BINGO Card for Elevate'24</p>
                {bingoAnswers.map((item, index) => (
                    <>
                        <div key={index} className={styles.row}>
                            {item.map((cell, cellIndex) => (
                                <div
                                    key={cellIndex}
                                    className={styles.cell}
                                    onClick={() => {
                                        if (cell.image) setSelectedCell(cell);
                                    }}
                                >
                                    <img
                                        src={cell.image ? cell.image : dummyImageUrl}
                                        alt={cell.name}
                                        className={styles.image}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ))}
            </div>
            <Footer />
            {/* <h1 className={styles.title}>{playerName}'s BINGO Card</h1> */}
        </div>
    );
};

export default BingoCard;
