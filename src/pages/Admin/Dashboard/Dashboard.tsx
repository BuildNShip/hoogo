import { useEffect, useState } from "react";
import { listUserEvents } from "../../../apis/user";
import styles from "./Dashboard.module.css";
import Footer from "../../../components/Footer/Footer";
import Navbar from "../../../components/Navbar/Navbar";
import Modal from "../../../components/Modal/Modal";
import { CreateEventTypes, EventType } from "./types";
import { createNewEvent } from "../../../apis/admin";
import { useNavigate } from "react-router-dom";
import { GoPeople } from "react-icons/go";

const Dashboard = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventType[]>();
    const [createEvent, setCreateEvent] = useState<CreateEventTypes>();
    const userName = localStorage.getItem("userEmail")?.split("@")[0];
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

                            <button className={styles.submitButton} onClick={handleEventCreation}>
                                Confirm & Save
                            </button>
                        </Modal>
                    )}
                    <p className={styles.pageHeader}>
                        <span>Hi,</span> {userName}
                    </p>
                    <p className={styles.pageDescription}>
                        Welcome to the dashboard! Here you can manage your events.
                    </p>
                    <div className={styles.eventCardContainer}>
                        {events &&
                            events.map((event) => (
                                <div key={event.id} className={styles.eventCard}>
                                    <div className={styles.titleRow}>
                                        <p className={styles.eventName}>
                                            {event.name.length > 15
                                                ? `${event.name.substring(0, 15)}...`
                                                : event.name}
                                        </p>
                                        <p className={styles.participantCount}>
                                            <GoPeople color="#fff" size={15} />{" "}
                                            {event.participant_count} Participants
                                        </p>
                                    </div>

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

                        <div
                            className={styles.eventCard}
                            onClick={() => setCreateEvent({ name: "", showModal: true })}
                        >
                            <p className={styles.eventName}>Create New Event</p>
                            <button className={`${styles.createEventButton} ${styles.active}`}>
                                Create +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;
