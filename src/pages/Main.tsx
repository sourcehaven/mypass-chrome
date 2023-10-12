import { Box, Button, Container, CssBaseline } from "@mui/material";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";

import { actions } from "state/auth";

export default () => {
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(actions.logout() as unknown as AnyAction);

  return (
    <Container component="div" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button onClick={handleLogout} sx={{ mt: 3, mb: 2 }} variant="contained" color="inherit">
          Get Me Out of Here!
        </Button>
      </Box>
    </Container>
  );
}
