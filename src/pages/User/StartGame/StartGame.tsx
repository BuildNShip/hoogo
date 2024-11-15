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

const StartGame = () => {
  const { eventName } = useParams();
  const navigate = useNavigate();
  const [ticketCode, setTicketCode] = useState<string>();
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string>("");
  const [eventInfo, setEventInfo] = useState<EventType>();

  useEffect(() => {
    if (eventName) {
      getEventInfo(eventName, setEventInfo);
    }
  }, []);

  const onSubmit = () => {
    if (ticketCode === undefined) {
      toast.error("Please enter ticket code", {
        id: "ticketCode",
      });
    } else {
      if (eventName && eventInfo && eventInfo.mmp_id)
        validateTicketCode(
          eventName,
          ticketCode,
          navigate,
          setIsValidating,
          setError
        );
      else navigate("/" + eventName + "/" + ticketCode);
    }
  };

  return (
    <>
      <Navbar />
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
                ? { backgroundColor: "#ffd700", color: "#252525", opacity: 1 }
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
        </div>

        <p className={styles.funFact}>
          <span>Fun Fact:</span> The very first version of this game was built
          the day before its very first debut & this version yesterday.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default StartGame;
