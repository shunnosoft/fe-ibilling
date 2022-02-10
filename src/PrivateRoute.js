import { Navigate } from "react-router-dom";

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
