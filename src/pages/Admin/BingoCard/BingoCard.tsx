import { useParams } from "react-router-dom";
import styles from "./BingoCard.module.css";
import { useEffect, useState } from "react";
import { getBingoMatrix } from "../../../apis/common";

interface BingoItem {
  name: string;
  liner: string;
  image: string;
}

const BingoCard = () => {
  const { playerName, eventName } = useParams();
  const dummyImageUrl = "https://via.placeholder.com/150";
  const [bingoAnswers, setBingoAnswers] = useState<BingoItem[][]>([]);

  useEffect(() => {
    getBingoMatrix(eventName, playerName).then((data) => {
      setBingoAnswers(data.answer);
    });
    // generateDummyData();
  }, [eventName, playerName]);

  // const generateDummyData = () => {
  //   const dummyData: BingoItem[][] = [];
  //   for (let i = 0; i < gridSize; i++) {
  //     const row: BingoItem[] = [];
  //     for (let j = 0; j < gridSize; j++) {
  //       row.push({
  //         name: `Name ${i}${j}`,
  //         liner: "B",
  //         image: dummyImageUrl,
  //       });
  //     }
  //     dummyData.push(row);
  //   }
  //   setBingoAnswers(dummyData);
  // };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {bingoAnswers.map((item, index) => (
          <div key={index} className={styles.row}>
            {item.map((cell, cellIndex) => (
              <div key={cellIndex} className={styles.cell}>
                <img
                  src={cell.image ? cell.image : dummyImageUrl}
                  alt={cell.name}
                  className={styles.image}
                />
                <div className={styles.overlay}>
                  <p className={styles.name}>{cell.name}</p>
                  <p className={styles.liner}>{cell.liner}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
        <h1 className={styles.title}>{playerName}'s BINGO Card</h1>
      </div>
    </div>
  );
};

export default BingoCard;
