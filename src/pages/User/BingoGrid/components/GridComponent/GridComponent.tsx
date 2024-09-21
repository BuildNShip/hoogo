import React, { useState } from "react";
import styles from "./GridComponent.module.css";
import Modal from "../../../../../components/Modal/Modal";

interface BingoCell {
  name: string | undefined;
  liner: string | undefined;
}

interface BingoGridProps {
  letters: string[][];
  cells: BingoCell[][];
  showNames: boolean;
}

const GridComponent: React.FC<BingoGridProps> = ({
  cells,
  showNames,
  letters,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCell, setSelectedCell] = useState<number[]>();

  const toggleCell = (index1: number, index2: number) => {
    setSelectedCell([index1, index2]);
  };

  return (
    <div className={styles.container}>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          {selectedCell !== undefined &&
            `AMAZING ${cells[selectedCell[0]][selectedCell[1]].name}`}
        </Modal>
      )}
      <div className={styles.bingoGrid}>
        {cells.map((cell1, index1) =>
          cell1.map((cell, index2) => (
            <div
              key={`${index1}-${index2}`}
              className={`${styles.bingoCell}`}
              onClick={() => {
                toggleCell(index1, index2);
                setIsOpen(true);
              }}
            >
              <span className={styles.letter}>{letters[index1][index2]}</span>
              {showNames && <span className={styles.name}>{cell.name}</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GridComponent;
