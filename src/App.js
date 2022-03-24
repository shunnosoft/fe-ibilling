import { useCallback,   useLayoutEffect, useState } from "react";
// external imports
import { ThemeProvider } from "styled-components";
import { themes, GlobalStyles } from "./themes";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/admin/header/Header";
import PrivateRoute from "./PrivateRoute";
import PrivateOutlet from "./PrivateOutlet";
// import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Collector from "./pages/collector/Collector";
import Customer from "./pages/Customer/Customer";
import NotFound from "./pages/NotFound/NotFound";
import Success from "./pages/success/Success";
import Manager from "./pages/manager/Manager";
// import Reseller from "./pages/reseller/Reseller";
import Area from "./pages/area/Area";
import Mikrotik from "./pages/mikrotik/Mikrotik";
import ConfigMikrotik from "./pages/configMikrotik/ConfigMikrotik";
import SubArea from "./pages/subArea/SubArea";
import Profile from "./pages/profile/Profile";
// import Account from "./pages/account/Account";
import Message from "./pages/message/Message";
import Diposit from "./pages/diposit/Diposit";
import Report from "./pages/report/Report";
import { publicRequest} from "./api/apiLink";
import { useDispatch } from "react-redux";
import { updateTokenSuccess } from "./features/authSlice";
import { userLogout } from "./features/actions/authAsyncAction";
import CollectorReport from "./pages/report/CollectorReport";
import { useLocation } from "react-router-dom";

function App() {
  const [theme, setTheme] = useState("light");
  const user = useSelector((state) => state.auth.currentUser);
  const userRole = useSelector((state) => state.auth.role);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const pathName = useLocation().pathname;

  // update token
  const updateToken = useCallback(async () => {
    try {
      const response = await publicRequest.post("v1/auth/refresh-tokens", {
        method: "POST",
      });
      const data = await response?.data;
      dispatch(updateTokenSuccess(data?.access.token));
    } catch (err) {
      userLogout(dispatch);
    }
    if (loading) {
      setLoading(false);
    }
  }, [dispatch, loading]);

  // called Update Token

  useLayoutEffect(() => {
    if (pathName === "/home" && loading) {
      updateToken();
    }

    const timeToUpdate = 1000 * 60 * 12;
    const interval = setInterval(() => {
      if (accessToken !== null) {
        updateToken();
      }
    }, timeToUpdate);
    return () => clearInterval(interval);
  }, [pathName, updateToken, accessToken, loading]);
 
  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyles />
      <div className="App">
        <Header theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/home" />}
          />

          <Route
            path="/register"
            element={
              <PrivateRoute user={!user}>
                <Register />
              </PrivateRoute>
            }
          />

          <Route path="/register/success" element={<Success />} />
          {/* <Route
            path="/bill"
            element={
              (userRole === "manager" && user) ||
              (userRole === "collector" && user) ? (
                <Bill />
              ) : (
                <Navigate to={"/"} />
              )
            }
          /> */}
          <Route
            path="/collector"
            element={
              (userRole === "manager" && user) ||
              (userRole === "ispOwner" && user) ? (
                <Collector />
              ) : (
                <Navigate to={"/"} />
              )
            }
          />

          <Route
            path="manager"
            element={
              userRole === "ispOwner" && user ? (
                <Manager />
              ) : (
                <Navigate to={"/home"} />
              )
            }
          />
          <Route
            path="mikrotik"
            element={
              userRole === "ispOwner" && user ? (
                <Mikrotik />
              ) : (
                <Navigate to={"/home"} />
              )
            }
          />

          {/* dashboard */}
          <Route path="/*" element={<PrivateOutlet />}>
            <Route path="profile" element={<Profile />} />
            <Route
              path="report"
              element={
                userRole === "collector" ? <CollectorReport /> : <Report />
              }
            />
            {/* <Route path="account" element={<Account />} /> */}
            <Route path="message" element={<Message />} />
            <Route path="home" element={<Dashboard />} />
            <Route path="area" element={<Area />} />
            {/* <Route path="bill" element={<Bill />} /> */}
            <Route path="diposit" element={<Diposit />} />
            {/* <Route path="reseller" element={<Reseller />} /> */}
            <Route path="customer" element={<Customer />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route
            path="/subArea/:areaId"
            element={
              <PrivateRoute user={user}>
                <SubArea />
              </PrivateRoute>
            }
          />

          <Route
            path="/mikrotik/:ispOwner/:mikrotikId"
            element={
              <PrivateRoute user={user}>
                <ConfigMikrotik />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
