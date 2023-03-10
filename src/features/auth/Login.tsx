import { Button, TextField } from "@mui/material";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLoginMutation } from "./authApi";
import { setToken } from "./authSlice";
import styles from "./Login.module.css";

type LoginFormData = {
  email: string;
  password: string;
};

function getDefaultData(): LoginFormData {
  return {
    email: "",
    password: "",
  };
}

export default function Login() {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaultData(),
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => login(data);

  const dispatch = useDispatch();

  const [login, result] = useLoginMutation();

  useEffect(() => {
    if (result.status === "fulfilled") {
      reset(getDefaultData());
      dispatch(setToken(result.data.token));
    }
  }, [result, dispatch]);

  const emailError = Object.keys(errors?.email ?? {}).length > 0;
  const passwordError = Object.keys(errors?.password ?? {}).length > 0;

  function getEmailError() {
    if (!emailError) {
      return "";
    }

    if (errors.email?.type === "required") {
      return "Email is required";
    }

    if (errors.email?.type === "minLength") {
      return "Email should have minimum 3 characters";
    }
  }

  function getPasswordError() {
    if (!passwordError) {
      return "";
    }

    if (errors.password?.type === "required") {
      return "Password is required";
    }

    if (errors.password?.type === "minLength") {
      return "Password should have minimum 8 characters";
    }

    if (errors.password?.type === "maxLength") {
      return "Password can have maximum 20 characters";
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{ required: true, minLength: 3 }}
            render={({ field: { value, onChange } }) => (
              <TextField
                required
                label="Email"
                variant="standard"
                value={value}
                onChange={onChange}
                error={emailError}
                helperText={getEmailError()}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: true, minLength: 8, maxLength: 20 }}
            render={({ field: { value, onChange } }) => (
              <TextField
                required
                label="Password"
                type="password"
                variant="standard"
                value={value}
                onChange={onChange}
                error={passwordError}
                helperText={getPasswordError()}
              />
            )}
          />
          <Button variant="contained" type="submit">
            Login
          </Button>
        </form>
        <Link to={"/register"}>Don't have an account? Register Now.</Link>
      </div>
    </div>
  );
}
