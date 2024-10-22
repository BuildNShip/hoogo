// import React from "react";
import { useState } from "react";
import styles from "./Login.module.css";
// import { postLogin } from "../../../apis/common";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
const Login = () => {
  const { eventName } = useParams();
  const navigate = useNavigate();
  const [ticketCode, setTicketCode] = useState<string>();
  const onSubmit = () => {
    if (ticketCode === undefined) {
      toast.error("Please enter ticket code");
    } else {
      navigate("/" + eventName + "/" + ticketCode);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.centerContainer}>
        <div className={styles.container}>
          <label className={styles.loginHeading}>
            {eventName?.toUpperCase()}
          </label>
          <input
            className={styles.loginInput}
            type="text"
            placeholder="Ticket Code"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
          />
          <button className={styles.loginButton} onClick={() => onSubmit()}>
            Login
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
