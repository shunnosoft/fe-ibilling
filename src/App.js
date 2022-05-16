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
import ActiveCustomer from "./pages/activeustomer/ActiveCustomer";
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

// for admin
import AdminDashboard from "./admin/dashboard/AdminDashboard";

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
import Cancel from "./pages/success copy/Success";
import Failed from "./pages/success copy 2/Success";
import Package from "./pages/package/Package";
import Settings from "./pages/settings/Settings";
import Expenditure from "./pages/expenditure/Expenditure";
import Staff from "./pages/staff/Staff";
import StaffSalary from "./pages/staff/Salary/StaffSalary";
import InvoiceList from "./admin/invoiceList/InvoiceList";

function App() {
  // const invoice = useSelector(state => state.invoice.invoice);
  const [theme, setTheme] = useState("light");
  const user = useSelector((state) => state.persistedReducer.auth.currentUser);
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth.userData?.bpSettings
  );
  // const hasReseller= true
  const isModalShowing = useSelector((state) => state.ui.alertModalShow);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userRole === "ispOwner") getUnpaidInvoice(dispatch, ispOwnerId);
  }, [ispOwnerId, dispatch, userRole]);
  const pathName = useLocation().pathname;
  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyles />
      <div className="App">
        {isModalShowing && <ReactModal></ReactModal>}
        {pathName === "/login" || pathName === "/register" || user ? (
          <Header theme={theme} setTheme={setTheme} />
        ) : (
          ""
        )}

        {/* for reseller route */}
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
              element={
                !user ? <Landing></Landing> : <Navigate to={"/reseller/home"} />
              }
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
              <Route path="expenditure" element={<Expenditure />} />
              <Route
                path="reseller/recharge"
                element={<RechargeHistoryofReseller />}
              />

              <Route path="reseller/diposit" element={<RDiposit />} />
              <Route path="reseller/customer" element={<RCustomer />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        ) : userRole === "admin" ? (
          <Routes>
            <Route path="/" element={<Navigate to="/netfee" />} />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to={"/admin/home"} />}
            />
            <Route
              path="/netfee"
              element={
                !user ? <Landing></Landing> : <Navigate to={"/admin/home"} />
              }
            />
            <Route
              path="/netfee"
              element={
                !user ? (
                  <Landing></Landing>
                ) : (
                  <Navigate to={"/admin/isp-owner/invoice-list/:ispOwnerId"} />
                )
              }
            />
            {/* <Route path="staff/:staffId" element={<StaffSalary />} /> */}

            <Route path="/*" element={<PrivateOutlet />}>
              <Route path="admin/home" element={<AdminDashboard />} />
              <Route
                path="admin/isp-owner/invoice-list/:ispOwnerId"
                element={<InvoiceList />}
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        ) : (
          //NOt for reseller routes

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
            <Route path="/privacy-policy" element={<Privacy></Privacy>} />
            <Route path="/terms-conditions" element={<Terms></Terms>} />
            <Route
              path="/return-and-refund-policy"
              element={<Refund></Refund>}
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
            <Route path="/payment/cancel" element={<Cancel />} />
            <Route path="/payment/failed" element={<Failed />} />
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
                userRole === "ispOwner" && user && bpSettings?.hasMikrotik ? (
                  <Mikrotik />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />
            <Route
              path="package"
              element={
                user &&
                !bpSettings?.hasMikrotik &&
                (userRole === "ispOwner" || userRole === "manager") ? (
                  <Package />
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
              <Route path="expenditure" element={<Expenditure />} />
              <Route path="staff" element={<Staff />} />
              <Route path="staff/:staffId" element={<StaffSalary />} />

              <Route path="settings" element={<Settings />} />
              <Route path="home" element={<Dashboard />} />
              <Route path="area" element={<Area />} />
              {/* <Route path="bill" element={<Bill />} /> */}
              <Route path="diposit" element={<Diposit />} />
              <Route path="invoice" element={<Invoice />} />
              <Route
                path="recharge"
                element={
                  bpSettings?.hasReseller && bpSettings?.hasMikrotik ? (
                    <RechargeHistoryofReseller />
                  ) : (
                    <Navigate to={"/"}></Navigate>
                  )
                }
              />

              <Route
                path="reseller"
                element={
                  bpSettings?.hasReseller &&
                  bpSettings?.hasMikrotik &&
                  userRole === "ispOwner" ? (
                    <Reseller />
                  ) : (
                    <Navigate to={"/home"}></Navigate>
                  )
                }
              />
              <Route path="customer" element={<Customer />} />
              <Route path="activeCustomer" element={<ActiveCustomer />} />
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
                bpSettings?.hasMikrotik ? (
                  <PrivateRoute user={user}>
                    <ConfigMikrotik />
                  </PrivateRoute>
                ) : (
                  <Navigate to={"/home"}></Navigate>
                )
              }
            />
          </Routes>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
