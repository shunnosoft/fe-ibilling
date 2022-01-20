import React, { useState, useEffect, useCallback } from "react";

// external imports
import { ThemeProvider } from "styled-components";
import { themes, GlobalStyles } from "./themes";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";

// internal imports
import { setAuth, setIspOwner } from "./features/authSlice";
import { fetchAsyncManager } from "./features/authSlice";
import apiLink from "./api/apiLink";

// internal pages
import Header from "./components/admin/header/Header";
import PrivateRoute from "./PrivateRoute";
import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Collector from "./pages/collector/Collector";
import Customer from "./pages/Customer/Customer";
import NotFound from "./pages/NotFound/NotFound";
import Success from "./pages/success/Success";
import Manager from "./pages/manager/Manager";
import Lineman from "./pages/lineman/Lineman";
import Reseller from "./pages/reseller/Reseller";
import Area from "./pages/area/Area";
import Mikrotik from "./pages/mikrotik/Mikrotik";

function App() {
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const { isAuth } = useSelector((state) => state.auth);

  // const [pageLoading, setpageLoading] = useState(true);
  const dispatch = useDispatch();

  // get data from localstroge
  const token = JSON.parse(localStorage.getItem("token"));

  // update token
  const updateToken = useCallback(async () => {
    try {
      const response = await apiLink("v1/auth/refresh-tokens", {
        method: "POST",
      });
      if (response.status === 200) {
        console.log("We got the Token: ", response);
        // set new token to localstorage
      } else {
        console.log("Should Logout!");
        // call logout method here
      }
    } catch (err) {
      console.log("Should Logout!");
      // call logout method here
    }
    if (loading) {
      setLoading(false);
    }
  }, [loading]);

  // called Update Token
  useEffect(() => {
    if (loading) {
      updateToken();
    }
    const token = JSON.parse(localStorage.getItem("token"));
    const timeToUpdate = 1000 * 60 * 9;
    const interval = setInterval(() => {
      if (token) {
        updateToken();
      }
    }, timeToUpdate);
    return () => clearInterval(interval);
  }, [loading, updateToken]);

  useEffect(() => {
    if (token) {
      const decodeed = jwtDecode(token.token);
      if (decodeed.type === "access") {
        dispatch(setAuth(true));
      }
    } else {
      console.log("There is no valid token");
      dispatch(setAuth(false));
    }
  }, [dispatch, token]);

  useEffect(() => {
    function managerHandle() {
      const ispWoner = JSON.parse(localStorage.getItem("ispWoner"));
      if (ispWoner) {
        dispatch(setIspOwner(ispWoner));
        dispatch(fetchAsyncManager(ispWoner.id));
      }
    }
    managerHandle();
  }, [dispatch]);

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyles />
      <div className="App">
        <Header theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PrivateRoute auth={!isAuth}>
                <Login />
              </PrivateRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PrivateRoute auth={!isAuth}>
                <Register />
              </PrivateRoute>
            }
          />

          <Route path="/register/success" element={<Success />} />

          <Route
            path="/customer"
            element={
              <PrivateRoute auth={isAuth}>
                <Customer />
              </PrivateRoute>
            }
          />

          <Route
            path="/lineman"
            element={
              <PrivateRoute auth={isAuth}>
                <Lineman />
              </PrivateRoute>
            }
          />

          <Route
            path="/home"
            element={
              <PrivateRoute auth={isAuth}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/manager"
            element={
              <PrivateRoute auth={isAuth}>
                <Manager />
              </PrivateRoute>
            }
          />

          <Route
            path="/reseller"
            element={
              <PrivateRoute auth={isAuth}>
                <Reseller />
              </PrivateRoute>
            }
          />

          <Route
            path="/area"
            element={
              <PrivateRoute auth={isAuth}>
                <Area />
              </PrivateRoute>
            }
          />

          <Route
            path="/collector"
            element={
              <PrivateRoute auth={isAuth}>
                <Collector />
              </PrivateRoute>
            }
          />
          <Route
            path="/mikrotik"
            element={
              <PrivateRoute auth={isAuth}>
                <Mikrotik />
              </PrivateRoute>
            }
          />

          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
