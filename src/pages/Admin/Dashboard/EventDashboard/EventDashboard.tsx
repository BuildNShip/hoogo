import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./EventDashboard.module.css";
import toast from "react-hot-toast";
import { getEventInfo } from "../../../../apis/common";
import { updateEvent } from "../../../../apis/admin";
import Modal from "../../../../components/Modal/Modal";
import Footer from "../../../../components/Footer/Footer";
import { formatDateTime, formatTime } from "../../../../functions";
import { BeatLoader, PacmanLoader } from "react-spinners";
import { IoIosTime } from "react-icons/io";
import { Player } from "./types";

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
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isQRLoaded, setIsQRLoaded] = useState(false);
  const [isdownloading, setIsDownloading] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);

  const navigate = useNavigate();

  // Fetch event data on mount
  useEffect(() => {
    if (eventName) {
      getEventInfo(eventName, setEventInfo);
      setPlayers([
        {
          user_code: "player1",
          user_name: "John Doe",
          completed_at: new Date(),
          score: [true, false, true, false, true],
        },
        {
          user_code: "player2",
          user_name: "Jane Smith",
          completed_at: null,
          score: [false, true, false, true, false],
        },
        {
          user_code: "player3",
          user_name: "Alice",
          completed_at: new Date(),
          score: [true, true, true, true, true],
        },
        {
          user_code: "player4",
          user_name: "Bob",
          completed_at: null,
          score: [false, false, false, false, false],
        },
      ]);
    }
  }, [eventName]);

  const downloadQR = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `${eventInfo?.name}_qr.png`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(link.href);
    } catch (error) {
      toast.error("Failed to download ticket");
    } finally {
      setIsDownloading && setIsDownloading(false);
    }
  };

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
    <div className={styles.backgroundContainer}>
      <div className={styles.outerContainer}>
        <div className={styles.dashboardContainer}>
          <div className={styles.eventThemeHeader}>
            <div className={styles.headerActions}>
              <div
                className={styles.backButton}
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                {"<"}
              </div>
              <h1 className={styles.eventTitle}>{eventInfo?.name}</h1>
            </div>
            <div
              className={`${styles.mmpConnectedPill} ${
                eventInfo?.mmp_event_id ? styles.active : ""
              }`}
            >
              {eventInfo?.mmp_event_id ? (
                <p className={styles.mmpConnectedText}>MMP Connected</p>
              ) : (
                <p className={styles.mmpNotConnectedText}>MMP Not Connected</p>
              )}
            </div>
          </div>
          <div className={styles.eventDetails}>
            <p>
              <strong>Created At:</strong>{" "}
              {formatDateTime(
                eventInfo?.created_at
                  ? new Date(eventInfo.created_at)
                  : new Date()
              )}
            </p>
            <p>
              <strong>Participants:</strong> {eventInfo?.participant_count}
            </p>
          </div>

          {/* Public Link Section */}
          <div className={styles.publicLinkContainer}>
            <p className={styles.publicLink}>
              {new URL(`https://hoogo.makemypass.com/${eventInfo?.name}`).href}
            </p>
            <button
              className={styles.copyButton}
              onClick={() =>
                toast.success("Link copied to clipboard", {
                  icon: "📋",
                }) &&
                navigator.clipboard.writeText(
                  new URL(`https://hoogo.makemypass.com/${eventInfo?.name}`)
                    .href
                )
              }
            >
              Copy
            </button>
            <button
              className={styles.generateQrButton}
              onClick={() => {
                setIsQRModalOpen(true);
                setIsQRLoaded(false);
              }}
            >
              QR Code
            </button>
          </div>

          <div className={styles.actionsContainer}>
            <h2 className={styles.gridHeader}>Actions</h2>
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
              Edit Grid
            </button>
            <button className={styles.editButton} onClick={generateRandomGrid}>
              Generate Random Grid
            </button>
          </div>
          {/* Bingo Grid Section */}

          <div className={styles.gridContainer}>
            <h2
              className={styles.gridHeader}
              style={{
                color: "#FFD700",
              }}
            >
              Bingo Grid
            </h2>
            <p className={styles.gridDescription}>
              This is current Bingo grid for the event.
            </p>
            <div className={styles.grid}>
              {eventInfo?.matrix.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={styles.gridCell}
                  >
                    {cell}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={styles.playerRowContainer}>
            {players.map((player, playerIndex) => (
              <div key={playerIndex} className={styles.playerRow}>
                <Link
                  to={`/dashboard/${eventName}/leaderboard/${player.user_code}`}
                  className={styles.nameLink}
                >
                  {player.user_name || player.user_code}

                  {player.completed_at && (
                    <div className={styles.completedAtText}>
                      <IoIosTime />
                      <p>{formatDateTime(new Date(player.completed_at))}</p>
                    </div>
                  )}
                </Link>

                <div className={styles.bingoLetters}>
                  {["B", "I", "N", "G", "O"].map((letter, letterIndex) => (
                    <button
                      key={letter}
                      className={`${styles.letterButton} ${
                        player.score[letterIndex] ? styles.strikethrough : ""
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            ))}
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
                    setEventInfo({
                      ...eventInfo!,
                      mmp_event_id: e.target.value,
                    })
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

          {isQRModalOpen && (
            <Modal title="QR Code" onClose={() => setIsQRModalOpen(false)}>
              <div className={styles.qrContainer}>
                <div
                  className={styles.qrLoaderContainer}
                  style={{ display: isQRLoaded ? "none" : "flex" }}
                >
                  <PacmanLoader
                    color="#FFD700"
                    size={25}
                    className={styles.pacmanLoader}
                  />
                  <p className={styles.loaderText}>
                    Hang tight! Generating QR Code...
                  </p>
                </div>

                <div
                  className={styles.qrImageContainer}
                  style={{
                    display: isQRLoaded ? "flex" : "none",
                  }}
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
                      new URL(`https://hoogo.makemypass.com/${eventInfo?.name}`)
                        .href
                    }`}
                    alt="QR Code"
                    onLoad={() => setIsQRLoaded(true)}
                  />
                  <button
                    className={styles.copyQr}
                    onClick={() => {
                      setIsDownloading && setIsDownloading(true);
                      const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
                        new URL(
                          `https://hoogo.makemypass.com/${eventInfo?.name}`
                        ).href
                      }`;
                      downloadQR(url);
                    }}
                  >
                    {isdownloading ? (
                      <BeatLoader color="#272727" size={10} />
                    ) : (
                      "Download"
                    )}
                  </button>
                </div>
              </div>
            </Modal>
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
