import axios, { InternalAxiosRequestConfig } from "axios";
import { camelize, underscore } from "inflection";

import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, removeTokens } from ".";

const traverse = (o: any, func: Function) => {
  for (const i in o) {
    func.apply(this, [i, o[i], o]);
    if (o[i] != null && typeof o[i] === "object") {
      traverse(o[i], func);
    }
  }
};

// globally configuring axios
export const configure = () => {
  const client = axios.create();

  // default header configs
  client.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

  // request interceptor for configuring authorization headers
  client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (config?.validateStatus) {
      if (config.url && config.url === "/api/auth/login") {
        const refreshToken = await getRefreshToken();
        config.headers.Authorization = `Bearer ${refreshToken}`;
        return config;
      } else if (config.url && config.url === "/api/auth/refresh") {
        const refreshToken = await getRefreshToken();
        config.headers.Authorization = `Bearer ${refreshToken}`;
        return config;
      }
      const accessToken = await getAccessToken();
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  // camelCase to snake_case converter interceptor (backend api uses snake_case)
  client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const transform = (key: any, value: any, o: any) => {
      if (typeof key === "string") {
        const underscoredKey = underscore(key);
        o[underscoredKey] = value;
        if (underscoredKey !== key) {
          delete o[key];
        }
      } else {
        o[key] = value;
      }
    };

    if (config?.validateStatus) {
      const data = config.data;
      traverse(data, transform);
    }
    return config;
  });

  // snake_case to camelCase converter interceptor (backend api uses snake_case)
  client.interceptors.response.use(
    async (response) => {
      const transform = (key: any, value: any, o: any) => {
        if (typeof key === "string") {
          const camelizedKey = camelize(key, true);
          o[camelizedKey] = value;
          if (camelizedKey !== key) {
            delete o[key];
          }
        } else {
          o[key] = value;
        }
      };

      if (response.config?.validateStatus) {
        const data = response.data;
        traverse(data, transform);
      }
      return response;
    },
    // interceptor for requesting new access tokens, if expired
    async (error) => {
      const originalRequest = error.config;
      if (originalRequest?.validateStatus) {
        if (
          (error.response?.status === 401 || error.response?.status === 422) &&
          originalRequest.url === "/api/auth/refresh"
        ) {
          console.log("Login to continue using the api.");
          await removeTokens();
          return Promise.reject(error);
        }
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          console.log("Requesting new non-fresh access token.");
          const response = await client.post("/api/auth/refresh");
          if (!response) return Promise.reject(error);
          const { accessToken, refreshToken } = response.data as any;
          await setAccessToken(accessToken);
          await setRefreshToken(refreshToken);
          // originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          if (originalRequest?.data != null) {
            try {
              originalRequest.data = JSON.parse(originalRequest.data);
            } catch (_e) {}
          }
          const resp = await client(originalRequest);
          return resp;
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};
