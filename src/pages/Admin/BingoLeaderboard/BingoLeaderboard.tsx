import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./BingoLeaderboard.module.css";
import { websocketUrls } from "../../../../services/urls";
import Footer from "../../../components/Footer/Footer";
import { PacmanLoader } from "react-spinners";
import { IoIosTime } from "react-icons/io";
import { formatTime } from "../../../functions";
import toast from "react-hot-toast";
import {
    MdNetworkWifi1Bar,
    MdNetworkWifi2Bar,
    MdNetworkWifi3Bar,
} from "react-icons/md";
import { TiTick } from "react-icons/ti";
import Modal from "../../../components/Modal/Modal";
import { IoQrCode } from "react-icons/io5";

import QRCodeStyling from "qr-code-styling";
import { getBingoMatrix } from "../../../apis/common";
import HoogoCard from "./HoogoCard/HoogoCard";
import Confetti from "react-confetti";

const qrCode = new QRCodeStyling({
    width: 250,
    height: 250,
    image: "/qrLogo.svg",
    dotsOptions: {
        color: "#fff",
        type: "rounded",
    },
    backgroundOptions: {
        color: "#202020",
    },
    imageOptions: {
        crossOrigin: "anonymous",

        margin: 5, // Reduced margin to increase image size
        imageSize: 0.4, // Added imageSize to increase the image size
    },
});

interface Player {
    user_name: string;
    connected_to: string;
    score: boolean[];
    completed_at: Date | null;
    no_of_connections: number;
    user_code: string;
}

interface BingoItem {
    name: string;
    liner: string;
    image: string;
}

