// import React from "react";
import { useState } from "react";
import styles from "./Login.module.css";
import { postLogin } from "../../../apis/common";
const Login = () => {
  const [ticketCode, setTicketCode] = useState("");
  const onSubmit = () => {
    postLogin(ticketCode);
  };

  return (
    <>
      <div className={styles.container}>
        <label className={styles.loginHeading}>Login</label>
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
    </>
  );
};

export default Login;
