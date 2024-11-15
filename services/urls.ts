const buildURL = (basePath: string) => (endpoint: string) => `${basePath}${endpoint}`;

const hoogoURL = buildURL("/hoogo");

export const commonUrls = {
    getBingoMatrix: (eventName: string, ticketCode: string) =>
        hoogoURL(`/${eventName}/get-bingo-matrix/${ticketCode}/`),
    userInput: (eventName: string, ticketCode: string) =>
        hoogoURL(`/${eventName}/user-input/${ticketCode}/`),
    getLeaderboard: (eventName: string) => hoogoURL(`/${eventName}/leaderboard/`),
    validateTicket: (eventName: string, ticketCode: string) =>
        hoogoURL(`/${eventName}/validate/${ticketCode}/`),
};

export const websocketUrls = {
    bingoLeaderboard: (eventName: string) =>
        `wss:/dev-api.buildnship.in/hoogo/${eventName}/leaderboard/`,
};
