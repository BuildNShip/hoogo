import { useEffect, useState } from "react";
import { listUserEvents } from "../../../apis/user";
import styles from "./Dashboard.module.css";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import Modal from "../../../components/Modal/Modal";
import { CreateEventTypes } from "./types";
import { createNewEvent } from "../../../apis/admin";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>();
  const [createEvent, setCreateEvent] = useState<CreateEventTypes>();
  useEffect(() => {
    if (createEvent && !createEvent.showModal) listUserEvents(setEvents);
  }, [createEvent]);

  useEffect(() => {
    listUserEvents(setEvents);
  }, []);

  const handleEventCreation = () => {
    if (createEvent && createEvent.name) {
      createNewEvent(createEvent.name, navigate);
    }
  };

  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.outerContainer}>
        <Navbar setCreateEvent={setCreateEvent} />
        <div className={styles.dashboardContainer}>
          {createEvent && createEvent.showModal && (
            <Modal
              title="Create Event"
              onClose={() => setCreateEvent({ name: "", showModal: false })}
            >
              <div className={styles.inputGroup}>
                <label htmlFor="eventName" className={styles.label}>
                  Event Name
                </label>
                <input
                  type="text"
                  id="eventName"
                  className={styles.eventInput}
                  value={createEvent.name}
                  onChange={(e) =>
                    setCreateEvent({ ...createEvent, name: e.target.value })
                  }
                  placeholder="Enter Event Name"
                />
              </div>

              <button
                className={styles.submitButton}
                onClick={handleEventCreation}
              >
                Confirm & Save
              </button>
            </Modal>
          )}
          <p className={styles.pageHeader}>
            Your <span>Hoogos</span>
          </p>
          <p className={styles.pageDescription}>
            Welcome to the dashboard! Here you can manage your events.
          </p>
          <div className={styles.eventCardContainer}>
            {events &&
              events.map((event) => (
                <div key={event.id} className={styles.eventCard}>
                  <h2 className={styles.eventName}>{event.name}</h2>

                  <button
                    className={styles.createEventButton}
                    onClick={() => {
                      navigate(`/dashboard/${event.name}/`);
                    }}
                  >
                    Manage
                  </button>
                </div>
              ))}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
