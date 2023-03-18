import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../app/store";

export default function Root() {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const route = !token
      ? location.pathname === "/register"
        ? "register"
        : "login"
      : "homepage";
    navigate(route);
  }, [token, navigate, location.pathname]);

  return <Outlet></Outlet>;
}
