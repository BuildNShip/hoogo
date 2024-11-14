import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./BingoLeaderboard.module.css";
import { websocketUrls } from "../../../../services/urls";
import Navbar from "../../../components/Navbar/Navbar";

interface Player {
    name: string;
    score: boolean[];
    completed_at: Date | null;
}

const BingoLeaderboard = () => {
    const { eventName } = useParams();
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        if (!eventName) return;
        const socket = new WebSocket(websocketUrls.bingoLeaderboard(eventName));

        socket.onmessage = (event) => {
            const updatedPlayer: Player[] | Player = JSON.parse(event.data).response;

            if (Array.isArray(updatedPlayer)) {
                setPlayers(updatedPlayer);
            } else {
                setPlayers((prevPlayers) => {
                    const playerAlreadyExists = prevPlayers.some(
                        (player) => player.name === updatedPlayer.name
                    );

                    if (playerAlreadyExists)
                        return prevPlayers.map((player) => {
                            if (player.name === updatedPlayer.name) {
                                return updatedPlayer;
                            }
                            return player;
                        });
                    else {
                        return [...prevPlayers, updatedPlayer];
                    }
                });
            }

            setPlayers((prevPlayers) => {
                return [...prevPlayers].sort((a, b) => {
                    if (a.completed_at && b.completed_at) {
                        return (
                            new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
                        );
                    } else if (a.completed_at) {
                        return -1;
                    } else if (b.completed_at) {
                        return 1;
                    } else {
                        const aScore = a.score.filter(Boolean).length;
                        const bScore = b.score.filter(Boolean).length;
                        return bScore - aScore;
                    }
                });
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.center}>
                <h1 className={styles.title}>
                    OVERRIDE.PY
                    <br />
                    COMMUNITY
                    <br />
                    MEETUP - HOOGO
                </h1>
                <div className={styles.leaderboard}>
                    {players.map((player, playerIndex) => (
                        <div key={playerIndex} className={styles.playerRow}>
                            <Link
                                to={`/${eventName}/admin/leaderboard/${player.name}`}
                                className={styles.nameLink}
                            >
                                {player.name}
                            </Link>
                            <div className={styles.bingoLetters}>
                                {["B", "I", "N", "G", "O"].map((letter, letterIndex) => (
                                    <button
                                        key={letter}
                                        className={`${styles.letterButton} ${
                                            player.score[letterIndex] ? styles.strikethrough : ""
                                        }`}
                                    >
                                        {letter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.footer}>
                    PYGRAMMERS PRESENTS * PYGRAMMERS PRESENTS * PYGRAMMERS PRESENTS
                </div>
            </div>
        </div>
    );
};

export default BingoLeaderboard;
