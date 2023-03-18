import { Button, TextField } from "@mui/material";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { useEffect, useState } from "react";
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

type ValidationError = {
  errors: { field: string; message: string }[];
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
    clearErrors,
  } = useForm({
    defaultValues: getDefaultData(),
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    clearErrors();
    setEmailErrorText("");
    setPasswordErrorText("");
    login(data);
  };

  const dispatch = useDispatch();

  const [login, result] = useLoginMutation();

  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");

  useEffect(() => {
    if (result.status === "fulfilled" && result.data.token) {
      reset(getDefaultData());
      dispatch(setToken(result.data.token));
    } else if (result.status === "rejected") {
      if (
        result.isError &&
        "data" in result.error &&
        (result.error.data as Partial<ValidationError>).errors?.length
      ) {
        clearErrors();
        setEmailErrorText("");
        setPasswordErrorText("");
        const { errors } = result.error.data as ValidationError;
        for (const error of errors) {
          if (error.field === "email") {
            setEmailErrorText(error.message);
            break;
          } else if (error.field === "password") {
            setPasswordErrorText(error.message);
          }
        }
      }
    }
  }, [result, dispatch, reset]);

  const emailError = Object.keys(errors?.email ?? {}).length > 0;
  const passwordError = Object.keys(errors?.password ?? {}).length > 0;

  if (emailError) {
    if (errors.email?.type === "required") {
      emailErrorText !== "Email is required" &&
        setEmailErrorText("Email is required");
    } else if (errors.email?.type === "minLength") {
      emailErrorText !== "Email should have minimum 3 characters" &&
        setEmailErrorText("Email should have minimum 3 characters");
    }
  } else if (
    ["Email is required", "Email should have minimum 3 characters"].includes(
      emailErrorText
    )
  ) {
    setEmailErrorText("");
  }

  if (passwordError) {
    if (errors.password?.type === "required") {
      passwordErrorText !== "Password is required" &&
        setPasswordErrorText("Password is required");
    } else if (errors.password?.type === "minLength") {
      passwordErrorText !== "Password should have minimum 8 characters" &&
        setPasswordErrorText("Password should have minimum 8 characters");
    } else if (errors.password?.type === "maxLength") {
      passwordErrorText !== "Password can have maximum 20 characters" &&
        setPasswordErrorText("Password can have maximum 20 characters");
    }
  } else if (
    [
      "Password is required",
      "Password should have minimum 8 characters",
      "Password can have maximum 20 characters",
    ].includes(passwordErrorText)
  ) {
    setPasswordErrorText("");
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
                error={emailErrorText !== ""}
                helperText={emailErrorText}
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
                error={passwordErrorText !== ""}
                helperText={passwordErrorText}
              />
            )}
          />
          <Button
            disabled={result.status === QueryStatus.pending}
            variant="contained"
            type="submit"
          >
            Login
          </Button>
        </form>
        <Link to={"/register"}>Don't have an account? Register Now.</Link>
      </div>
    </div>
  );
}
