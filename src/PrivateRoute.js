// import { Navigate } from "react-router-dom";

function PrivateRoute({ auth, children }) {
  return auth ? children : "";
}

export default PrivateRoute;
