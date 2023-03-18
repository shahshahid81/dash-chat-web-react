import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Register.module.css";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTime } from "luxon";
import { useRegisterMutation } from "./authApi";
import { setToken } from "./authSlice";
import { useDispatch } from "react-redux";

export default function Register() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<DateTime | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const [register, result] = useRegisterMutation();

  useEffect(() => {
    if (result.status === "fulfilled") {
      dispatch(setToken(result.data.token));
    }
  }, [result, dispatch]);

  function handleRegister() {
    register({
      email,
      password,
      confirmPassword,
      dateOfBirth: dateOfBirth?.toFormat("yyyy-MM-dd") ?? "",
      firstName,
      lastName,
    });
  }

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerForm}>
        <h1>Register</h1>
        <TextField
          required
          label="First Name"
          variant="standard"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          required
          label="Last Name"
          variant="standard"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="en-in">
          <DatePicker
            label="Date of birth"
            slots={{ textField: TextField }}
            onChange={(value) => {
              setDateOfBirth(value as unknown as DateTime);
            }}
            slotProps={{
              textField: {
                value: dateOfBirth,
                required: true,
                variant: "standard",
                helperText: "DD / MM / YYYY",
              },
            }}
          />
        </LocalizationProvider>
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
        <TextField
          required
          label="Confirm Password"
          type="password"
          variant="standard"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleRegister}>
          Register
        </Button>
        <Link to={"/login"}>Already have an account? Click to Login.</Link>
      </div>
    </div>
  );
}
