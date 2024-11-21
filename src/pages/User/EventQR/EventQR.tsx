import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { PacmanLoader, BeatLoader } from "react-spinners";
import styles from "./EventQR.module.css"; // Reusing CSS from EventDashboard
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Navbar/Navbar";

const qrCode = new QRCodeStyling({
    width: 400,
    height: 400,
    image: "/qrLogo.svg", // Example logo path
    dotsOptions: {
        color: "#fff",
        type: "rounded",
    },
    backgroundOptions: {
        color: "#202020",
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.6,
    },
});

const EventQR = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { eventName } = useParams<{ eventName: string }>();
    const [isQRLoaded, setIsQRLoaded] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("accessToken");

    // Initialize QR code on mount
    useEffect(() => {
        if (ref.current) {
            qrCode.append(ref.current);
            setIsQRLoaded(true);
        }
    }, []);

    // Update QR code content dynamically
    useEffect(() => {
        qrCode.update({
            data: new URL(`https://hoogo.makemypass.com/${eventName}`).href,
        });
    }, [eventName]);

    // Handle QR code download
    const onDownloadClick = () => {
        setIsDownloading(true);
        qrCode.download({ extension: "png" }).finally(() => {
            setIsDownloading(false);
        });
    };

    return (
        <div className={styles.backgroundContainer}>
            <div className={styles.outerContainer}>
                <Navbar showActionButtons={false} />
                {isAuthenticated && (
                    <div className={styles.headerActions}>
                        <div
                            className={styles.gobackButton}
                            onClick={() => {
                                navigate(`/dashboard/${eventName}/`);
                            }}
                        >
                            {"<"}
                        </div>
                        <h1 className={styles.eventTitle}>{eventName}</h1>
                    </div>
                )}
                <div className={styles.qrContainer}>
                    <div
                        className={styles.qrLoaderContainer}
                        style={{ display: isQRLoaded ? "none" : "flex" }}
                    >
                        <PacmanLoader color="#1ED45E" size={25} />
                        <p className={styles.loaderText}>Hang tight! Generating QR Code...</p>
                    </div>

                    <div
                        className={styles.qrImageContainer}
                        style={{ display: isQRLoaded ? "flex" : "none" }}
                    >
                        <div ref={ref}></div>
                        <button className={styles.copyQr} onClick={onDownloadClick}>
                            {isDownloading ? <BeatLoader color="#272727" size={10} /> : "Download"}
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default EventQR;
