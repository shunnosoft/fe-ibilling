import { Navigate } from "react-router-dom";

function PrivateRoute({ currentUser, children }) {
  return !currentUser  ? children : <Navigate to="/" />;
}

export default PrivateRoute;
