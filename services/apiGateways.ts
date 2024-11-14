import axios from "axios";
// import toast from "react-hot-toast";

// import { buildVerse } from "./urls.ts";

export const publicGateway = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
    headers: {
        "ngrok-skip-browser-warning": "69420",
        "Content-Type": "application/json",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        Product: "Hoogo",
        "Accept-Language": navigator.language,
    },
});

publicGateway.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
