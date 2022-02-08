import React, { useState, useEffect } from "react";

// external imports
import { ThemeProvider } from "styled-components";
import { themes, GlobalStyles } from "./themes";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

 

// internal pages
import Header from "./components/admin/header/Header";
import PrivateRoute from "./PrivateRoute";
import PrivateOutlet from "./PrivateOutlet";
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
import ConfigMikrotik from "./pages/configMikrotik/ConfigMikrotik";
import SubArea from "./pages/subArea/SubArea";

function App() {
  const [theme, setTheme] = useState("light");

  const currentUser = useSelector((state) => state.auth.currentUser);

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
              <PrivateRoute currentUser={currentUser}>
                <Login />
              </PrivateRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PrivateRoute currentUser={currentUser}>
                <Register />
              </PrivateRoute>
            }
          />

          <Route path="/register/success" element={<Success />} />

          {/* dashboard */}
          <Route path="/*" element={<PrivateOutlet />}>
            <Route path="home" element={<Dashboard />} />
            <Route path="area" element={<Area />} />
            <Route path="manager" element={<Manager />} />
            <Route path="reseller" element={<Reseller />} />
            <Route path="customer" element={<Customer />} />
            <Route path="lineman" element={<Lineman />} />
            <Route path="collector" element={<Collector />} />
            <Route path="mikrotik" element={<Mikrotik />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route
            path="/subArea/:areaId"
            element={
              <PrivateRoute currentUser={currentUser}>
                <SubArea />
              </PrivateRoute>
            }
          />

          <Route
            path="/mikrotik/:ispOwner/:mikrotikId"
            element={
              <PrivateRoute currentUser={currentUser}>
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
