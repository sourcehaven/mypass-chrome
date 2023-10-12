import React from "react";
import { Box, Button, Container, CssBaseline, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { AnyAction } from "redux";

import { actions } from "state/auth/";

export default () => {
  const dispatch = useDispatch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const user = (data.get("user") as string) || "";
    const password = (data.get("password") as string) || "";
    dispatch(actions.login({ username: user, password }) as unknown as AnyAction);
  };

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
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="user"
            label="User or Email"
            name="user"
            autoComplete="user"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} color="inherit">
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
