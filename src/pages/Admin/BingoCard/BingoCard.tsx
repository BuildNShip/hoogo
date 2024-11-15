import { useParams } from "react-router-dom";
import styles from "./BingoCard.module.css";
import { useEffect, useState } from "react";
import { getBingoMatrix } from "../../../apis/common";
import Footer from "../../../components/Footer/Footer";

interface BingoItem {
    name: string;
    liner: string;
    image: string;
}

const BingoCard = () => {
    const { playerName, eventName } = useParams();
    const dummyImageUrl = "/logoplace.png";
    const [bingoAnswers, setBingoAnswers] = useState<BingoItem[][]>([]);

    useEffect(() => {
        getBingoMatrix(eventName, playerName).then((data) => {
            setBingoAnswers(data.answer);
        });
    }, [eventName, playerName]);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {bingoAnswers.map((item, index) => (
                    <>
                        <div key={index} className={styles.row}>
                            {item.map((cell, cellIndex) => (
                                <div key={cellIndex} className={styles.cell}>
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
