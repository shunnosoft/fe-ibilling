import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export default function PrivateOutlet() {
  const  currentUser  = useSelector((state) => state.auth.currentUser);
  return  currentUser ? <Outlet /> : "";
}

