import { Navigate } from "react-router-dom";

function PrivateRoute({ auth, children }) {
  return auth ? children : <Navigate to="/" />;
}

export default PrivateRoute;
