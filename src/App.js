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
import ResellerMessageLog from "./reseller/messageLog/MessageLog";

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
import ResellerCustomer from "./pages/reseller/resellerCustomer/ResellerCustomer";
import RechargeHistoryofReseller from "./pages/recharge/Recharge";
import Landing from "./pages/public-pages/Landing";
import About from "./pages/public-pages/About";
import Privacy from "./pages/public-pages/Privacy";
import Terms from "./pages/public-pages/Terms";
import Refund from "./pages/public-pages/Refund";

import { getUnpaidInvoice, getUpdatedUserData } from "./features/apiCalls";
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
import RecehargeSMS from "./pages/reseller/smsRecharge/RecehargeSMS";
import StaticCustomer from "./pages/staticCustomer/StaticCustomer";
import PackageSetting from "./pages/staticCustomer/PakageSetting";
import ResellerSmsRequest from "./pages/resellerSMSrequest/ResellerSmsRequest";
import StaticActiveCustomer from "./pages/staticActiveCustomer/StaticActiveCustomer";
import HotspotCustomer from "./pages/hotspot/HotspotCustomer";
import RMessage from "./reseller/message/Message";
import RSettings from "./reseller/settings/Settings";
import RActiveCustomer from "./reseller/activeustomer/ActiveCustomer";
import AllComments from "./admin/allComments/AllComments";
import AllInvoices from "./admin/allInvoices/AllInvoices";
import ActivityLog from "./pages/activityLog/ActivityLog";
import "./language/i18n/i18n";
import RstaticCustomer from "./reseller/staticCustomer/StaticCustomer";

import ClientPage from "./ownerCustomer/index";
import AllResellerCustomer from "./pages/reseller/resellerCustomer/ResellerAllCustomer";
import NewCustomer from "./pages/newCustomer/NewCustomer";
import MessageLog from "./pages/messageLog/MessageLog";
import DueCustomer from "./pages/dueCustomer/DueCustomer";
import SuccessPaymentSuccess from "./ownerCustomer/CustomerPaymentSuccess";
import CustomerSupportTicket from "./pages/supportTicket/SupportTicket";
import Stock from "./pages/Inventory/Stock";
import CollectorSupportTicket from "./pages/supportTicket/CollectorSupportTicket";
import ActiveHotspotCustomer from "./pages/hotspot/activeHotspotCustomer/ActiveHotspotCustomer";
import Setting from "./reseller/setting/Setting";

