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
import { MdNetworkWifi1Bar, MdNetworkWifi2Bar, MdNetworkWifi3Bar } from "react-icons/md";

interface Player {
    user_name: string;
    user_code: string;
    score: boolean[];
    completed_at: Date | null;
    no_of_connections: number;
}

const BingoLeaderboard = () => {
    const { eventName } = useParams();
    const [players, setPlayers] = useState<Player[]>([]);
    const navigate = useNavigate();
    const socketRef = useRef<WebSocket | null>(null);
    const isAuthenticated = localStorage.getItem("accessToken");

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
                const updatedPlayer: Player[] | Player = JSON.parse(event.data).response;

                setPlayers((prevPlayers) => {
                    let newPlayers = Array.isArray(updatedPlayer)
                        ? updatedPlayer
                        : prevPlayers.map((player) =>
                              player.user_code === updatedPlayer.user_code ? updatedPlayer : player
                          );

                    if (
                        !Array.isArray(updatedPlayer) &&
                        !prevPlayers.some((player) => player.user_code === updatedPlayer.user_code)
                    ) {
                        newPlayers = [...prevPlayers, updatedPlayer];

                        toast.success(`${updatedPlayer.user_name} joined the game!`, {
                            duration: 3000,
                            position: "bottom-right",
                            id: updatedPlayer.user_code,
                        });
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
                                return b.no_of_connections - a.no_of_connections;
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
            console.log("WebSocket connection closed:", event);
            socketRef.current = null;
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [eventName]);

    return (
        <>
            <div className={styles.backgroundContainer}>
                <div className={styles.outerContainer}>
                    <div className={styles.container}>
                        <img src="/live.gif" alt="logo" className={styles.liveGif} />
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

                        {players.length > 0 && (
                            <p className={styles.participantCount}>
                                <span>{players.length}</span> people
                            </p>
                        )}

                        <>
                            {players.length > 0 ? (
                                <div className={styles.leaderboardCenterContainer}>
                                    <div className={styles.playerRowContainer}>
                                        <AnimatePresence>
                                            {players.map((player, playerIndex) => (
                                                <motion.div
                                                    key={player.user_code}
                                                    layout
                                                    initial={{ opacity: 0, y: 50 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -50 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        type: "spring",
                                                    }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className={styles.playerRow}
                                                >
                                                    <Link
                                                        to={`/${eventName}/${player.user_code}/hoogocard`}
                                                        className={styles.nameLink}
                                                    >
                                                        <div className={styles.row}>
                                                            <span className={styles.index}>
                                                                {playerIndex + 1}.
                                                            </span>
                                                            {player.user_name || player.user_code}{" "}
                                                            {player.no_of_connections > 20 ? (
                                                                <MdNetworkWifi3Bar
                                                                    title={player.no_of_connections.toString()}
                                                                />
                                                            ) : player.no_of_connections > 10 ? (
                                                                <MdNetworkWifi2Bar
                                                                    title={player.no_of_connections.toString()}
                                                                />
                                                            ) : player.no_of_connections > 1 ? (
                                                                <MdNetworkWifi1Bar
                                                                    title={player.no_of_connections.toString()}
                                                                />
                                                            ) : null}
                                                        </div>
                                                        {player.completed_at && (
                                                            <div className={styles.completedAtText}>
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

                                                    <div className={styles.bingoLetters}>
                                                        {["B", "I", "N", "G", "O"].map(
                                                            (letter, letterIndex) => (
                                                                <motion.button
                                                                    key={letter}
                                                                    className={`${
                                                                        styles.letterButton
                                                                    } ${
                                                                        player.score[letterIndex]
                                                                            ? styles.strikethrough
                                                                            : ""
                                                                    }`}
                                                                    whileHover={{ scale: 1.1 }}
                                                                    transition={{
                                                                        duration: 0.2,
                                                                    }}
                                                                >
                                                                    {letter}
                                                                </motion.button>
                                                            )
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.centerContainer}>
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
                                        Waiting for participants to join...
                                    </p>
                                </div>
                            )}
                        </>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default BingoLeaderboard;
