import { useParams } from "react-router-dom";
import styles from "./BingoCard.module.css";
import { useEffect, useState, useRef } from "react";
import { getBingoMatrix } from "../../../apis/common";
import Footer from "../../../components/Footer/Footer";
import Modal from "../../../components/Modal/Modal";
import html2canvas from "html2canvas";
import Navbar from "../../../components/Navbar/Navbar";
import { BeatLoader } from "react-spinners";

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
    const [templateImage, setTemplateImage] = useState<HTMLImageElement | null>(null);
    const [isDownloading, setIsDownloading] = useState({
        story: false,
        post: false,
    });

    // Load the template image
    useEffect(() => {
        const img = new Image();
        img.src = "/templates/elevateHoogoChallege.png"; // Adjust this path
        img.crossOrigin = "anonymous";
        img.onload = () => setTemplateImage(img);
    }, []);

    // Fetch Bingo Matrix
    useEffect(() => {
        getBingoMatrix(eventName, ticketCode).then((data) => {
            setBingoAnswers(data.answer);
        });
    }, [eventName, ticketCode]);

    // Capture the grid and overlay it on the template
    const captureAndDownload = async () => {
        setIsDownloading({ story: true, post: false });
        if (gridRef.current && templateImage) {
            try {
                // Wait until all images inside the grid are fully loaded
                const images = gridRef.current.querySelectorAll("img");
                await Promise.all(
                    Array.from(images).map(
                        (img) =>
                            new Promise<void>((resolve) => {
                                if (img.complete) resolve();
                                else {
                                    img.onload = () => resolve();
                                    img.onerror = () => resolve(); // Prevent hang on load error
                                }
                            })
                    )
                );

                // Capture the grid as an image using html2canvas
                const gridCanvas = await html2canvas(gridRef.current, {
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null,
                    scale: 1,
                });

                const gridImage = gridCanvas.toDataURL("image/png");

                // Draw the captured grid on the template
                const canvas = canvasRef.current;
                if (canvas) {
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        // Set canvas dimensions to match the template
                        canvas.width = templateImage.width;
                        canvas.height = templateImage.height;

                        // Draw the template on the canvas
                        ctx.drawImage(templateImage, 0, 0);

                        // Overlay the grid onto the template
                        const gridImgObj = new Image();
                        gridImgObj.src = gridImage;
                        gridImgObj.crossOrigin = "anonymous";
                        gridImgObj.onload = () => {
                            ctx.drawImage(gridImgObj, 85, 27, 583, 583); // Adjust positions as needed
                            downloadImage(); // Automatically download after merging
                        };
                    }
                }
            } catch (error) {
                console.error("Error capturing the grid:", error);
            } finally {
                setIsDownloading({ story: false, post: false });
            }
        }
    };

    // Download the final merged image
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

                        {/* Hidden Canvas for Merging Images */}
                        <canvas ref={canvasRef} style={{ display: "none" }} />

                        {/* Buttons for Capturing and Downloading */}
                        <button onClick={captureAndDownload} className={styles.captureButton}>
                            {isDownloading.story ? (
                                <BeatLoader color="#252525" size={8} />
                            ) : (
                                "Download Story Card"
                            )}
                        </button>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default BingoCard;
