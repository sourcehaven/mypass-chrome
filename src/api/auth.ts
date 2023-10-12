import { AxiosRequestConfig } from "axios";

import store from "state";
import { client, getAccessToken, getRefreshToken, makeUrl, removeTokens, setAccessToken, setRefreshToken } from ".";
import { console } from "utils";

const makeConfig = (config?: AxiosRequestConfig) => {
  if (config == null) {
    config = {};
  }
  const configState = store.getState().options;
  const url = makeUrl(configState.baseUrl, configState.port);
  console.info(`Using base url: ${url}`);
  config.baseURL = url;
  return config;
};

export const getLogin = async (config?: AxiosRequestConfig) => {
  config = makeConfig(config);
  const refreshToken = await getRefreshToken();
  const response = await client.get("/api/auth/login", {
    ...config,
    headers: { Authorization: `Bearer ${refreshToken}` },
    validateStatus: null,
  });
  if (response.status !== 204) {
    await removeTokens();
    throw new Error("Login failed.");
  }
};

export const login = async (
  data: { username: string; password: string; refreshToken?: string },
  config?: AxiosRequestConfig
) => {
  config = makeConfig(config);
  const response = await client.post("/api/auth/login", data, config);
  if (response.status !== 201) throw new Error("Login failed.");
  const { accessToken, refreshToken } = response.data as any;
  await setAccessToken(accessToken);
  await setRefreshToken(refreshToken);
};

export const logout = async (config?: AxiosRequestConfig) => {
  config = makeConfig(config);
  const refreshToken = await getRefreshToken();
  const accessToken = await getAccessToken();
  console.log(`Logging out token: ${refreshToken}`);
  const responseRefreshDelete = await client.delete("/api/auth/logout", {
    ...config,
    headers: { Authorization: `Bearer ${refreshToken}` },
    validateStatus: null,
  });
  console.log(`Logging out token: ${accessToken}`);
  const responseAccessDelete = await client.delete("/api/auth/logout", {
    ...config,
    headers: { Authorization: `Bearer ${accessToken}` },
    validateStatus: null,
  });
  if (responseAccessDelete.status !== 204 && responseRefreshDelete.status !== 204) throw new Error("Logout failed.");
  removeTokens();
};
