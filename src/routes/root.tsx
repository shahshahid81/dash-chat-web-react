import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { RootState } from "../app/store";

export default function Root() {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    const route = !token ? "login" : "homepage";
    navigate(route);
  }, [token, navigate]);

  return <Outlet></Outlet>;
}
