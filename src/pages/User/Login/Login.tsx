// import React from "react";
import { useState } from "react";
import styles from "./Login.module.css";
// import { postLogin } from "../../../apis/common";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";

const Login = () => {
    const { eventName } = useParams();
    const navigate = useNavigate();
    const [ticketCode, setTicketCode] = useState<string>();

    const onSubmit = () => {
        if (ticketCode === undefined) {
            toast.error("Please enter ticket code", {
                id: "ticketCode",
            });
        } else {
            navigate("/" + eventName + "/" + ticketCode);
        }
    };

    return (
        <>
            <div className={styles.mainContainer}>
                <p className={styles.pageHeaderText}>
                    Hi, <span>Elevate 2024</span> Participants 👋
                </p>
                <div className={styles.loginContainer}>
                    <div className={styles.logoContainerHeader}>
                        <p className={styles.loginContainerHeaderText}>Welcome To Hoogo</p>
                        <p className={styles.loginContainerDescription}>
                            Create, play, and make networking faster and fun.
                        </p>
                    </div>
                    <div className={styles.inputFieldContainer}>
                        <p className={styles.inputFieldLabel}>Ticket Code *</p>
                        <p className={styles.inputFieldDescription}>
                            Kindly refer your ticket for the code.
                        </p>
                        <input
                            className={styles.inputField}
                            type="text"
                            placeholder="MMPXXXXXXXX"
                            value={ticketCode}
                            onChange={(e) => setTicketCode(e.target.value)}
                        />
                    </div>
                    <button
                        className={styles.loginButton}
                        style={
                            ticketCode && ticketCode?.length > 0
                                ? { backgroundColor: "#ffd700", color: "#252525", opacity: 1 }
                                : {
                                      backgroundColor: "#252525",
                                      cursor: "not-allowed",
                                  }
                        }
                        onClick={onSubmit}
                    >
                        Login
                    </button>
                </div>

                <p className={styles.funFact}>
                    <span>Fun Fact:</span> The very first version of this game was built the day
                    before its very first event.
                </p>
            </div>
            <Footer />
        </>
    );
};

export default Login;
