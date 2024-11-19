import { useEffect, useState } from "react";
import styles from "./StartGame.module.css";

import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer/Footer";
import { getEventInfo, validateTicketCode } from "../../../apis/common";
import { BeatLoader } from "react-spinners";
import Navbar from "../../../components/Navbar/Navbar";
import { EventType } from "./types";
import PageNotFound from "../../PageNotFound/PageNotFound";

const StartGame = () => {
    const { eventName } = useParams();
    const navigate = useNavigate();
    const [ticketCode, setTicketCode] = useState<string>();
    const [isValidating, setIsValidating] = useState(false);
    const [error, setError] = useState<string>("");
    const [eventInfo, setEventInfo] = useState<EventType>();
    const onSubmit = () => {
        if (eventName && ticketCode)
            validateTicketCode(eventName, ticketCode, navigate, setIsValidating, setError);
        else {
            toast.error("Invalid ticket code", {
                id: "invalidTicketCode",
            });
        }
    };

    useEffect(() => {
        if (eventName) {
            getEventInfo(eventName, setEventInfo);
        }
    }, [eventName]);

    if (eventInfo?.name) {
        return (
            <div className={styles.backgroundContainer}>
                <div className={styles.outerContainer}>
                    <Navbar />
                    <div className={styles.mainContainer}>
                        <p className={styles.pageHeaderText}>
                            Hi, <span>{eventInfo?.name}</span> Participants 👋
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
                                    onChange={(e) => {
                                        setTicketCode(e.target.value);
                                        if (error) {
                                            setError("");
                                        }
                                    }}
                                />
                                {error && <p className={styles.errorText}>{error}</p>}
                            </div>
                            <button
                                className={styles.loginButton}
                                style={
                                    ticketCode && ticketCode?.length > 0
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
                                onClick={onSubmit}
                            >
                                {isValidating ? (
                                    <div className={styles.loaderContainer}>
                                        <BeatLoader
                                            color="#252525"
                                            loading
                                            size={8}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div>
                                ) : (
                                    "Start Game"
                                )}
                            </button>

                            {eventInfo.mmp_event_id && (
                                <p className={styles.makemypassConnectedMessage}>
                                    This event is <span>connected with makemypass.com</span>, Kindly
                                    enter the <span>ticket code in your pass</span> to start the
                                    game.
                                </p>
                            )}
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    } else {
        return <PageNotFound />;
    }
};

export default StartGame;
