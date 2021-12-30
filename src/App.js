import React, { useState, useEffect } from "react";

// external imports
import { ThemeProvider } from "styled-components";
import { themes, GlobalStyles } from "./themes";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";

// internal imports
import { setAuth, setIspOwner } from "./features/authSlice";
import { fetchAsyncManager } from "./features/authSlice";
// import apiLink from "./api/apiLink";

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

function App() {
  const [theme, setTheme] = useState("light");
  const { isAuth } = useSelector((state) => state.auth);

  // const [pageLoading, setpageLoading] = useState(true);
  const dispatch = useDispatch();

  // get data from localstroge
  const token = JSON.parse(localStorage.getItem("token"));

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
            path="/collector"
            element={
              <PrivateRoute auth={isAuth}>
                <Collector />
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
