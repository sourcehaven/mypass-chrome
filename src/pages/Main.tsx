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
      <Box>
        <Button onClick={handleLogout} sx={{ mt: 3, mb: 2 }} color="primary">
          Get Me Out of Here!
        </Button>
      </Box>
    </Container>
  );
}
