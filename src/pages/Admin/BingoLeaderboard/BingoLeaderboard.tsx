import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./BingoLeaderboard.module.css";

interface Player {
  name: string;
  bingo: boolean[];
}

const BingoLeaderboard = () => {
  const [players, setPlayers] = useState<Player[]>([
    { name: "Alice", bingo: [false, false, false, false, false] },
    { name: "Bob", bingo: [false, false, false, false, false] },
    { name: "Charlie", bingo: [false, false, false, false, false] },
  ]);

  const toggleLetter = (playerIndex: number, letterIndex: number) => {
    const newPlayers = [...players];
    newPlayers[playerIndex].bingo[letterIndex] =
      !newPlayers[playerIndex].bingo[letterIndex];
    setPlayers(newPlayers);
  };

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
          <div key={player.name} className={styles.playerRow}>
            <Link
              to={`/admin/leaderboard/${player.name}`}
              className={styles.nameLink}
            >
              {player.name}
            </Link>
            <div className={styles.bingoLetters}>
              {["B", "I", "N", "G", "O"].map((letter, letterIndex) => (
                <button
                  key={letter}
                  onClick={() => toggleLetter(playerIndex, letterIndex)}
                  className={`${styles.letterButton} ${
                    player.bingo[letterIndex] ? styles.strikethrough : ""
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
