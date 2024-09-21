import React from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./BingoCard.module.css";

interface BingoItem {
  name: string;
  caption: string;
  imageUrl: string;
}

const BingoCard = () => {
  const { playerName } = useParams();
  const gridSize = 5;
  const dummyImageUrl = "https://via.placeholder.com/150";

  // Generate dummy data for the grid
  const generateDummyData = (): BingoItem[] => {
    return Array(gridSize * gridSize)
      .fill(null)
      .map((_, index) => ({
        name: `Person ${index + 1}`,
        caption: `Caption ${index + 1}`,
        imageUrl: dummyImageUrl,
      }));
  };

  const bingoItems = generateDummyData();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{playerName}'s BINGO Card</h1>
      <div className={styles.grid}>
        {bingoItems.map((item, index) => (
          <div key={index} className={styles.cell}>
            <img
              src={item.imageUrl}
              alt={`Selfie of ${item.name}`}
              className={styles.image}
            />
            <div className={styles.overlay}>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.caption}>{item.caption}</p>
            </div>
          </div>
        ))}
      </div>
      <Link to="/" className={styles.backLink}>
        Back to Leaderboard
      </Link>
    </div>
  );
};

export default BingoCard;
