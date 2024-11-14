import React, { useState } from "react";
import styles from "./GridComponent.module.css";
import Modal from "../../../../../components/Modal/Modal";
import { postUserInput } from "../../../../../apis/common";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";

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

        if (selectedCell && image && name && description) {
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
        } else {
            toast.error("Please fill in all fields");
        }

        setIsOpen(false);
    };

    return (
        <>
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
                            <form onSubmit={handleSubmit} className={styles.form}>
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
                                            onChange={handleImageChange}
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
                                        placeholder="When I met this person, I thought..."
                                    />
                                </div>

                                <button
                                    className={styles.submitButton}
                                    type="submit"
                                    style={
                                        name.length > 1 && description.length > 10 && image !== null
                                            ? {
                                                  backgroundColor: "#ffd700",
                                                  color: "#252525",
                                                  opacity: 1,
                                              }
                                            : {
                                                  backgroundColor: "#252525",
                                                  cursor: "not-allowed",
                                              }
                                    }
                                >
                                    Submit
                                    {/* if the number of charaters of description is < 10 show the count needed
                                     */}
                                    {description.length < 10 && (
                                        <span className={styles.count}>
                                            ({10 - description.length} letters more)
                                        </span>
                                    )}
                                </button>
                                {/* {image !== null && (
                                    <button
                                        className={styles.removeImage}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setImage(null);
                                        }}
                                    >
                                        Remove Image
                                    </button>
                                )} */}
                            </form>
                        )}
                    </Modal>
                )}
                <div className={styles.bingoGrid}>
                    {cells &&
                        cells.map((cell1, index1) =>
                            cell1.map((cell, index2) => (
                                <div
                                    key={`${index1}-${index2}`}
                                    className={`${styles.bingoCell} ${
                                        cell.name ? styles.active : ""
                                    }`}
                                    onClick={() => {
                                        toggleCell(index1, index2);
                                        setIsOpen(true);
                                        setName(letters[index1][index2]);
                                        setImage(null);
                                        setDescription("");
                                    }}
                                >
                                    <span className={styles.letter}>{letters[index1][index2]}</span>
                                    <span className={styles.name}>{cell.name}</span>
                                </div>
                            ))
                        )}
                </div>
            </div>
        </>
    );
};

export default GridComponent;
