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
      let updatedPlayers: Player[] = JSON.parse(event.data).response;
      updatedPlayers = [...players, ...updatedPlayers];
      //combine the new players with the existing players and sort them based on the number of true values in the score array
      updatedPlayers.sort((a, b) => {
        const aScore = a.score.filter((score) => score).length;
        const bScore = b.score.filter((score) => score).length;
        return bScore - aScore;
      });

      setPlayers(updatedPlayers);
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
