import React, { useState, useEffect } from "react";
import styles from "./EditEvent.module.css";
import toast from "react-hot-toast";
import Footer from "../../../../components/Footer/Footer";
import { getEventInfo } from "../../../../apis/common";
import { useParams } from "react-router-dom";
import { EventType } from "../../../User/StartGame/types";
import { updateEvent } from "../../../../apis/admin";

const EditEvent = () => {
  const eventName = useParams<{ eventName: string }>().eventName;
  const [eventInfo, setEventInfo] = useState<EventType>();

  // Fetch existing event data
  useEffect(() => {
    if (eventName) getEventInfo(eventName, setEventInfo);
  }, []);

  const handleUpdate = () => {
    if (!eventInfo) {
      toast.error("Event not found.");
      return;
    }

    updateEvent(eventInfo.id, eventInfo.matrix, eventInfo.mmp_event_id);
    toast.success("Event updated successfully!");
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>Edit Bingo Grid</p>
      <div className={styles.inputGroup}>
        <label htmlFor="mmpId" className={styles.label}>
          MMP ID
        </label>
        <input
          type="text"
          id="mmpId"
          className={styles.eventInput}
          value={eventInfo?.mmp_event_id || ""}
          onChange={(e) =>
            setEventInfo({ ...eventInfo!, mmp_event_id: e.target.value })
          }
          placeholder="Enter MMP ID"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="eventName" className={styles.label}>
          Event Name
        </label>
        <input
          type="text"
          id="eventName"
          className={styles.eventInput}
          value={eventInfo?.name || ""}
          onChange={(e) =>
            setEventInfo({ ...eventInfo!, name: e.target.value })
          }
          placeholder="Enter Event Name"
        />
      </div>

      <div className={styles.grid}>
        {eventInfo?.matrix?.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              maxLength={1}
              className={styles.gridInput}
              value={eventInfo.matrix[rowIndex][colIndex]}
              onChange={(e) =>
                setEventInfo({
                  ...eventInfo!,
                  matrix: eventInfo?.matrix?.map((r, i) =>
                    r.map((c, j) =>
                      i === rowIndex && j === colIndex
                        ? e.target.value.toUpperCase()
                        : c
                    )
                  ),
                })
              }
              placeholder={`${String.fromCharCode(65 + rowIndex)}${
                colIndex + 1
              }`}
            />
          ))
        )}
      </div>

      <button className={styles.updateButton} onClick={handleUpdate}>
        Update Event
      </button>

      <Footer />
    </div>
  );
};

export default EditEvent;
