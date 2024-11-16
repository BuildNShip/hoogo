import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./BingoLeaderboard.module.css";
import { websocketUrls } from "../../../../services/urls";
import Footer from "../../../components/Footer/Footer";
import { PacmanLoader } from "react-spinners";
interface Player {
  user_name: string;
  user_code: string;
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
            (player) => player.user_name === updatedPlayer.user_name
          );

          if (playerAlreadyExists)
            return prevPlayers.map((player) => {
              if (player.user_name === updatedPlayer.user_name) {
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
            return bScore - aScore;
          }
        });
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(players);
  }, [players]);

  return (
    <div className={styles.container}>
      <img src="/live.gif" alt="logo" className={styles.liveGif} />
      {players.length > 0 && (
        <p className={styles.participantCount}>{players.length} people</p>
      )}
      <div className={styles.center}>
        <p className={styles.leaderboardHeadingText}>
          Elevate'24 Bingo Leaderboard
        </p>
        <>
          {players.length > 0 ? (
            <>
              <p className={styles.leaderboardHeadingDescription}>
                Click on a name to view the player's bingo card. The leaderboard
                is sorted based on completion time.
              </p>
              <div className={styles.playerRowContainer}>
                {players.map((player, playerIndex) => (
                  <div key={playerIndex} className={styles.playerRow}>
                    <Link
                      to={`/${eventName}/admin/leaderboard/${player.user_code}`}
                      className={styles.nameLink}
                    >
                      {player.user_name || player.user_code}
                    </Link>
                    <div className={styles.bingoLetters}>
                      {["B", "I", "N", "G", "O"].map((letter, letterIndex) => (
                        <button
                          key={letter}
                          className={`${styles.letterButton} ${
                            player.score[letterIndex]
                              ? styles.strikethrough
                              : ""
                          }`}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={styles.loaderContainer}>
                <PacmanLoader
                  color="#ffd700"
                  loading
                  size={25}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
              <p className={styles.loadingText}>
                Waiting for participants to join...
              </p>
            </>
          )}
        </>
      </div>
      <Footer />
    </div>
  );
};

export default BingoLeaderboard;
