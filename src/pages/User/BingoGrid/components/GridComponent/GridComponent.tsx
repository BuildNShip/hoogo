import React, { useEffect, useState } from "react";
import styles from "./GridComponent.module.css";
import Modal from "../../../../../components/Modal/Modal";
import { postUserInput } from "../../../../../apis/common";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { BeatLoader } from "react-spinners";
import Confetti from "react-confetti";

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

const GridComponent: React.FC<BingoGridProps> = ({ cells, setCells, letters }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { eventName, ticketCode } = useParams();
    const [selectedCell, setSelectedCell] = useState<number[]>();
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rowsBingo, setRowsBingo] = useState<boolean[]>([false, false, false, false, false]);
    const navigate = useNavigate();
    const toggleCell = (index1: number, index2: number) => {
        setSelectedCell([index1, index2]);
    };
    const [numberOfImages, setNumberOfImages] = useState(0);
    const [showRulesModal, setShowRulesModal] = useState(false);

    const userName = localStorage.getItem("userName");

    const handleSubmit = () => {
        if (
            selectedCell &&
            image instanceof File &&
            name &&
            description &&
            eventName &&
            ticketCode
        ) {
            postUserInput(
                eventName,
                ticketCode,
                letters[selectedCell[0]][selectedCell[1]],
                image,
                name,
                description,
                selectedCell[0],
                selectedCell[1],
                setCells,
                setIsSubmitting,
                setIsOpen
            );
        } else {
            if (!name || name.length === 1) {
                toast.error("Name is required and should be more than one letter", {
                    id: "name",
                });
            } else if (!image) {
                toast.error("Image is required", {
                    id: "image",
                });
            } else if (description.length < 10) {
                toast.error("Description should be at least 10 characters long");
            }
        }
    };

    useEffect(() => {
        if (cells) {
            let count = 0;
            cells.forEach((row) => {
                row.forEach((cell) => {
                    if (cell.name) {
                        count++;
                    }
                });
            });
            setNumberOfImages(count);
        }
    }, [cells]);

    //For each cell i would to check whether the cell is part of a BINGO, that is
    //whether the row, column or diagonal which includes that cell is completely
    //filled with names

    const isBingoAchieved = () => {
        let isBingo = false;
        //Check for rows
        for (let i = 0; i < 5; i++) {
            let rowFilled = true;
            for (let j = 0; j < 5; j++) {
                if (!cells[i][j].name) {
                    rowFilled = false;
                    break;
                }
            }
            if (rowFilled) {
                isBingo = true;
                break;
            }
        }

        //Check for columns
        if (!isBingo) {
            for (let i = 0; i < 5; i++) {
                let colFilled = true;
                for (let j = 0; j < 5; j++) {
                    if (!cells[j][i].name) {
                        colFilled = false;
                        break;
                    }
                }
                if (colFilled) {
                    isBingo = true;
                    break;
                }
            }
        }

        //Check for diagonals
        if (!isBingo) {
            let diag1Filled = true;
            let diag2Filled = true;
            for (let i = 0; i < 5; i++) {
                if (!cells[i][i].name) {
                    diag1Filled = false;
                }
                if (!cells[i][4 - i].name) {
                    diag2Filled = false;
                }
            }
            if (diag1Filled || diag2Filled) {
                isBingo = true;
            }
        }

        return isBingo;
    };

    useEffect(() => {
        const rowsBingo = [false, false, false, false, false];
        let rowIndex = 0;
        //Check for rows
        for (let i = 0; i < 5; i++) {
            let rowFilled = true;
            for (let j = 0; j < 5; j++) {
                if (!cells[i][j].name) {
                    rowFilled = false;
                    break;
                }
            }
            if (rowFilled && rowIndex < 5) {
                rowsBingo[rowIndex++] = true;
            }
        }

        //Check for columns

        for (let i = 0; i < 5; i++) {
            let colFilled = true;
            for (let j = 0; j < 5; j++) {
                if (!cells[j][i].name) {
                    colFilled = false;
                    break;
                }
            }
            if (colFilled && rowIndex < 5) {
                rowsBingo[rowIndex++] = true;
            }
        }

        //Check for diagonals

        let diag1Filled = true;
        let diag2Filled = true;

        for (let i = 0; i < 5; i++) {
            if (!cells[i][i].name) {
                diag1Filled = false;
            }
            if (!cells[i][4 - i].name) {
                diag2Filled = false;
            }
        }

        if (diag1Filled && rowIndex < 5) {
            rowsBingo[rowIndex++] = true;
        }

        if (diag2Filled && rowIndex < 5) {
            rowsBingo[rowIndex] = true;
        }

        setRowsBingo(rowsBingo);
    }, [cells]);

    useEffect(() => {
        const firstTime = sessionStorage.getItem("firstTime");
        if (!firstTime) {
            setShowRulesModal(true);
            sessionStorage.setItem("firstTime", "false");
        }
    }, [showRulesModal]);

    return (
        <>
            <div className={styles.container}>
                {userName && (
                    <p className={styles.hiText}>
                        Hi, <span>{userName}</span> 👋
                    </p>
                )}
                {isOpen && (
                    <Modal
                        onClose={() => {
                            setIsOpen(false);
                            setSelectedCell(undefined);
                        }}
                        title={
                            selectedCell !== undefined &&
                            cells[selectedCell[0]][selectedCell[1]].name
                                ? `About Your Friend`
                                : "Add a New Friend"
                        }
                    >
                        {selectedCell !== undefined &&
                        cells[selectedCell[0]][selectedCell[1]].name ? (
                            <div className={styles.personContainer}>
                                <div className={styles.floatingContainer}>
                                    <div className={styles.floatingText}>
                                        <p className={styles.personDescriptionHeader}>
                                            About{" "}
                                            <span>
                                                {cells[selectedCell[0]][selectedCell[1]].name
                                                    ?.split(" ")
                                                    .map(
                                                        (word) =>
                                                            word.charAt(0).toUpperCase() +
                                                            word.slice(1)
                                                    )
                                                    .join(" ")}
                                            </span>
                                        </p>
                                        <div className={styles.personDescription}>
                                            <div className={styles.personImageContainer}>
                                                <img
                                                    className={styles.personImage}
                                                    src={
                                                        cells[selectedCell[0]][selectedCell[1]]
                                                            .image
                                                    }
                                                    alt={
                                                        cells[selectedCell[0]][selectedCell[1]].name
                                                    }
                                                />
                                            </div>
                                            {cells[selectedCell[0]][selectedCell[1]].liner}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className={styles.backButton}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Back
                                </button>
                            </div>
                        ) : (
                            <div className={styles.form}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="name" className={styles.label}>
                                        Name *
                                    </label>
                                    <p className={styles.inputFieldDescription}>
                                        So, This name start with the Letter{" "}
                                        <span>
                                            {" "}
                                            "
                                            {selectedCell &&
                                                letters[selectedCell[0]][selectedCell[1]]}
                                            "
                                        </span>
                                    </p>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => {
                                            if (e.target.value.length >= 1) setName(e.target.value);
                                        }}
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="image" className={styles.label}>
                                        Take a Selfie *
                                    </label>

                                    <p className={styles.inputFieldDescription}>
                                        Capture your best smile 😄
                                    </p>

                                    {image ? (
                                        <div className={styles.previewImageContainer}>
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Preview"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    marginTop: "10px",
                                                }}
                                            />
                                            <div
                                                className={styles.closeButton}
                                                title="
                                                Remove Image
                                            "
                                            >
                                                <MdClose
                                                    onClick={() => {
                                                        setImage(null);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setImage(e.target.files[0]);
                                                }
                                            }}
                                            className={styles.fileInput}
                                        />
                                    )}
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="description" className={styles.label}>
                                        Tell us about your new friend
                                    </label>
                                    <p className={styles.inputFieldDescription}>
                                        What all did you learn about this person? (Min 10
                                        characters)
                                    </p>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className={styles.textarea}
                                        placeholder="Enter a description"
                                    />
                                </div>

                                <button
                                    className={styles.submitButton}
                                    type="submit"
                                    style={
                                        name.length > 1 &&
                                        description.length >= 10 &&
                                        image !== null
                                            ? {
                                                  backgroundColor: "#1ED45E",
                                                  color: "#252525",
                                                  opacity: 1,
                                              }
                                            : {
                                                  backgroundColor: "#252525",
                                                  cursor: "not-allowed",
                                              }
                                    }
                                    onClick={() => {
                                        if (
                                            name.length > 1 &&
                                            description.length >= 10 &&
                                            image !== null &&
                                            !isSubmitting
                                        ) {
                                            handleSubmit();
                                        } else {
                                            if (!name || name.length === 1) {
                                                toast.error(
                                                    "Name is required and should be more than one letter",
                                                    {
                                                        id: "name",
                                                    }
                                                );
                                            } else if (!image) {
                                                toast.error("Image is required", {
                                                    id: "image",
                                                });
                                            } else if (description.length < 10 && !isSubmitting) {
                                                toast.error(
                                                    "Description should be at least 10 characters long"
                                                );
                                            }
                                        }
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <BeatLoader size={10} color="#252525" />
                                    ) : (
                                        <p>
                                            Submit
                                            {description.length < 10 && (
                                                <span className={styles.count}>
                                                    ({10 - description.length} letters more)
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </button>
                            </div>
                        )}
                    </Modal>
                )}
                {showRulesModal && (
                    <Modal onClose={() => setShowRulesModal(false)} title="Bingo Rules">
                        <div className={styles.rulesContainer}>
                            <div className={styles.rulesDescription}>
                                <ul className={styles.rulesDescriptionContent}>
                                    <li className={styles.rulesDescriptionContentText}>
                                        Each letter on the Bingo grid represents the starting letter
                                        of a person's name.
                                    </li>
                                    <li className={styles.rulesDescriptionContentText}>
                                        Network with people at the event to find individuals whose
                                        names start with the letters on your grid.
                                    </li>
                                    <li className={styles.rulesDescriptionContentText}>
                                        Take a selfie with each person you find and upload it as
                                        proof, which marks a square on your grid.
                                    </li>
                                    <li className={styles.rulesDescriptionContentText}>
                                        To complete a letter in BINGO, a participant must mark 5
                                        cells in a row, column, or diagonal.
                                    </li>
                                    <li className={styles.rulesDescriptionContentText}>
                                        The first participant to complete all 5 letters in BINGO
                                        wins the game!
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Modal>
                )}
                {letters && letters.length !== 0 ? (
                    <>
                        {rowsBingo.filter((row) => row).length === 5 && (
                            <Confetti
                                width={window.innerWidth}
                                height={window.innerHeight}
                                recycle={false}
                                numberOfPieces={500}
                            />
                        )}
                        <div className={styles.bingoLetters}>
                            {["B", "I", "N", "G", "O"].map((letter, index) => (
                                <div
                                    key={index}
                                    className={styles.letter}
                                    style={{
                                        color: rowsBingo[index] ? "#1ED45E" : "#ffffff",
                                        textDecoration: rowsBingo[index]
                                            ? "line-through white"
                                            : "none",
                                    }}
                                >
                                    {letter}
                                </div>
                            ))}
                        </div>
                        <div className={styles.bingoGrid}>
                            {/* Show the letters BINGO and cut each one out when each of the bingo is hit */}

                            {cells &&
                                cells.map((cell1, index1) =>
                                    cell1.map((cell, index2) => (
                                        <div
                                            key={`${index1}-${index2}`}
                                            className={`${styles.bingoCell} ${
                                                cell.name
                                                    ? isBingoAchieved()
                                                        ? styles.bingoAchieved
                                                        : styles.active
                                                    : ""
                                            } `}
                                            onClick={() => {
                                                toggleCell(index1, index2);
                                                setIsOpen(true);
                                                setName(letters[index1][index2]);
                                                setImage(null);
                                                setDescription("");
                                            }}
                                        >
                                            <span className={styles.letter}>
                                                {letters[index1][index2]}
                                            </span>
                                            <span className={styles.name}>
                                                {cell.name && cell.name.length > 5
                                                    ? `${cell.name.substring(0, 5)}...`
                                                    : cell.name}
                                            </span>
                                        </div>
                                    ))
                                )}
                        </div>

                        <div className={styles.downloadYourHoogo}>
                            <p className={styles.downloadYourHoogoText}>
                                Don't you want to share
                                <span> Your Hoogo Card</span> with your friends?
                            </p>
                            <button
                                className={styles.downloadButton}
                                onClick={() => {
                                    if (numberOfImages >= 5) {
                                        navigate(`/${eventName}/${ticketCode}/hoogocard`);
                                    } else {
                                        toast.error("Make atleast 5 connections to download", {
                                            id: "bingo",
                                        });
                                    }
                                }}
                                style={{
                                    opacity: numberOfImages > 5 ? 1 : 0.5,
                                }}
                            >
                                View Hoogo
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className={styles.helperTextHeader}>
                            It seems, like no grid has been loaded.
                        </p>
                        <p className={styles.helperTextDescription}>
                            Kindly wait for the grid to load, or Contact Event Organizer
                        </p>
                    </>
                )}
                <p className={styles.rules} onClick={() => setShowRulesModal(true)}>
                    View Bing Rules
                </p>
            </div>
        </>
    );
};

export default GridComponent;
