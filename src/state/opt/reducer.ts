import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type State = {
  baseUrl?: string;
  port?: number;
};

const devEnv = process.env.NODE_ENV === "development";
const initialState: State = {
  baseUrl: devEnv ? undefined : "http://127.0.0.1",
  port: devEnv ? undefined : 5757,
};

const slice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setBaseUrl: (state, action: PayloadAction<string>) => ({
      ...state,
      baseUrl: action.payload,
    }),
    setPort: (state, action: PayloadAction<number>) => ({
      ...state,
      port: action.payload,
    }),
  },
});

export const actions = { ...slice.actions };

export default slice.reducer;
