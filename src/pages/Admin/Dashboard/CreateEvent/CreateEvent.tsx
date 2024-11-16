import React, { useState } from "react";
import styles from "./CreateEvent.module.css";
import toast from "react-hot-toast";
import { createEvent } from "../../../../apis/admin";
import Footer from "../../../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const CreateEvent: React.FC = () => {
  const [eventName, setEventName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    createEvent(eventName, navigate);
    toast.success("Bingo grid saved successfully!");
  };

  return (
    <div className={styles.container}>
      <>
        <h1 className={styles.title}>Bingo Grid Setup</h1>
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

        <button className={styles.submitButton} onClick={handleSubmit}>
          Confirm & Save
        </button>
      </>

      <Footer />
    </div>
  );
};

export default CreateEvent;
