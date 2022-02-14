import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateOutlet() {
  const  user = useSelector((state) => state.auth.currentUser);
   
  return user ? <Outlet /> : <Navigate to="/login"/> ;
}
