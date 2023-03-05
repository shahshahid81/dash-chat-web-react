import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./authApi";
import { setToken } from "./authSlice";
import styles from "./Login.module.css";

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
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h1>Login</h1>
        <TextField
          required
          label="Email"
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          label="Password"
          type="password"
          variant="standard"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
}
