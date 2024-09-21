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

// export const privateGateway = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL as string,
//   headers: {
//     "ngrok-skip-browser-warning": "69420",
//     "Content-Type": "application/json",
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     Product: "Makemypass",
//     "Accept-Language": navigator.language,
//   },
// });

// privateGateway.interceptors.request.use(
//   function (config) {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     if (config.url) {
//       if (!config.url.endsWith("/") && !config.url.includes("?")) {
//         config.url += "/";
//       }
//     }

//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// privateGateway.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   async function (error) {
//     if (error.response?.data?.detail?.statusCode === 1000) {
//       try {
//         const response = await publicGateway.post(buildVerse.getAccessToken, {
//           refresh_token: localStorage.getItem("refreshToken"),
//         });
//         localStorage.setItem(
//           "accessToken",
//           response.data.response.access_token
//         );
//         const { config } = error;
//         config.headers["Authorization"] = `Bearer ${localStorage.getItem(
//           "accessToken"
//         )}`;
//         return await new Promise((resolve, reject) => {
//           privateGateway
//             .request(config)
//             .then((response_1) => {
//               resolve(response_1);
//             })
//             .catch((error_1) => {
//               reject(error_1);
//             });
//         });
//       } catch (error_2) {
//         toast.error("Your session has expired. Please login again.");
//         setTimeout(() => {
//           localStorage.clear();
//           window.location.href = "/login";
//         }, 3000);
//         return await Promise.reject(error_2);
//       }
//     } else {
//       // Any status codes that fall outside the range of 2xx cause this function to trigger
//       // Do something with response error

//       // toast.error(error.response?.data?.detail.message || 'Something went wrong');
//       return await Promise.reject(error);
//     }
//   }
// );

// /* WebSocket Connect Function
//     a). The function sets up a WebSocket connection and listens for messages.
//     b). If a message with statusCode 1000 is received, it indicates session expiry. The function then attempts to refresh the access token.
//     c). If successful, it updates the token in local storage, creates a new WebSocket connection, and resolves the Promise with the new WebSocket.
//     d). If unsuccessful, it clears local storage, shows an error message, and redirects to the login page.
//     e).If the statusCode is not 1000, it resolves the Promise with the original WebSocket.
// */

// export const connectPrivateSocket = ({
//   url,
//   type,
// }: {
//   url: string;
//   type?: string;
// }): Promise<WebSocket> => {
//   const baseURL =
//     (import.meta.env.VITE_WEBSOCKET_URL as string) + "makemypass/";

//   let wsUrl = "";
//   if (type === "public")
//     wsUrl = `${baseURL}${url}?timezone=${
//       Intl.DateTimeFormat().resolvedOptions().timeZone
//     }`;
//   else
//     wsUrl = `${baseURL}${url}?Authorization=Bearer ${localStorage.getItem(
//       "accessToken"
//     )}&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`;

//   return new Promise((resolve) => {
//     const ws = new WebSocket(wsUrl);

//     ws.onmessage = async (event) => {
//       const statusCode = JSON.parse(event.data).statusCode;

//       if (statusCode === 1000) {
//         try {
//           const response = await publicGateway.post(buildVerse.getAccessToken, {
//             refresh_token: localStorage.getItem("refreshToken"),
//           });

//           localStorage.setItem(
//             "accessToken",
//             response.data.response.access_token
//           );

//           wsUrl = `${url}?Authorization=Bearer ${
//             response.data.response.access_token
//           }&timezone=${Intl.DateTimeFormat().resolvedOptions().timeZone}`;

//           const ws = new WebSocket(wsUrl);

//           resolve(ws);
//         } catch (error) {
//           toast.error("Your session has expired. Please login again.");
//           setTimeout(() => {
//             localStorage.clear();
//             window.location.href = "/login";
//           }, 3000);
//         }
//       }

//       resolve(ws);
//     };
//   });
// };
