import { configure } from "./_config";
import { getLogin, login, logout } from "./auth";
import { selectVaultEntry, selectVaultEntries } from "./vault";

import { console } from "utils";

export { getLogin, login, logout } from "./auth";
export { selectVaultEntry, selectVaultEntries } from "./vault";

export const ACCESS_TOKEN = "authentication:accessToken";
export const REFRESH_TOKEN = "authentication:refreshToken";

let getAccessToken: () => Promise<string | null>;
let getRefreshToken: () => Promise<string | null>;
let setAccessToken: (token: string) => Promise<void>;
let setRefreshToken: (token: string) => Promise<void>;
let removeTokens: () => Promise<void>;
if (process.env.NODE_ENV === "development") {
  console.info("Using browser's localStorage variable.");
  getAccessToken = async () => localStorage.getItem(ACCESS_TOKEN);
  getRefreshToken = async () => localStorage.getItem(REFRESH_TOKEN);
  setAccessToken = async (token: string) => localStorage.setItem(ACCESS_TOKEN, token);
  setRefreshToken = async (token: string) => localStorage.setItem(REFRESH_TOKEN, token);
  removeTokens = async () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
  };
} else if (process.env.NODE_ENV === "production") {
  console.info("Using extension's storage.local variable.");
  getAccessToken = async () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(ACCESS_TOKEN).then((kv) => {
        return resolve(kv[ACCESS_TOKEN]);
      });
    });
  };
  getRefreshToken = async () => {
    return new Promise((resolve) => {
      chrome.storage.local.get(REFRESH_TOKEN).then((kv) => {
        return resolve(kv[REFRESH_TOKEN]);
      });
    });
  };
  setAccessToken = async (token: string) => chrome.storage.local.set({ ACCESS_TOKEN: token });
  setRefreshToken = async (token: string) => chrome.storage.local.set({ REFRESH_TOKEN: token });
  removeTokens = async () => {
    chrome.storage.local.remove([ACCESS_TOKEN, REFRESH_TOKEN]);
  };
} else {
  throw Error("Configuration error occurred. Check your environment variables.");
}
export { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, removeTokens };

export const makeUrl = (baseUrl?: string, port?: number) => baseUrl?.concat((port && `:${port.toString()}`) || "");

export const client = configure();
export default {
  getLogin,
  login,
  logout,
  selectVaultEntry,
  selectVaultEntries,
};
