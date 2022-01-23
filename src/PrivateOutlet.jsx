import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export default function PrivateOutlet() {
  const { isAuth } = useSelector((state) => state.auth);
  return isAuth ? <Outlet /> : "";
}
