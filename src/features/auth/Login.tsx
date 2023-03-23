import { Alert, Button, TextField } from "@mui/material";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ValidationError } from "../../contracts/types/core";
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
    clearErrors,
  } = useForm({
    defaultValues: getDefaultData(),
  });

  const resetErrors = useCallback(() => {
    clearErrors();
    setEmailErrorText("");
    setPasswordErrorText("");
    setApiErrorText("");
  }, [clearErrors]);

  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [apiErrorText, setApiErrorText] = useState("");
  const dispatch = useDispatch();
  const [login, result] = useLoginMutation();

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    resetErrors();
    login(data);
  };

  useEffect(() => {
    if ([QueryStatus.fulfilled, QueryStatus.rejected].includes(result.status)) {
      resetErrors();
    }

    if (result.status === QueryStatus.fulfilled && result.data.token) {
      reset(getDefaultData());
      dispatch(setToken(result.data.token));
    } else if (result.status === QueryStatus.rejected) {
      if (
        result.isError &&
        "data" in result.error &&
        (result.error.data as Partial<ValidationError<LoginFormData>>).errors
          ?.length
      ) {
        const { errors } = result.error.data as ValidationError<LoginFormData>;
        for (const error of errors) {
          if (error.field === "email") {
            setEmailErrorText(error.message);
          } else if (error.field === "password") {
            setPasswordErrorText(error.message);
          } else {
            setApiErrorText(error.message);
          }
        }
      }
    }
  }, [result, dispatch, reset, resetErrors]);

  let emailValidationErrorText = "";
  if (errors?.email?.type === "required") {
    emailValidationErrorText = "Email is required";
  } else if (errors?.email?.type === "minLength") {
    emailValidationErrorText = "Email should have minimum 3 characters";
  }

  let passwordValidationErrorText = "";
  if (errors?.password?.type === "required") {
    passwordValidationErrorText = "Password is required";
  } else if (errors?.password?.type === "minLength") {
    passwordValidationErrorText = "Password should have minimum 8 characters";
  } else if (errors?.password?.type === "maxLength") {
    passwordValidationErrorText = "Password can have maximum 20 characters";
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
                error={emailValidationErrorText !== "" || emailErrorText !== ""}
                helperText={emailValidationErrorText || emailErrorText}
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
                error={
                  passwordValidationErrorText !== "" || passwordErrorText !== ""
                }
                helperText={passwordValidationErrorText || passwordErrorText}
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
        {apiErrorText && (
          <Alert variant="outlined" severity="error">
            {apiErrorText}
          </Alert>
        )}
        <Link to={"/register"}>Don't have an account? Register Now.</Link>
      </div>
    </div>
  );
}
