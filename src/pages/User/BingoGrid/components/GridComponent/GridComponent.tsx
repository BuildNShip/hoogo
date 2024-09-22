import React, { useState } from "react";
import styles from "./GridComponent.module.css";
import Modal from "../../../../../components/Modal/Modal";
import { postUserInput } from "../../../../../apis/common";
import { useParams } from "react-router-dom";
import Navbar from "../../../../../components/Navbar/Navbar";
import Footer from "../../../../../components/Footer/Footer";

interface BingoCell {
  name: string | undefined;
  liner: string | undefined;
  image: string | undefined;
}

interface BingoGridProps {
  letters: string[][];
  cells: BingoCell[][];
  setCells: React.Dispatch<React.SetStateAction<BingoCell[][]>>;
}

const GridComponent: React.FC<BingoGridProps> = ({
  cells,
  setCells,
  letters,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { eventName, ticketCode } = useParams();
  const [selectedCell, setSelectedCell] = useState<number[]>();
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const toggleCell = (index1: number, index2: number) => {
    setSelectedCell([index1, index2]);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ name, image, description });
    console.log(selectedCell);
    if (selectedCell) {
      postUserInput(
        eventName,
        ticketCode,
        letters[selectedCell[0]][selectedCell[1]],
        image,
        name,
        description,
        selectedCell[0],
        selectedCell[1],
        setCells
      );
    }

    setIsOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {isOpen && (
          <Modal
            onClose={() => {
              setIsOpen(false);
              setSelectedCell(undefined);
            }}
          >
            {selectedCell !== undefined &&
            cells[selectedCell[0]][selectedCell[1]].name ? (
              <>
                <div className={styles.personContainer}>
                  <div className={styles.personImageContainer}>
                    <img
                      className={styles.personImage}
                      src={cells[selectedCell[0]][selectedCell[1]].image}
                    />
                  </div>
                  <div className={styles.personName}>
                    {cells[selectedCell[0]][selectedCell[1]].name}
                  </div>
                  <div className={styles.personLiner}>
                    {cells[selectedCell[0]][selectedCell[1]].liner}
                  </div>
                  <button
                    className={styles.backButton}
                    onClick={() => setIsOpen(false)}
                  >
                    Back
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  {" "}
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="name" className={styles.label}>
                        Name:
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="image" className={styles.label}>
                        Image:
                      </label>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageChange}
                        className={styles.fileInput}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="description" className={styles.label}>
                        Description:
                      </label>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.textarea}
                      />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                      Submit
                    </button>
                  </form>
                </div>
              </>
            )}
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
                <span className={styles.name}>{cell.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GridComponent;
