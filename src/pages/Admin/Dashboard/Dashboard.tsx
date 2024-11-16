import { useEffect, useState } from "react";
import { listUserEvents } from "../../../apis/user";
import styles from "./Dashboard.module.css";
import Footer from "../../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState<any[]>();
  const navigate = useNavigate();
  useEffect(() => {
    listUserEvents(setEvents);
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <p className={styles.pageHeader}>Dashboard</p>
      <p className={styles.pageDescription}>
        Welcome to the dashboard! Here you can manage your events.
      </p>
      {events &&
        events.map((event) => (
          <div key={event.id} className={styles.eventCard}>
            <h2 className={styles.eventName}>{event.name}</h2>

            <button
              className={styles.createEventButton}
              onClick={() => {
                navigate(`/user/dashboard/edit/${event.name}`);
              }}
            >
              Edit Event
            </button>
          </div>
        ))}
      <button
        className={styles.createEventButton}
        onClick={() => {
          navigate("/user/dashboard/create");
        }}
      >
        Create New Event
      </button>
      <Footer />
    </div>
  );
};

export default Dashboard;
