import { Button, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./authApi";
import { setToken } from "./authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const [login, result] = useLoginMutation();

  useEffect(() => {
    if (result.status === "fulfilled") {
      dispatch(setToken(result.data.token));
    }
  }, [result, dispatch]);

  function handleLogin() {
    login({ email, password });
  }

  return (
    <Grid container columns={12}>
      <Grid item xs={12}>
        <h1>Login</h1>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          label="email"
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          label="password"
          type="password"
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Grid>
    </Grid>
  );
}
