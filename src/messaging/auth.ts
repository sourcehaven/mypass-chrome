import { AxiosRequestConfig } from "axios";

export const getLogin = async (config?: AxiosRequestConfig) => {
  return chrome.runtime.sendMessage({ action: "getLogin", params: { config } });
};

export const login = async (
  data: { username: string; password: string; refreshToken?: string },
  config?: AxiosRequestConfig
) => {
  return chrome.runtime.sendMessage({ action: "login", params: { data, config } });
};

export const logout = async (config?: AxiosRequestConfig) => {
  return chrome.runtime.sendMessage({ action: "logout", params: { config } });
};
