import { useNavigate, useParams } from "react-router-dom";
import styles from "./BingoCard.module.css";
import { useEffect, useState, useRef } from "react";
import { getBingoMatrix, getEventInfo } from "../../../apis/common";
import Footer from "../../../components/Footer/Footer";
import Modal from "../../../components/Modal/Modal";
import Navbar from "../../../components/Navbar/Navbar";
import { BeatLoader } from "react-spinners";
import { captureAndDownload, captureAndDownloadPost } from "./functions";
import { EventType } from "../Dashboard/EventDashboard/types";
import { motion, AnimatePresence } from "framer-motion";

interface BingoItem {
    name: string;
    liner: string;
    image: string;
}

const BingoCard = () => {
    const { ticketCode, eventName } = useParams();
    const dummyImageUrl = "/logoplace.png";
    const [bingoAnswers, setBingoAnswers] = useState<BingoItem[][]>([]);
    const [selectedCell, setSelectedCell] = useState<BingoItem | null>(null);
    const [eventInfo, setEventInfo] = useState<EventType | undefined>(undefined);
    const gridRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [storyTemplateImage, setStoryTemplateImage] = useState<HTMLImageElement | null>(null);
    const [postTemplateImage, setPostTemplateImage] = useState<HTMLImageElement | null>(null);
    const [isDownloading, setIsDownloading] = useState({
        story: false,
        post: false,
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("accessToken");

    useEffect(() => {
        const img = new Image();
        img.src = eventInfo?.story_template || "";
        img.crossOrigin = "anonymous";
        img.onload = () => setStoryTemplateImage(img);

        const postImg = new Image();
        postImg.src = eventInfo?.post_template || "";
        postImg.crossOrigin = "anonymous";
        postImg.onload = () => setPostTemplateImage(postImg);
    }, [eventInfo]);

    useEffect(() => {
        getBingoMatrix(eventName, ticketCode, setIsLoading, true).then((data) => {
            setBingoAnswers(data.answer);
        });
        if (eventName) getEventInfo(eventName, setEventInfo);
    }, [eventName, ticketCode]);

    const downloadPostImage = () => {
        if (canvasRef.current) {
            const link = document.createElement("a");
            link.href = canvasRef.current.toDataURL("image/png");
            link.download = `${ticketCode}_BingoPostCard.png`;
            link.click();
        }
    };

    const downloadImage = () => {
        if (canvasRef.current) {
            const link = document.createElement("a");
            link.href = canvasRef.current.toDataURL("image/png");
            link.download = `${ticketCode}_BingoStoryCard.png`;
            link.click();
        }
    };

    return (
        <>
            <div className={styles.backgroundContainer}>
                <div className={styles.outerContainer}>
                    <Navbar showLogin={true} />
                    {isAuthenticated && (
                        <div className={styles.headerActions}>
                            <motion.div
                                className={styles.gobackButton}
                                onClick={() => {
                                    navigate(`/${eventName}/leaderboard/`);
                                }}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {"<"}
                            </motion.div>
                            <h1 className={styles.eventTitle}>{eventName}</h1>
                        </div>
                    )}
                    <div className={styles.container}>
                        <AnimatePresence>
                            {selectedCell && (
                                <Modal onClose={() => setSelectedCell(null)} title="Bingo Card">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className={styles.personContainer}
                                    >
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
                                        <motion.button
                                            className={styles.backButton}
                                            onClick={() => setSelectedCell(null)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            Back
                                        </motion.button>
                                    </motion.div>
                                </Modal>
                            )}
                        </AnimatePresence>

                        {!isLoading && (
                            <div ref={gridRef} className={styles.grid}>
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
                                                onClick={() => cell.image && setSelectedCell(cell)}
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
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        <canvas
                            ref={canvasRef}
                            style={{
                                display: "none",
                            }}
                        />

                        <p className={styles.viewDescription}>
                            Click on the images to view your description about them.
                        </p>
                        <div className={styles.buttonsContainer}>
                            <motion.button
                                onClick={() => {
                                    captureAndDownload({
                                        setIsDownloading,
                                        gridRef,
                                        storyTemplateImage,
                                        canvasRef,
                                        downloadImage,
                                    });
                                }}
                                className={styles.captureButton}
                                whileHover={{ scale: 1.1, marginRight: 15 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isDownloading.story ? (
                                    <BeatLoader color="#252525" size={8} />
                                ) : (
                                    "Download Story Card"
                                )}
                            </motion.button>

                            <motion.button
                                onClick={() => {
                                    captureAndDownloadPost({
                                        setIsDownloading,
                                        gridRef,
                                        postTemplateImage,
                                        canvasRef,
                                        downloadPostImage,
                                    });
                                }}
                                className={styles.captureButton}
                                whileHover={{ scale: 1.1, marginLeft: 15 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isDownloading.post ? (
                                    <BeatLoader color="#252525" size={8} />
                                ) : (
                                    "Download Post Card"
                                )}
                            </motion.button>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default BingoCard;
