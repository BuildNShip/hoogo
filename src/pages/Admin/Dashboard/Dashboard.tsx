import { useEffect, useState } from "react";
import { listUserEvents } from "../../../apis/user";
import styles from "./Dashboard.module.css";
import Footer from "../../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";

const Dashboard = () => {
  const [events, setEvents] = useState<any[]>();
  const navigate = useNavigate();
  useEffect(() => {
    listUserEvents(setEvents);
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.dashboardContainer}>
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
                  // onClick={() => {
                  //   navigate(`/user/dashboard/edit/${event.name}`);
                  // }}
                >
                  Manage
                </button>
              </div>
            ))}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
