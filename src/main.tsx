import "./index.css";

import * as React from "react";
import ReactDOM from "react-dom/client";
import { Toaster, ToastPosition } from "react-hot-toast";

import { Routes } from "./router";
import { GoogleOAuthProvider } from "@react-oauth/google";

const toasterProps = {
    containerStyle: {
        fontFamily: "Mona Sans, sans-serif",
    },
    toastOptions: {
        style: {
            backgroundColor: "#252525",
            border: "0.5px solid #232A2B",
            color: "#fdfdfd",
        },
    },
    position: "bottom-center" as ToastPosition,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <Routes />
            <Toaster {...toasterProps} />
        </GoogleOAuthProvider>
    </React.StrictMode>
);
