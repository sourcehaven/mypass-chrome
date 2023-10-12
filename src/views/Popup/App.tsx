import { HashRouter as BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, ThemeOptions } from "@mui/material";
import { AnyAction } from "redux";
import { ThemeProvider, createTheme } from "@mui/material";

import { MainPage, LoginPage } from "pages";
import { RootState } from "state";
import { actions } from "state/auth";
import { useConstructor } from "utils";

import "./App.scss";

export const baseTheme: ThemeOptions = {
  palette: {
    primary: {
      main: "#37474f",
    },
    secondary: {
      main: "#f50057",
    },
  },
};

const lightTheme: ThemeOptions = {
  ...baseTheme,
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
    },
    ...baseTheme.palette,
  },
};
const darkTheme: ThemeOptions = {
  ...baseTheme,
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#111518",
    },
    ...baseTheme.palette,
  },
};

const themeSelector = (theme: "light" | "dark") => {
  switch (theme) {
    case "light":
      return createTheme(lightTheme);
    case "dark":
      return createTheme(darkTheme);
  }
};

const App = () => {
  const dispatch = useDispatch();

  useConstructor(() => dispatch(actions.getLogin() as unknown as AnyAction));

  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <ThemeProvider theme={themeSelector(theme)}>
      <BrowserRouter>
        <Box component="main" className="container" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {loggedIn ? (
              <>
                <Route path="/" element={<MainPage />} />
              </>
            ) : (
              <>
                <Route path="/" element={<LoginPage />} />
              </>
            )}
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
