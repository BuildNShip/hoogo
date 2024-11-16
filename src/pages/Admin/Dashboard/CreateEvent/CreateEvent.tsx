import React, { useState } from "react";
import styles from "./CreateEvent.module.css";
import toast from "react-hot-toast";
import { createEvent } from "../../../../apis/admin";
import Footer from "../../../../components/Footer/Footer";

const CreateEvent: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const [mmpId, setMmpId] = useState("");
  const [gridLetters, setGridLetters] = useState<string[][]>(
    Array.from({ length: 5 }, () => Array(5).fill(""))
  );
  const [step, setStep] = useState(1);

  // Handle letter change in the bingo grid
  const handleLetterChange = (row: number, col: number, value: string) => {
    if (value.length > 1) return;
    const updatedGrid = [...gridLetters];
    updatedGrid[row][col] = value.toUpperCase();
    setGridLetters(updatedGrid);
  };

  // Step 1: Handle event name and MMP ID submission
  const handleNextStep = () => {
    if (!eventName) {
      toast.error("Please enter the event name");
    }
    setStep(2);
  };

  // Step 2: Handle the final confirmation and submission
  const handleSubmit = () => {
    const isGridComplete = gridLetters.every((row) =>
      row.every((cell) => cell.trim() !== "")
    );
    if (!isGridComplete) {
      toast.error("Please fill all cells in the grid.");
    }

    createEvent(eventName, mmpId, gridLetters);
    toast.success("Bingo grid saved successfully!");
  };

  return (
    <div className={styles.container}>
      {step === 1 && (
        <>
          <h1 className={styles.title}>Event Details</h1>
          {/* Step 1: Event Name and MMP ID Inputs */}
          <div className={styles.inputGroup}>
            <label htmlFor="eventName" className={styles.label}>
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              className={styles.eventInput}
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter Event Name"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="mmpId" className={styles.label}>
              MMP ID
            </label>
            <input
              type="text"
              id="mmpId"
              className={styles.eventInput}
              value={mmpId}
              onChange={(e) => setMmpId(e.target.value)}
              placeholder="Enter MMP ID"
            />
          </div>
          <button className={styles.nextButton} onClick={handleNextStep}>
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className={styles.title}>Bingo Grid Setup</h1>
          {/* Step 2: Bingo Grid Inputs */}
          <div className={styles.grid}>
            {gridLetters.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  type="text"
                  maxLength={1}
                  className={styles.gridInput}
                  value={gridLetters[rowIndex][colIndex]}
                  onChange={(e) =>
                    handleLetterChange(rowIndex, colIndex, e.target.value)
                  }
                  placeholder={`${String.fromCharCode(65 + rowIndex)}${
                    colIndex + 1
                  }`}
                />
              ))
            )}
          </div>
          <button className={styles.submitButton} onClick={handleSubmit}>
            Confirm & Save
          </button>
        </>
      )}

      <Footer />
    </div>
  );
};

export default CreateEvent;