const BingoLeaderboard = () => {
    const { eventName } = useParams();
    const [players, setPlayers] = useState<Player[]>([]);
    const navigate = useNavigate();
    const socketRef = useRef<WebSocket | null>(null);
    const isAuthenticated = localStorage.getItem("accessToken");
    const [showRules, setShowRules] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    const [bingoAnswers, setBingoAnswers] = useState<BingoItem[][]>([]);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

    useEffect(() => {
        if (ref.current && isQRModalOpen) {
            qrCode.append(ref.current);
        }
    }, [isQRModalOpen]);

    useEffect(() => {
        if (typeof selectedPlayer === "string") {
            const audio = new Audio("/claps.wav");
            audio.play();
            getBingoMatrix(eventName, selectedPlayer).then((response) => {
                setBingoAnswers(response.answer);
                setTimeout(() => {
                    setBingoAnswers([]);
                }, 5000);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPlayer]);

    useEffect(() => {
        if (!eventName) return;

        if (socketRef.current) {
            socketRef.current.close();
        }

        const socket = new WebSocket(websocketUrls.bingoLeaderboard(eventName));
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket connection opened.");
        };

        socket.onmessage = (event) => {
            try {
                const updatedPlayer: Player[] | Player = JSON.parse(
                    event.data
                ).response;

                let currentPlayerScore = 0;

                setPlayers((prevPlayers) => {
                    if (!Array.isArray(updatedPlayer)) {
                        const currentPlayer = prevPlayers.find(
                            (player) =>
                                player.user_name === updatedPlayer.user_name
                        );
                        currentPlayerScore =
                            currentPlayer?.score.filter(Boolean).length ?? 0;
                    }

                    let newPlayers = Array.isArray(updatedPlayer)
                        ? updatedPlayer
                        : prevPlayers.map((player) =>
                              player.user_name === updatedPlayer.user_name
                                  ? updatedPlayer
                                  : player
                          );

                    if (
                        !Array.isArray(updatedPlayer) &&
                        !prevPlayers.some(
                            (player) =>
                                player.user_name === updatedPlayer.user_name
                        )
                    ) {
                        newPlayers = [...prevPlayers, updatedPlayer];

                        toast.success(
                            `${updatedPlayer.user_name} joined the game!`,
                            {
                                duration: 3000,
                                position: "bottom-right",
                                id: updatedPlayer.user_name,
                            }
                        );
                    } else if (
                        !Array.isArray(updatedPlayer) &&
                        updatedPlayer.connected_to &&
                        updatedPlayer.user_name
                    ) {
                        toast.success(
                            `${updatedPlayer.user_name} connected to ${updatedPlayer.connected_to}!`,
                            {
                                duration: 3000,
                                position: "bottom-left",
                                id: updatedPlayer.user_name,
                                style: {
                                    backgroundColor: "#2a2a2a",
                                    color: "#ffffff",
                                },
                            }
                        );
                    }

                    if (!Array.isArray(updatedPlayer)) {
                        const updatedPlayerScore =
                            updatedPlayer.score.filter(Boolean).length;

                        console.log(currentPlayerScore, updatedPlayerScore);

                        if (
                            currentPlayerScore === 4 &&
                            updatedPlayerScore === 5
                        ) {
                            setSelectedPlayer(
                                updatedPlayer.user_code ||
                                    updatedPlayer.user_name
                            );
                        }
                    } else {
                        console.log("No player completed the game yet.");
                    }

                    return newPlayers.sort((a, b) => {
                        if (a.completed_at && b.completed_at) {
                            return (
                                new Date(a.completed_at).getTime() -
                                new Date(b.completed_at).getTime()
                            );
                        } else if (a.completed_at) {
                            return -1;
                        } else if (b.completed_at) {
                            return 1;
                        } else {
                            const aScore = a.score.filter(Boolean).length;
                            const bScore = b.score.filter(Boolean).length;
                            if (aScore !== bScore) {
                                return bScore - aScore;
                            } else {
                                return (
                                    b.no_of_connections - a.no_of_connections
                                );
                            }
                        }
                    });
                });
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
            }
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socket.onclose = (event) => {
            console.log(event);
            console.log("WebSocket connection closed:", event);
            setTimeout(() => {
                const newSocket = new WebSocket(
                    websocketUrls.bingoLeaderboard(eventName)
                );
                socketRef.current = newSocket;
            }, 3000);
            socketRef.current = null;
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [eventName]);

    useEffect(() => {
        qrCode.update({
            data: new URL(`https://hoogo.makemypass.com/${eventName}`).href,
        });
    }, [eventName]);

    const stockImages = [
        "https://picsum.photos/500/500?random=0",
        "https://picsum.photos/500/500?random=1",
        "https://picsum.photos/500/500?random=2",
        "https://picsum.photos/500/500?random=3",
        "https://picsum.photos/500/500?random=4",
        "https://picsum.photos/500/500?random=5",
        "https://picsum.photos/500/500?random=7",
        "https://picsum.photos/500/500?random=8",
        "https://picsum.photos/500/500?random=9",
        "https://picsum.photos/500/500?random=10",
        "https://picsum.photos/500/500?random=11",
        "https://picsum.photos/500/500?random=12",
        "https://picsum.photos/500/500?random=13",
        "https://picsum.photos/500/500?random=14",
        "https://picsum.photos/500/500?random=15",
        "https://picsum.photos/500/500?random=16",
        "https://picsum.photos/500/500?random=17",
        "https://picsum.photos/500/500?random=18",
        "https://picsum.photos/500/500?random=19",
    ];

    return (
        <>
            {showRules && (
                <Modal onClose={() => setShowRules(false)} title="Bingo Rules">
                    <div className={styles.rulesContainer}>
                        <div className={styles.rulesDescription}>
                            <ul className={styles.rulesDescriptionContent}>
                                <li
                                    className={
                                        styles.rulesDescriptionContentText
                                    }
                                >
                                    Each letter on the Bingo grid represents the
                                    starting letter of a person's name.
                                </li>
                                <li
                                    className={
                                        styles.rulesDescriptionContentText
                                    }
                                >
                                    Network with people at the event to find
                                    individuals whose names start with the
                                    letters on your grid.
                                </li>
                                <li
                                    className={
                                        styles.rulesDescriptionContentText
                                    }
                                >
                                    Take a selfie with each person you find and
                                    upload it as proof, which marks a square on
                                    your grid.
                                </li>
                                <li
                                    className={
                                        styles.rulesDescriptionContentText
                                    }
                                >
                                    To complete a letter in BINGO, a participant
                                    must mark 5 cells in a row, column, or
                                    diagonal.
                                </li>
                                <li
                                    className={
                                        styles.rulesDescriptionContentText
                                    }
                                >
                                    The first participant to complete all 5
                                    letters in BINGO wins the game!
                                </li>
                            </ul>
                        </div>
                    </div>
                </Modal>
            )}

            {bingoAnswers.length > 0 && (
                <>
                    <Confetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                        numberOfPieces={500}
                        style={{
                            zIndex: 10001,
                        }}
                    />
                    <Modal
                        onClose={() => setBingoAnswers([])}
                        title="Congratulations"
                    >
                        <HoogoCard bingoAnswers={bingoAnswers} />
                    </Modal>
                </>
            )}

            <div className={styles.backgroundContainer}>
                <div className={styles.outerContainer}>
                    <div className={styles.imageScrollLeft}>
                        <div className={styles.scrollContainer}>
                            {stockImages
                                .concat(stockImages)
                                .map((src, index) => (
                                    <img
                                      className={styles.image}
                                        key={index}
                                        src={src}
                                        alt={`Stock image ${index}`}
                                    />
                                ))}
                        </div>
                    </div>

                    <div className={styles.container}>
                        {/* <img src="/live.gif" alt="logo" className={styles.liveGif} /> */}
                        {isAuthenticated && (
                            <div className={styles.headerActions}>
                                <div
                                    className={styles.gobackButton}
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                >
                                    {"<"}
                                </div>
                                <h1 className={styles.eventTitle}>
                                    {eventName}
                                </h1>
                            </div>
                        )}

                        {players.length > 0 && (
                            <p className={styles.participantCount}>
                                <span>{players.length}</span> people
                            </p>
                        )}

                        <p className={styles.connections}>
                            <span>
                                {" "}
                                {players.reduce(
                                    (total, player) =>
                                        total + player.no_of_connections,
                                    0
                                )}
                            </span>{" "}
                            connections
                        </p>

                        <div className={styles.leaderboardContainer}>
                            <>
                                <div
                                    className={
                                        styles.leaderboardCenterContainer
                                    }
                                >
                                    {isQRModalOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, x: "-25%" }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: "-25%" }}
                                            transition={{ duration: 0.5 }}
                                            className={styles.qrCodeContainer}
                                        >
                                            <div ref={ref}></div>
                                            <p className={styles.scanToJoin}>
                                                scan to network
                                            </p>
                                        </motion.div>
                                    )}
                                    <div className={styles.playerRowContainer}>
                                        {players.length > 0 ? (
                                            <AnimatePresence>
                                                {players.map(
                                                    (player, playerIndex) => (
                                                        <motion.div
                                                            key={
                                                                player.user_name
                                                            }
                                                            layout
                                                            initial={{
                                                                opacity: 0,
                                                                y: -50,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                y: 50,
                                                            }}
                                                            transition={{
                                                                duration: 0.5,
                                                                type: "spring",
                                                            }}
                                                            whileHover={{
                                                                scale: 1.05,
                                                            }}
                                                            className={
                                                                styles.playerRow
                                                            }
                                                        >
                                                            <Link
                                                                to={`/${eventName}/${
                                                                    player.user_code ||
                                                                    player.user_name
                                                                }/hoogocard`}
                                                                className={
                                                                    styles.nameLink
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        styles.row
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles.index
                                                                        }
                                                                    >
                                                                        {playerIndex +
                                                                            1}
                                                                        .
                                                                    </span>
                                                                    {player.user_name ||
                                                                        player.user_name}{" "}
                                                                    {player.no_of_connections >=
                                                                    25 ? (
                                                                        <TiTick
                                                                            color="#1ed45e"
                                                                            title={player.no_of_connections.toString()}
                                                                        />
                                                                    ) : player.no_of_connections >=
                                                                      20 ? (
                                                                        <MdNetworkWifi3Bar
                                                                            title={
                                                                                player.no_of_connections.toString() +
                                                                                " connections"
                                                                            }
                                                                        />
                                                                    ) : player.no_of_connections >=
                                                                      10 ? (
                                                                        <MdNetworkWifi2Bar
                                                                            title={
                                                                                player.no_of_connections.toString() +
                                                                                " connections"
                                                                            }
                                                                        />
                                                                    ) : player.no_of_connections >=
                                                                      1 ? (
                                                                        <MdNetworkWifi1Bar
                                                                            title={
                                                                                player.no_of_connections.toString() +
                                                                                " connections"
                                                                            }
                                                                        />
                                                                    ) : null}
                                                                </div>
                                                                {player.completed_at && (
                                                                    <div
                                                                        className={
                                                                            styles.completedAtText
                                                                        }
                                                                    >
                                                                        <IoIosTime />
                                                                        <p>
                                                                            {formatTime(
                                                                                new Date(
                                                                                    player.completed_at
                                                                                )
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </Link>

                                                            <div
                                                                className={
                                                                    styles.bingoLetters
                                                                }
                                                            >
                                                                {[
                                                                    "B",
                                                                    "I",
                                                                    "N",
                                                                    "G",
                                                                    "O",
                                                                ].map(
                                                                    (
                                                                        letter,
                                                                        letterIndex
                                                                    ) => (
                                                                        <motion.button
                                                                            key={
                                                                                letter
                                                                            }
                                                                            className={`${
                                                                                styles.letterButton
                                                                            } ${
                                                                                player
                                                                                    .score[
                                                                                    letterIndex
                                                                                ]
                                                                                    ? styles.strikethrough
                                                                                    : ""
                                                                            }`}
                                                                            whileHover={{
                                                                                scale: 1.1,
                                                                            }}
                                                                            transition={{
                                                                                duration: 0.2,
                                                                            }}
                                                                        >
                                                                            {
                                                                                letter
                                                                            }
                                                                        </motion.button>
                                                                    )
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )
                                                )}
                                            </AnimatePresence>
                                        ) : (
                                            <>
                                                <div
                                                    className={
                                                        styles.loaderContainer
                                                    }
                                                >
                                                    <PacmanLoader
                                                        color="#1ED45E"
                                                        loading
                                                        size={25}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                    />
                                                </div>
                                                <p
                                                    className={
                                                        styles.loadingText
                                                    }
                                                >
                                                    Waiting for participants to
                                                    join...
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        </div>

                        <div
                            className={styles.showEventQR}
                            onClick={() => {
                                setIsQRModalOpen((prev) => !prev);
                            }}
                        >
                            <IoQrCode
                                size={30}
                                color={isQRModalOpen ? "#1ED45E" : "#fff"}
                            />
                        </div>

                        <div
                            className={styles.showRulesText}
                            onClick={() => setShowRules(!showRules)}
                        >
                            click to view rules
                        </div>
                    </div>
                    <div className={styles.imageScrollRight}>
                        <div className={styles.scrollContainer}>
                            {stockImages
                                .concat(stockImages)
                                .map((src, index) => (
                                    <img
                                        key={index}
                                        className={styles.image}
                                        src={src}
                                        alt={`Stock image ${index}`}
                                    />
                                ))}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default BingoLeaderboard;
