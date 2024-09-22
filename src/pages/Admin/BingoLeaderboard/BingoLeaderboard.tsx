import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./BingoLeaderboard.module.css";
import { websocketUrls } from "../../../../services/urls";
import Navbar from "../../../components/Navbar/Navbar";

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
      let updatedPlayer: Player[] | Player = JSON.parse(event.data).response;

      if (Array.isArray(updatedPlayer)) {
        setPlayers(updatedPlayer);
      } else {
        let playerAlreadyExists = players.some(
          (player) => player.name === updatedPlayer.name
        );

        if (playerAlreadyExists)
          setPlayers((prevPlayers) => {
            return prevPlayers.map((player) => {
              if (player.name === updatedPlayer.name) {
                return updatedPlayer;
              }
              return player;
            });
          });
        else {
          setPlayers((prevPlayers) => [...prevPlayers, updatedPlayer]);
        }

        setPlayers((prevPlayers) => {
          const updatedPlayers = [...prevPlayers];
          updatedPlayers.sort((a, b) => {
            const aScore = a.score.filter(Boolean).length;
            const bScore = b.score.filter(Boolean).length;
            return bScore - aScore;
          });
          return updatedPlayers;
        });
      }
    };
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
