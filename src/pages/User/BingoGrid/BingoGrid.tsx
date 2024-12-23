import { useEffect, useState } from "react";
import { getBingoMatrix } from "../../../apis/common";
import { useParams } from "react-router-dom";
import GridComponent from "./components/GridComponent/GridComponent";
import { PacmanLoader } from "react-spinners";
import styles from "./BingoGrid.module.css";
import Footer from "../../../components/Footer/Footer";

interface BingoCell {
    image: string | undefined;
    name: string | undefined;
    liner: string | undefined;
}

const BingoGrid = () => {
    const { eventName, ticketCode } = useParams();
    const [loading, setLoading] = useState(true);
    const [letters, setLetters] = useState<string[][]>([]);
    const [cells, setCells] = useState<BingoCell[][]>([]);

    useEffect(() => {
        setLoading(true);
        getBingoMatrix(eventName, ticketCode, setLoading)
            .then((data) => {
                setCells(data.answer);
                setLetters(data.question);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [eventName, ticketCode]);

    return (
        <>
            <div className={styles.backgroundContainer}>
                <div className={styles.outerContainer}>
                    {loading ? (
                        <div className={styles.loaderMainContainer}>
                            <div className={styles.loaderContainer}>
                                <PacmanLoader
                                    color="#1ED45E"
                                    loading
                                    size={25}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                />
                            </div>
                            <p className={styles.loadingText}>
                                Loading your bingo card. Please wait...
                            </p>
                        </div>
                    ) : (
                        <GridComponent cells={cells} letters={letters} setCells={setCells} />
                    )}
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default BingoGrid;
