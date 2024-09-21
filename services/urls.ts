export const commonApis = {
  postLogin: (username: string, password: string) =>
    `/login?username=${username}&password=${password}`,
};
