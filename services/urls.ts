const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const hoogoURL = buildURL("/hoogo");
const buildVerseURL = buildURL("/buildverse");

export const commonUrls = {
    getBingoMatrix: (eventName: string, ticketCode: string) =>
        hoogoURL(`/manage-game/${eventName}/get-bingo-matrix/${ticketCode}/`),
    userInput: (eventName: string, ticketCode: string) =>
        hoogoURL(`/manage-game/${eventName}/user-input/${ticketCode}/`),
    getLeaderboard: (eventName: string) => hoogoURL(`/manage-game/${eventName}/leaderboard/`),
    validateTicket: (eventName: string, ticketCode: string) =>
        hoogoURL(`/manage-game/${eventName}/validate/${ticketCode}/`),
    onboardUser: hoogoURL("/common/onboard-user/"),
    getEventInfo: (eventName: string) => hoogoURL(`/manage-event/${eventName}/get-info/`),
    listUserEvents: hoogoURL("/manage-event/user/list-events/"),
    listMmpEvents: hoogoURL("/manage-event/user/mmp/list-events/"),

    createEvent: hoogoURL("/manage-event/create/"),
    updateEvent: (eventId: string) => hoogoURL(`/manage-event/${eventId}/update/`),
    importGrid: (eventName: string) => hoogoURL(`/manage-game/${eventName}/grid/import/`),
};

export const websocketUrls = {
    bingoLeaderboard: (eventName: string) =>
        `wss:/dev-api.buildnship.in/hoogo/manage-game/${eventName}/leaderboard/`,
};

export const buildVerse = {
    generateOTP: buildVerseURL("/generate-otp/"),
    preRegister: buildVerseURL("/pre-register/"),
    register: buildVerseURL("/register/"),
    login: buildVerseURL("/login/"),
    getAccessToken: buildVerseURL("/get-access-token/"),

    updateProfile: buildVerseURL("/update-profile/"),
    profileInfo: buildVerseURL("/profile-info/"),
    setUserData: (token: string) => buildVerseURL(`/set-user-data/${token}`),
    googleLogin: buildVerseURL("/auth/google/"),
    resetPassword: buildVerseURL("/reset-password/"),
    updateProfilePassword: buildVerseURL("/change-password/"),
};
