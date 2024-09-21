import { useState } from "react";
import styles from "./WinnerPage.module.css";

interface Player {
  name: string;
  bingo: boolean[];
}

const WinnerPage = () => {
  const [players, setPlayers] = useState<Player[]>([
    { name: "Alice", bingo: [false, false, false, false, false] },
    { name: "Bob", bingo: [false, false, false, false, false] },
    { name: "Charlie", bingo: [false, false, false, false, false] },
    { name: "Alice", bingo: [false, false, false, false, false] },
    { name: "Bob", bingo: [false, false, false, false, false] },
    { name: "Charlie", bingo: [false, false, false, false, false] },
    { name: "Alice", bingo: [false, false, false, false, false] },
    { name: "Bob", bingo: [false, false, false, false, false] },
    { name: "Charlie", bingo: [false, false, false, false, false] },
    { name: "Alice", bingo: [false, false, false, false, false] },
    { name: "Bob", bingo: [false, false, false, false, false] },
    { name: "Charlie", bingo: [false, false, false, false, false] },
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
    <>
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <h1 className={styles.title}>BINGO Leaderboard</h1>
          <table className={styles.table}>
            <thead>
              <tr className={styles.headerRow}>
                <th className={styles.headerCell}>Name</th>
                <th className={styles.headerCell} colSpan={5}></th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, playerIndex) => (
                <tr key={player.name} className={styles.row}>
                  <td className={styles.cell}>{player.name}</td>
                  {["B", "I", "N", "G", "O"].map((letter, letterIndex) => (
                    <td key={letter} className={styles.cell}>
                      <button
                        onClick={() => toggleLetter(playerIndex, letterIndex)}
                        className={`${styles.letterButton} ${
                          player.bingo[letterIndex] ? styles.strikethrough : ""
                        }`}
                      >
                        {letter}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default WinnerPage;
