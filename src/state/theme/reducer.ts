import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Theme = "light" | "dark";
type State = {
  mode: Theme;
};

const initialState: State = {
  mode: "light",
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleDL: (state) => ({
      ...state,
      mode: state.mode === "light" ? "dark" : "light",
    }),
    setTheme: (state, action: PayloadAction<Theme>) => ({
      ...state,
      mode: action.payload,
    }),
  },
});

export const actions = { ...slice.actions };

export default slice.reducer;
