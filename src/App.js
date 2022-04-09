import { useState } from "react";
// external imports
import { ThemeProvider } from "styled-components";
import { themes, GlobalStyles } from "./themes";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./components/admin/header/Header";
import PrivateRoute from "./PrivateRoute";
import PrivateOutlet from "./PrivateOutlet";

import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";

import Dashboard from "./pages/dashboard/Dashboard";
import Collector from "./pages/collector/Collector";
import Customer from "./pages/Customer/Customer";
import Diposit from "./pages/diposit/Diposit";
import Report from "./pages/report/Report";
import Profile from "./pages/profile/Profile";

//for reseller
import RDashboard from "./reseller/dashboard/Dashboard";
import RCollector from "./reseller/collector/Collector";
import RCustomer from "./reseller/Customer/Customer";
import RDiposit from "./reseller/diposit/Diposit";
import RReport from "./reseller/report/Report";
import RProfile from "./reseller/profile/Profile";
import RCollectorReport from "./reseller/report/CollectorReport";

import NotFound from "./pages/NotFound/NotFound";
import Success from "./pages/success/Success";
import Manager from "./pages/manager/Manager";
// import Reseller from "./pages/reseller/Reseller";
import Area from "./pages/area/Area";
import Mikrotik from "./pages/mikrotik/Mikrotik";
import ConfigMikrotik from "./pages/configMikrotik/ConfigMikrotik";
import SubArea from "./pages/subArea/SubArea";
// import Account from "./pages/account/Account";
import Message from "./pages/message/Message";
import Invoice from "./pages/invoice/Invoice";

import CollectorReport from "./pages/report/CollectorReport";
import Reseller from "./pages/reseller/Reseller";
import RechargeHistoryofReseller from "./pages/recharge/Diposit";
import Landing from "./pages/public-pages/Landing";
import About from "./pages/public-pages/About";
import Privacy from "./pages/public-pages/Privacy";
import Terms from "./pages/public-pages/Terms";
import Refund from "./pages/public-pages/Refund";

import { getUnpaidInvoice } from "./features/apiCalls";
import { useEffect } from "react";
import ReactModal from "./components/modals/reactModal/ReactModal";

function App() {
  // const invoice = useSelector((state) => state.invoice.invoice);
  const [theme, setTheme] = useState("light");
  const user = useSelector((state) => state.auth.currentUser);
  const userRole = useSelector((state) => state.auth.role);
  const ispOwnerId = useSelector((state) => state.auth.ispOwnerId);
  const hasReseller = useSelector(
    (state) => state.auth.userData?.bpSettings?.hasReseller
  );
  // const hasReseller= true
  const isModalShowing= useSelector(state=>state.ui.alertModalShow)
  const dispatch = useDispatch();

  useEffect(() => {
    getUnpaidInvoice(dispatch, ispOwnerId);
  }, [ispOwnerId, dispatch]);
  const pathName = useLocation().pathname;
  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyles />
      <div className="App">
       {isModalShowing && <ReactModal></ReactModal>}
       {( pathName==="/login" || pathName==="/register" || user)? <Header theme={theme} setTheme={setTheme} />:""}
        {userRole === "reseller" ||
        (userRole === "collector" && user.collector.reseller) ? (
          //for reseller
          <Routes>
            <Route path="/" element={<Navigate to="/netfee" />} />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to={"/reseller/home"} />}
            />
            <Route
              path="/netfee"
              element={!user ? <Landing></Landing> : <Navigate to={"/reseller/home"} />}
            />

            <Route
              path="/reseller/report"
              element={
                userRole === "collector" ? <RCollectorReport /> : <RReport />
              }
            />

            {/* dashboard */}
            <Route path="/*" element={<PrivateOutlet />}>
              <Route path="reseller/profile" element={<RProfile />} />
              <Route path="reseller/home" element={<RDashboard />} />
              <Route path="reseller/collector" element={<RCollector />} />
              <Route
                path="reseller/recharge"
                element={<RechargeHistoryofReseller />}
              />

              <Route path="reseller/diposit" element={<RDiposit />} />
              <Route path="reseller/customer" element={<RCustomer />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        ) : (
          //NOt for reseller

          <Routes>
            <Route path="/" element={<Navigate to="/netfee" />} />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to={"/home"} />}
            />
            <Route
              path="/netfee"
              element={!user ? <Landing></Landing> : <Navigate to={"/home"} />}
            />
            <Route
              path="/about"
              element={!user ? <About></About> : <Navigate to={"/home"} />}
            />
            <Route
              path="/privacy-policy"
              element={!user ? <Privacy></Privacy> : <Navigate to={"/home"} />}
            />
            <Route
              path="/terms-conditions"
              element={!user ? <Terms></Terms> : <Navigate to={"/home"} />}
            />
            <Route
              path="/return-and-refund-policy"
              element={!user ? <Refund></Refund> : <Navigate to={"/home"} />}
            />

            <Route
              path="/register"
              element={
                <PrivateRoute user={!user}>
                  <Register />
                </PrivateRoute>
              }
            />

            <Route path="/payment/success" element={<Success />} />
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
              <Route path="invoice" element={<Invoice />} />
              <Route path="recharge" element={<RechargeHistoryofReseller />} />

              <Route
                path="reseller"
                element={
                  hasReseller ? (
                    <Reseller />
                  ) : (
                    <Navigate to={"/home"}></Navigate>
                  )
                }
              />
              <Route path="customer" element={<Customer />} />
              <Route path="reseller/customer" element={<RCustomer />} />

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
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
