import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth";
import optionsReducer from "./opt";
import themeReducer from "./theme";
import storage from "redux-persist/lib/storage";
import {
  PersistConfig,
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

const combinedReducer = combineReducers({
  auth: authReducer,
  options: optionsReducer,
  theme: themeReducer,
});

export type RootState = ReturnType<typeof combinedReducer>;

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  whitelist: ["auth", "theme", "options"],
};

const persistedReducer = persistReducer(persistConfig, combinedReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  enhancers: [],
});

export const persistor = persistStore(store);
// persistor.purge();

export default store;
