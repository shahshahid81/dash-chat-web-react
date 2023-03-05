import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import Login from "../features/auth/Login";

export default function Root() {
  const token = useSelector((state: RootState) => state.auth.token);

  if (token) {
    return <h1>Authenticated</h1>;
  }

  return <Login></Login>;
}
