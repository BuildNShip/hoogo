const buildURL = (basePath: string) => (endpoint: string) =>
    `${basePath}${endpoint}`;

const hoogoURL = buildURL("/hoogo");
const buildVerseURL = buildURL("/buildverse");

export const commonUrls = {
    getBingoMatrix: (eventName: string) =>
        hoogoURL(`/manage-game/${eventName}/get-bingo-matrix/`),
    userInput: (eventName: string) =>
        hoogoURL(`/manage-game/${eventName}/user-input/`),
    getLeaderboard: (eventName: string) =>
        hoogoURL(`/manage-game/${eventName}/leaderboard/`),
    validateTicket: (eventName: string) =>
        hoogoURL(`/manage-game/${eventName}/validate/`),
    onboardUser: hoogoURL("/common/onboard-user/"),
    getEventInfo: (eventName: string) =>
        hoogoURL(`/manage-event/${eventName}/get-info/`),
    listUserEvents: hoogoURL("/manage-event/user/list-events/"),
    listMmpEvents: hoogoURL("/manage-event/user/mmp/list-events/"),
    getRandomImages: (eventName: string) =>
        hoogoURL(`/manage-game/${eventName}/random/images/`),

    createEvent: hoogoURL("/manage-event/create/"),
    updateEvent: (eventId: string) =>
        hoogoURL(`/manage-event/${eventId}/update/`),
    importGrid: (eventName: string) =>
        hoogoURL(`/manage-game/${eventName}/grid/import/`),
    deleteEvent: (eventId: string) =>
        hoogoURL(`/manage-event/${eventId}/delete/`),

    totalConnections: hoogoURL("/common/total-connections/")
};

export const websocketUrls = {
    bingoLeaderboard: (eventName: string) =>
        `${
            import.meta.env.VITE_WS_URL
        }/hoogo/manage-game/${eventName}/leaderboard/`,
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
