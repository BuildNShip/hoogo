import { useEffect, useState } from "react";
import { listUserEvents } from "../../../apis/user";
import styles from "./Dashboard.module.css";
import Footer from "../../../components/Footer/Footer";

const Dashboard = () => {
  const [events, setEvents] = useState<any[]>();

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
            <button className={styles.createEventButton}>Create Event</button>
          </div>
        ))}
      <button className={styles.createEventButton}>Create New Event</button>
      <Footer />
    </div>
  );
};

export default Dashboard;
