import "./index.css";

import * as React from "react";
import ReactDOM from "react-dom/client";
import { Toaster, ToastPosition } from "react-hot-toast";

import { Routes } from "./router";

const toasterProps = {
    containerStyle: {
        fontFamily: "Nunito, sans-serif",
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
        <Routes />
        <Toaster {...toasterProps} />
    </React.StrictMode>
);