function App() {
  // const invoice = useSelector(state => state.invoice.invoice);
  const [theme, setTheme] = useState("light");
  const user = useSelector((state) => state.persistedReducer.auth?.currentUser);
  const userRole = useSelector((state) => state.persistedReducer.auth?.role);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // const hasReseller= true
  const isModalShowing = useSelector((state) => state.ui?.alertModalShow);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userRole === "ispOwner" || userRole === "manager")
      getUnpaidInvoice(dispatch, ispOwnerId);
  }, [ispOwnerId, dispatch, userRole]);
  const pathName = useLocation().pathname;

  useEffect(() => {
    if (userRole === "ispOwner") {
      getUpdatedUserData(dispatch, "ispOwner", user?.ispOwner?.id);
    }
    if (userRole === "reseller") {
      getUpdatedUserData(dispatch, "reseller", user?.reseller?.id);
    }
    if (userRole === "manager") {
      getUpdatedUserData(dispatch, "manager", user?.manager?.id);
    }
    if (userRole === "collector") {
      getUpdatedUserData(dispatch, "collector", user?.collector?.id);
    }
  }, []);

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyles />
      <div className="App">
        {isModalShowing && <ReactModal></ReactModal>}
        {pathName === "/login" || pathName === "/register" || user
          ? userRole !== "customer" && (
              <Header theme={theme} setTheme={setTheme} />
            )
          : ""}

        {/* only reseller route */}
        {userRole === "reseller" && (
          <Routes>
            <Route
              path="/netfee"
              element={
                !user ? (
                  <Landing></Landing>
                ) : (
                  <Navigate to={"/reseller/sms-receharge"} />
                )
              }
            />
          </Routes>
        )}
        {/* end only reseller route */}

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
              <Route path="message" element={<RMessage />} />
              <Route path="settings" element={<RSettings />} />
              <Route
                path="reseller/message/log"
                element={<ResellerMessageLog />}
              />
              <Route
                path="reseller/activeCustomer"
                element={<RActiveCustomer />}
              />

              <Route path="reseller/profile" element={<RProfile />} />
              <Route path="reseller/setting" element={<Setting />} />
              <Route path="reseller/home" element={<RDashboard />} />
              <Route path="reseller/collector" element={<RCollector />} />
              <Route path="expenditure" element={<Expenditure />} />
              <Route
                path="reseller/recharge"
                element={<RechargeHistoryofReseller />}
              />

              <Route path="reseller/diposit" element={<RDiposit />} />
              <Route path="reseller/sms-receharge" element={<RecehargeSMS />} />
              <Route path="reseller/customer" element={<RCustomer />} />
              <Route
                path="reseller/staticCustomer"
                element={<RstaticCustomer />}
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        ) : userRole === "admin" || userRole === "superadmin" ? (
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
            <Route
              path="/netfee"
              element={
                !user ? (
                  <Landing></Landing>
                ) : (
                  <Navigate to={"/admin/all-comments"} />
                )
              }
            />
            <Route
              path="/netfee"
              element={
                !user ? (
                  <Landing></Landing>
                ) : (
                  <Navigate to={"/admin/invoices"} />
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
              <Route path="admin/all-comments" element={<AllComments />} />
              <Route path="admin/invoices" element={<AllInvoices />} />

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

            {/* Static Customer  */}
            <Route
              path="/staticCustomer"
              element={
                userRole === "ispOwner" ||
                userRole === "manager" ||
                (userRole === "collector" && !user.collector.reseller) ? (
                  <StaticCustomer />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            <Route
              path="/staticActiveCustomer"
              element={
                userRole === "ispOwner" ||
                userRole === "manager" ||
                userRole === "collector" ? (
                  <StaticActiveCustomer />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            {/* Hotspot Customer  */}
            <Route
              path="/hotspot/customer"
              element={
                userRole === "ispOwner" ? (
                  <HotspotCustomer />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            {/* Hotspot Customer  */}
            <Route
              path="/active/hotspot/customer"
              element={
                userRole === "ispOwner" ? (
                  <ActiveHotspotCustomer />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            <Route
              path="/packageSetting"
              element={
                userRole === "ispOwner" && user ? (
                  <PackageSetting />
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
            <Route
              path="message/log"
              element={
                user &&
                (userRole === "ispOwner" ||
                  (userRole === "manager" && permission?.readMessageLog)) ? (
                  <MessageLog />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />
            <Route
              path="due/customer"
              element={
                user && (userRole === "ispOwner" || userRole === "manager") ? (
                  <DueCustomer />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            <Route
              path="/support/ticket"
              element={
                user ? (
                  userRole === "ispOwner" ? (
                    <CustomerSupportTicket />
                  ) : (
                    userRole === "collector" && <CollectorSupportTicket />
                  )
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
              {/* <Route path="stock" element={<Stock />} /> */}
              <Route path="staff" element={<Staff />} />
              <Route path="staff/:staffId" element={<StaffSalary />} />

              <Route path="settings" element={<Settings />} />
              <Route
                path="home"
                element={
                  userRole !== "customer" ? (
                    <Dashboard />
                  ) : (
                    <Navigate to="/isp/customer" />
                  )
                }
              />
              <Route path="area" element={<Area />} />
              {/* <Route path="bill" element={<Bill />} /> */}
              <Route path="diposit" element={<Diposit />} />

              <Route path="invoice" element={<Invoice />} />
              <Route
                path="recharge"
                element={
                  bpSettings?.hasReseller ? (
                    <RechargeHistoryofReseller />
                  ) : (
                    <Navigate to={"/"}></Navigate>
                  )
                }
              />

              <Route
                path="reseller"
                element={
                  bpSettings?.hasReseller && userRole === "ispOwner" ? (
                    <Reseller />
                  ) : (
                    <Navigate to={"/home"}></Navigate>
                  )
                }
              />
              <Route
                path="reseller/customer/:resellerId"
                element={
                  userRole === "ispOwner" ? (
                    <ResellerCustomer />
                  ) : (
                    <Navigate to={"/home"}></Navigate>
                  )
                }
              />
              <Route
                path="reseller/customer/"
                element={
                  userRole === "ispOwner" ? (
                    <AllResellerCustomer />
                  ) : (
                    <Navigate to={"/home"}></Navigate>
                  )
                }
              />
              <Route path="customer" element={<Customer />} />
              <Route path="activeCustomer" element={<ActiveCustomer />} />
              <Route path="new/customer" element={<NewCustomer />} />
              <Route path="reseller/customer" element={<RCustomer />} />
              <Route path="message-request" element={<ResellerSmsRequest />} />

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
            <Route
              path="/activity"
              element={
                (userRole === "manager" && user) ||
                (userRole === "ispOwner" && user) ? (
                  <ActivityLog />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            {/* client page  */}
            <Route path="/*" element={<PrivateOutlet />}>
              <Route path="isp/customer" element={<ClientPage />} />
            </Route>
          </Routes>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
