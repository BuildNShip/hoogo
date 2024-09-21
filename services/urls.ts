const buildURL = (basePath: string) => (endpoint: string) =>
  `${basePath}${endpoint}`;

const hoogoURL = buildURL("/hoogo");

export const commonUrls = {
  getBingoMatrix: (eventName: string, ticketCode: string) =>
    hoogoURL(`/${eventName}/get-bingo-matrix/${ticketCode}/`),
};
