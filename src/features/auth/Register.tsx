import { Alert, Button, TextField } from "@mui/material";
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
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { QueryStatus } from "@reduxjs/toolkit/dist/query";
import { ValidationError } from "../../contracts/types/core";

type RegisterFormData = {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: DateTime | null;
  password: string;
  confirmPassword: string;
};

function getDefaultData(): RegisterFormData {
  return {
    email: "",
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    password: "",
    confirmPassword: "",
  };
}

export default function Register() {
  function resetErrors() {
    clearErrors();
    setFirstNameErrorText("");
    setLastNameErrorText("");
    setDateOfBirthErrorText("");
    setEmailErrorText("");
    setPasswordErrorText("");
    setConfirmPasswordErrorText("");
    setApiErrorText("");
  }

  const [firstNameErrorText, setFirstNameErrorText] = useState("");
  const [lastNameErrorText, setLastNameErrorText] = useState("");
  const [dateOfBirthErrorText, setDateOfBirthErrorText] = useState("");
  const [emailErrorText, setEmailErrorText] = useState("");
  const [passwordErrorText, setPasswordErrorText] = useState("");
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState("");
  const [apiErrorText, setApiErrorText] = useState("");
  const dispatch = useDispatch();
  const [register, result] = useRegisterMutation();

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: getDefaultData(),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    resetErrors();
    register({
      ...data,
      dateOfBirth: data?.dateOfBirth?.toFormat("yyyy-MM-dd") ?? "",
    });
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
        (result.error.data as Partial<ValidationError<RegisterFormData>>).errors
          ?.length
      ) {
        const { errors } = result.error
          .data as ValidationError<RegisterFormData>;
        for (const error of errors) {
          if (error.field === "password") {
            setPasswordErrorText(error.message);
          } else if (error.field === "firstName") {
            setFirstNameErrorText(error.message);
          } else if (error.field === "lastName") {
            setLastNameErrorText(error.message);
          } else if (error.field === "email") {
            setEmailErrorText(error.message);
          } else if (error.field === "dateOfBirth") {
            setDateOfBirthErrorText(error.message);
          } else if (error.field === "confirmPassword") {
            setConfirmPasswordErrorText(error.message);
          } else {
            setApiErrorText(error.message);
          }
        }
      }
    }
  }, [result, dispatch, reset, clearErrors]);

  let firstNameValidationErrorText = "";
  if (errors?.firstName?.type === "required") {
    firstNameValidationErrorText = "First Name is required";
  } else if (errors?.firstName?.type === "minLength") {
    firstNameValidationErrorText =
      "First Name should have minimum 3 characters";
  } else if (errors?.firstName?.type === "maxLength") {
    firstNameValidationErrorText = "First Name can have maximum 20 characters";
  }

  let lastNameValidationErrorText = "";
  if (errors?.lastName?.type === "required") {
    lastNameValidationErrorText = "Last Name is required";
  } else if (errors?.lastName?.type === "minLength") {
    lastNameValidationErrorText = "Last Name should have minimum 3 characters";
  } else if (errors?.lastName?.type === "maxLength") {
    lastNameValidationErrorText = "Last Name can have maximum 20 characters";
  }

  let dateOfBirthValidationErrorText = "";
  if (errors?.dateOfBirth?.type === "required") {
    dateOfBirthValidationErrorText = "Date of birth is required";
  }

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

  let confirmPasswordValidationErrorText = "";
  if (errors?.confirmPassword?.type === "required") {
    confirmPasswordValidationErrorText = "Password is required";
  } else if (errors?.confirmPassword?.type === "minLength") {
    confirmPasswordValidationErrorText =
      "Password should have minimum 8 characters";
  } else if (errors?.confirmPassword?.type === "maxLength") {
    confirmPasswordValidationErrorText =
      "Password can have maximum 20 characters";
  } else if (errors?.confirmPassword?.type === "validate") {
    confirmPasswordValidationErrorText =
      "Password and Confirm Password should be same";
  }

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <h1>Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: true, minLength: 3, maxLength: 20 }}
            render={({ field: { value, onChange } }) => (
              <TextField
                required
                label="First Name"
                variant="standard"
                value={value}
                onChange={onChange}
                error={
                  firstNameValidationErrorText !== "" ||
                  firstNameErrorText !== ""
                }
                helperText={firstNameValidationErrorText || firstNameErrorText}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            rules={{ required: true, minLength: 3, maxLength: 20 }}
            render={({ field: { value, onChange } }) => (
              <TextField
                required
                label="Last Name"
                variant="standard"
                value={value}
                onChange={onChange}
                error={
                  lastNameValidationErrorText !== "" || lastNameErrorText !== ""
                }
                helperText={lastNameValidationErrorText || lastNameErrorText}
              />
            )}
          />
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <LocalizationProvider
                dateAdapter={AdapterLuxon}
                adapterLocale="en-in"
              >
                <DatePicker
                  label="Date of birth"
                  slots={{ textField: TextField }}
                  onChange={onChange}
                  slotProps={{
                    textField: {
                      value,
                      required: true,
                      variant: "standard",
                      error:
                        dateOfBirthValidationErrorText !== "" ||
                        dateOfBirthErrorText !== "",
                      helperText:
                        dateOfBirthValidationErrorText || dateOfBirthErrorText,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
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
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: true,
              minLength: 8,
              maxLength: 20,
              validate: (_, values) =>
                values.password === values.confirmPassword,
            }}
            render={({ field: { value, onChange } }) => (
              <TextField
                required
                label="Confirm Password"
                type="password"
                variant="standard"
                value={value}
                onChange={onChange}
                error={
                  confirmPasswordValidationErrorText !== "" ||
                  confirmPasswordErrorText !== ""
                }
                helperText={
                  confirmPasswordValidationErrorText || confirmPasswordErrorText
                }
              />
            )}
          />
          <Button
            disabled={result.status === QueryStatus.pending}
            variant="contained"
            type="submit"
          >
            Register
          </Button>
        </form>
        {apiErrorText && (
          <Alert variant="outlined" severity="error">
            {apiErrorText}
          </Alert>
        )}
        <Link to={"/login"}>Already have an account? Click to Login.</Link>
      </div>
    </div>
  );
}
