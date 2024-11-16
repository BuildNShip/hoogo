const buildURL = (basePath: string) => (endpoint: string) =>
  `${basePath}${endpoint}`;

const hoogoURL = buildURL("/hoogo");
const buildVerseURL = buildURL("/buildverse");

export const commonUrls = {
  getBingoMatrix: (eventName: string, ticketCode: string) =>
    hoogoURL(`/${eventName}/get-bingo-matrix/${ticketCode}/`),
  userInput: (eventName: string, ticketCode: string) =>
    hoogoURL(`/${eventName}/user-input/${ticketCode}/`),
  getLeaderboard: (eventName: string) => hoogoURL(`/${eventName}/leaderboard/`),
  validateTicket: (eventName: string, ticketCode: string) =>
    hoogoURL(`/${eventName}/validate/${ticketCode}/`),
  onboardUser: hoogoURL("/onboard-user/"),
  getEventInfo: (eventName: string) =>
    hoogoURL(`/event/${eventName}/get-info/`),
  listUserEvents: hoogoURL("/user/list-events/"),
  createEvent: hoogoURL("/event/create/"),
  updateEvent: (eventId: string) => hoogoURL(`/event/${eventId}/update/`),
};

export const websocketUrls = {
  bingoLeaderboard: (eventName: string) =>
    `wss:/dev-api.buildnship.in/hoogo/${eventName}/leaderboard/`,
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
