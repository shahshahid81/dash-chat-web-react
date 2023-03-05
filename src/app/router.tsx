import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import Homepage from "../features/homepage/Homepage";
import Root from "../routes/root";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/homepage" element={<Homepage />}></Route>
    </Route>
  )
);
