import { useParams } from "react-router-dom";
import styles from "./BingoCard.module.css";
import { useEffect, useState, useRef } from "react";
import { getBingoMatrix } from "../../../apis/common";
import Footer from "../../../components/Footer/Footer";
import Modal from "../../../components/Modal/Modal";
import Navbar from "../../../components/Navbar/Navbar";
import { BeatLoader } from "react-spinners";
import { captureAndDownload, captureAndDownloadPost } from "./functions";

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
    const gridRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [storyTemplateImage, setStoryTemplateImage] = useState<HTMLImageElement | null>(null);
    const [postTemplateImage, setPostTemplateImage] = useState<HTMLImageElement | null>(null);
    const [isDownloading, setIsDownloading] = useState({
        story: false,
        post: false,
    });

    // Load the template image
    useEffect(() => {
        const img = new Image();
        img.src = "/templates/elevateStoryTemplate.png"; // Adjust this path
        img.crossOrigin = "anonymous";
        img.onload = () => setStoryTemplateImage(img);

        const postImg = new Image();
        postImg.src = "/templates/elevatePostTemplate.png"; // Adjust this path
        postImg.crossOrigin = "anonymous";
        postImg.onload = () => setPostTemplateImage(postImg);
    }, []);

    // Fetch Bingo Matrix
    useEffect(() => {
        getBingoMatrix(eventName, ticketCode).then((data) => {
            setBingoAnswers(data.answer);
        });
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
                    <Navbar />
                    <div className={styles.container}>
                        {selectedCell && (
                            <Modal onClose={() => setSelectedCell(null)} title="Bingo Card">
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
                                    <button
                                        className={styles.backButton}
                                        onClick={() => setSelectedCell(null)}
                                    >
                                        Back
                                    </button>
                                </div>
                            </Modal>
                        )}

                        <div ref={gridRef} className={styles.grid}>
                            {bingoAnswers.map((row, rowIndex) => (
                                <div key={rowIndex} className={styles.row}>
                                    {row.map((cell, cellIndex) => (
                                        <div
                                            key={cellIndex}
                                            className={styles.cell}
                                            onClick={() => cell.image && setSelectedCell(cell)}
                                        >
                                            <img
                                                src={cell.image ? cell.image : dummyImageUrl}
                                                alt={cell.name}
                                                className={styles.image}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <canvas
                            ref={canvasRef}
                            style={{
                                display: "none",
                            }}
                        />

                        <p className={styles.tagHelper}>
                            Don't forget to tag us{" "}
                            <a
                                href="https://www.instagram.com/makemypass/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>@makemypass</span>
                            </a>{" "}
                            and{" "}
                            <a
                                href="https://www.instagram.com/life.at.reflections/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span>@life.at.reflections</span>
                            </a>
                        </p>
                        <p className={styles.viewDescription}>
                            Click on the images to view your description about them.
                        </p>
                        <div className={styles.buttonsContainer}>
                            {/* Buttons for Capturing and Downloading */}
                            <button
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
                            >
                                {isDownloading.story ? (
                                    <BeatLoader color="#252525" size={8} />
                                ) : (
                                    "Download Story Card"
                                )}
                            </button>

                            <button
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
                            >
                                {isDownloading.post ? (
                                    <BeatLoader color="#252525" size={8} />
                                ) : (
                                    "Download Post Card"
                                )}
                            </button>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default BingoCard;
