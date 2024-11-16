import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./EventDashboard.module.css";
import toast from "react-hot-toast";
import { getEventInfo } from "../../../../apis/common";
import { updateEvent } from "../../../../apis/admin";
import Modal from "../../../../components/Modal/Modal";
import Footer from "../../../../components/Footer/Footer";

// Event Type Definition
type EventType = {
  id: string;
  mmp_event_id: string | null;
  name: string;
  matrix: string[][];
  participant_count: number;
  created_at: string;
};

const EventDashboard = () => {
  const { eventName } = useParams<{ eventName: string }>();
  const [eventInfo, setEventInfo] = useState<EventType>();
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isEditMmpIdModalOpen, setIsEditMmpIdModalOpen] = useState(false);
  const [isEditGridModalOpen, setIsEditGridModalOpen] = useState(false);

  // Fetch event data on mount
  useEffect(() => {
    if (eventName) {
      getEventInfo(eventName, setEventInfo);
    }
  }, [eventName]);

  const handleUpdate = () => {
    updateEvent(eventInfo?.id!, eventInfo?.matrix!, eventInfo?.mmp_event_id!);
    toast.success("Event updated successfully!");
  };

  const generateRandomGrid = () => {
    const newMatrix = Array(5)
      .fill(null)
      .map(() =>
        Array(5)
          .fill(null)
          .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
      );
    setEventInfo({ ...eventInfo!, matrix: newMatrix });
  };

  const handleGridChange = (value: string, row: number, col: number) => {
    const newMatrix = [...eventInfo!.matrix];
    newMatrix[row][col] = value.toUpperCase().slice(0, 1);
    setEventInfo({ ...eventInfo!, matrix: newMatrix });
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.eventTitle}>{eventInfo?.name}</h1>
      <div className={styles.eventDetails}>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(eventInfo?.created_at!).toLocaleDateString()}
        </p>
        <p>
          <strong>Participants:</strong> {eventInfo?.participant_count}
        </p>
      </div>

      {/* Public Link Section */}
      <div className={styles.publicLinkContainer}>
        <p className={styles.publicLink}>https://myevent.com/{eventInfo?.id}</p>
        <button
          className={styles.copyButton}
          onClick={() =>
            navigator.clipboard.writeText(
              `https://myevent.com/${eventInfo?.id}`
            )
          }
        >
          Copy
        </button>
      </div>

      {/* Bingo Grid Section */}
      <div className={styles.gridContainer}>
        <h2 className={styles.gridHeader}>Bingo Grid</h2>
        <div className={styles.grid}>
          {eventInfo?.matrix.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className={styles.gridCell}>
                {cell}
              </div>
            ))
          )}
        </div>
        <button className={styles.generateButton} onClick={generateRandomGrid}>
          Generate Random Grid
        </button>
      </div>

      {/* Edit Buttons */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.editButton}
          onClick={() => setIsEditNameModalOpen(true)}
        >
          Edit Event Name
        </button>
        <button
          className={styles.editButton}
          onClick={() => setIsEditMmpIdModalOpen(true)}
        >
          Edit MMP Event ID
        </button>
        <button
          className={styles.editButton}
          onClick={() => setIsEditGridModalOpen(true)}
        >
          Edit Bingo Grid
        </button>
      </div>

      {/* Modals */}
      {isEditNameModalOpen && (
        <Modal
          title="Edit Event Name"
          onClose={() => setIsEditNameModalOpen(false)}
        >
          <div className={styles.modalContent}>
            <input
              type="text"
              value={eventInfo?.name}
              onChange={(e) =>
                setEventInfo({ ...eventInfo!, name: e.target.value })
              }
              className={styles.modalInput}
            />
            <button
              className={styles.saveButton}
              onClick={() => {
                handleUpdate();
                setIsEditNameModalOpen(false);
              }}
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {isEditMmpIdModalOpen && (
        <Modal
          title="Edit MMP Event ID"
          onClose={() => setIsEditMmpIdModalOpen(false)}
        >
          <div className={styles.modalContent}>
            <input
              type="text"
              value={eventInfo?.mmp_event_id || ""}
              onChange={(e) =>
                setEventInfo({ ...eventInfo!, mmp_event_id: e.target.value })
              }
              className={styles.modalInput}
            />
            <button
              className={styles.saveButton}
              onClick={() => {
                handleUpdate();
                setIsEditMmpIdModalOpen(false);
              }}
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {isEditGridModalOpen && (
        <Modal
          title="Edit Bingo Grid"
          onClose={() => setIsEditGridModalOpen(false)}
        >
          <div className={styles.modalContent}>
            <div className={styles.grid}>
              {eventInfo?.matrix.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="text"
                    value={cell}
                    maxLength={1}
                    onChange={(e) =>
                      handleGridChange(e.target.value, rowIndex, colIndex)
                    }
                    className={styles.gridInput}
                  />
                ))
              )}
            </div>
            <button
              className={styles.saveButton}
              onClick={() => {
                handleUpdate();
                setIsEditGridModalOpen(false);
              }}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
      <Footer />
    </div>
  );
};

export default EventDashboard;
