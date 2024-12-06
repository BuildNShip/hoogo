import React from "react";
import styles from "./BingoRules.module.css";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";

const BingoRules: React.FC = () => {
    const bingoRules = [
        "Each letter on the Bingo grid represents the starting letter of a person's name.",
        "Network with people at the event to find individuals whose names start with the letters on your grid.",
        "Take a selfie with each person you find and upload it as proof, which marks a square on your grid.",
        "The first participant to complete any 5 in a row, column, or diagonal wins the game!",
    ];
    return (
        <>
            <div className={styles.backgroundContainer}>
                <div className={styles.widthRestriction}>
                    <Navbar />
                </div>
                <div className={styles.container}>
                    <div className={styles.outerContainer}>
                        <div className={styles.playerRowContainer}>
                            <h1 className={styles.title}>Bingo Rules</h1>
                            <div className={styles.leaderboardHeadingDescription}>
                                Understand the basics of playing Bingo and how to win!
                            </div>

                            <div className={styles.bingoLetters}>
                                <span className={styles.letterButton}>B</span>
                                <span className={styles.letterButton}>I</span>
                                <span className={styles.letterButton}>N</span>
                                <span className={styles.letterButton}>G</span>
                                <span className={styles.letterButton}>O</span>
                            </div>

                            <div style={{ marginTop: "2rem" }}>
                                {bingoRules.map((rule, index) => (
                                    <div key={index} className={`${styles.playerRow} `}>
                                        <div className={styles.nameLink}>{rule}</div>
                                    </div>
                                ))}
                            </div>

                            <p className={styles.specialNote}>
                                After all, it's not just about winning, but about{" "}
                                <span>networking and making new friends!</span>
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default BingoRules;
