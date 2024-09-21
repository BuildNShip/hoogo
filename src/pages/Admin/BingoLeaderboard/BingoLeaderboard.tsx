import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./BingoLeaderboard.module.css";
import { websocketUrls } from "../../../../services/urls";

interface Player {
  name: string;
  score: boolean[];
}

const BingoLeaderboard = () => {
  const { eventName } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!eventName) return;
    const socket = new WebSocket(websocketUrls.bingoLeaderboard(eventName));

    socket.onmessage = (event) => {
      const updatedPlayers: Player[] = JSON.parse(event.data).response;
      setPlayers((prev) => [...prev, ...updatedPlayers]);
    };
  }, []);

  return (
    <div className={styles.container}>
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
  );
};

export default BingoLeaderboard;
