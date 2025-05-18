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
import Execute from "./pages/execute/Execute";
import Success from "./pages/success/Success";
import Manager from "./pages/manager/Manager";
import Area from "./pages/area/Area";
import Mikrotik from "./pages/mikrotik/Mikrotik";
import ConfigMikrotik from "./pages/configMikrotik/ConfigMikrotik";
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

import {
  getIspOwnerStatus,
  getUnpaidInvoice,
  getUpdatedUserData,
} from "./features/apiCalls";
import { useEffect } from "react";
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
import MessageLog from "./pages/messageLog/MessageLog";
import CustomerSupportTicket from "./pages/supportTicket/SupportTicket";
import CollectorSupportTicket from "./pages/supportTicket/CollectorSupportTicket";
import ActiveHotspotCustomer from "./pages/hotspot/activeHotspotCustomer/ActiveHotspotCustomer";
import Summary from "./reseller/summary/Summary";
import { getUserApi } from "./features/actions/authAsyncAction";
import ResellerSummary from "./pages/reseller/resellerSummary/ResellerSummary";
import OnlinePaymentCustomer from "./pages/reseller/onlinePaymentCustomer/OnlinePayment";
import ResellerCustomerSupportTicket from "./reseller/supportTicket/SupportTicket";
import ResellerCollectorCustomerSupportTicket from "./reseller/supportTicket/CollectorSupportTicket";
import ResellerNetFeeSupport from "./reseller/netFeeSupport/NetFeeSupport";
import NetFeeSupport from "./pages/netFeeSupport/NetFeeSupport";
import Supports from "./admin/netFeeSupport/Supports";
import NetFeeIspOwnerSupport from "./admin/netFeeSupport/NetFeeIspOwnerSupport";
import QRCodePay from "./pages/public-pages/QRCodePay";
import ActiveStaticCustomer from "./reseller/activeStaticCustomer/ActiveStaticCustomer";
import ResellerCollection from "./pages/reseller/resellerCollection/ResellerCollection";
import SupportNumbers from "./pages/netFeeSupport/SupportNumbers";
import PoleBox from "./pages/subArea/PoleBox";
import MikrotikCustomer from "./pages/configMikrotik/mikrotikCustomer/Customers";
import PackageChange from "./pages/netFeeSupport/PackageChange";
import ChangePackage from "./reseller/customerPackageChange/ChangePackage";
import CustomerInvoice from "./pages/customerInvoice/CustomerInvoice";
import BillReport from "./pages/collector/BillReport";
import NetFeeSupportNumbers from "./admin/Home/supportNumber/NetFeeSupportNumbers";
import Bulletin from "./admin/Home/bulletin/Bulletin";
import WithdrawalPaymentRequest from "./pages/withdrawalRequest/WithdrawalPaymentRequest";
import OtherCustomer from "./pages/otherCustomer/OtherCustomer";
import ManagerDeposit from "./pages/diposit/ManagerDeposit";
import CollectorDeposit from "./pages/diposit/CollectorDeposit";
import SupportCall from "./pages/netFeeSupport/supportOpration/SupportCall";
import MobilePayment from "./pages/public-pages/MobilePayment/MobilePayment";
import QrCodeHotspotCustomer from "./pages/public-pages/hotspotCoustomerQRCode/QrCodeHotspotCustomer";
import RechargeHistory from "./reseller/rechargeHistory/RechargeHistory";
import AcountWorning from "./components/modals/error/AcountWorning";
import WebhookMessage from "./pages/report/WebhookMessage";
import AcountPayment from "./components/modals/payment/AcountPayment";
import Tutorial from "./pages/tutorial/Tutorial";
import Diagram from "./pages/network/diagram/Diagram";
import Device from "./pages/network/device/Device";
import UserActivityLog from "./pages/activityLog/UserActivityLog";
import OLT from "./pages/olt/OLT";

function App() {
  const [theme, setTheme] = useState("light");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.persistedReducer.auth?.currentUser);

  const userRole = useSelector((state) => state.persistedReducer.auth?.role);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get user permission
  const permissions = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  useEffect(() => {
    if (
      userRole === "ispOwner" ||
      userRole === "manager" ||
      userRole === "collector" ||
      userRole === "reseller"
    ) {
      // getUnpaidInvoice(dispatch, ispOwnerId);
      getIspOwnerStatus(dispatch, ispOwnerId);
    }
  }, [ispOwnerId, userRole]);
  const pathName = useLocation().pathname;

  useEffect(() => {
    const userId = user?.user?.id;

    if (userId) {
      getUserApi(dispatch, userId);
    }

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
        {pathName === "/login" || pathName === "/register" || user
          ? userRole !== "customer" && (
              <Header theme={theme} setTheme={setTheme} />
            )
          : ""}

        {/* global routes */}

        {(userRole === "ispOwner" ||
          userRole === "manager" ||
          userRole === "reseller" ||
          userRole === "collector") && (
          <Routes>
            {/* others customer  */}
            <Route path="/other/customer" element={<OtherCustomer />} />

            {/* acount forbidden */}
            <Route path="/acountSuspend" element={<AcountWorning />} />

            {/* ispOwoner invoice payment */}
            <Route path="/payment" element={<AcountPayment />} />

            {/* netFee tutorial */}
            <Route path="/netFee/tutorial" element={<Tutorial />} />

            <Route path="/activity" element={<ActivityLog />} />

            <Route path="/activity/:userId" element={<UserActivityLog />} />
          </Routes>
        )}

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

              {/* others customer  */}
              {/* <Route
                path="/other/customer"
                element={
                  userRole === "reseller" ||
                  (userRole === "collector" && user.reseller.collector) ? (
                    <OtherCustomer />
                  ) : (
                    <Navigate to={"/"} />
                  )
                }
              /> */}

              <Route path="reseller/profile" element={<RProfile />} />
              <Route path="reseller/summary" element={<Summary />} />
              <Route path="reseller/home" element={<RDashboard />} />
              <Route path="reseller/collector" element={<RCollector />} />
              <Route path="expenditure" element={<Expenditure />} />
              <Route
                path="reseller/recharge"
                element={<RechargeHistoryofReseller />}
              />
              <Route
                path="reseller/recharge-history"
                element={<RechargeHistory />}
              />

              <Route path="reseller/diposit" element={<RDiposit />} />
              <Route path="reseller/sms-receharge" element={<RecehargeSMS />} />
              <Route path="reseller/customer" element={<RCustomer />} />
              <Route
                path="reseller/staticCustomer"
                element={<RstaticCustomer />}
              />
              <Route
                path="reseller/staticActiveCustomer"
                element={
                  (userRole === "reseller" ||
                    (userRole === "collector" && user.collector.reseller)) && (
                    <ActiveStaticCustomer />
                  )
                }
              />
              <Route
                path="reseller/support/ticket"
                element={
                  userRole === "reseller" ? (
                    <ResellerCustomerSupportTicket />
                  ) : (
                    userRole === "collector" &&
                    user.collector?.reseller && (
                      <ResellerCollectorCustomerSupportTicket />
                    )
                  )
                }
              />
              <Route
                path="reseller/netFee/support"
                element={userRole === "reseller" && <ResellerNetFeeSupport />}
              />

              <Route
                path="reseller/customer/package/changes"
                element={userRole === "reseller" && <ChangePackage />}
              />

              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="/payment/execute" element={<Execute />} />
            <Route path="/payment/success" element={<Success />} />
            <Route path="/payment/cancel" element={<Cancel />} />
            <Route path="/payment/failed" element={<Failed />} />
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

            <Route
              path="/netfee"
              element={!user ? <Landing /> : <Navigate to={"/admin/support"} />}
            />

            <Route
              path="/netfee"
              element={
                !user ? <Landing /> : <Navigate to={"/admin/netFee/bulletin"} />
              }
            />

            <Route
              path="/netfee"
              element={
                !user ? <Landing /> : <Navigate to={"/admin/netFee/numbers"} />
              }
            />

            <Route
              path="/netfee"
              element={
                !user ? (
                  <Landing />
                ) : (
                  <Navigate to={"/admin/netFee/support/:ispOwnerId"} />
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
              <Route path="admin/support" element={<Supports />} />
              <Route path="admin/netFee/bulletin" element={<Bulletin />} />
              <Route
                path="admin/netFee/numbers"
                element={<NetFeeSupportNumbers />}
              />
              <Route
                path="admin/netFee/support/:ispOwnerId"
                element={<NetFeeIspOwnerSupport />}
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
            <Route path="/isp/:ispId" element={<QRCodePay />} />
            <Route path="/bkash-payment" element={<MobilePayment />} />
            <Route
              path="/isp/hotspot/:ispId"
              element={<QrCodeHotspotCustomer />}
            />
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

            <Route path="/payment/execute" element={<Execute />} />
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
              path="/collector/billReport/:id"
              element={
                (userRole === "manager" && user) ||
                (userRole === "ispOwner" && user) ? (
                  <BillReport />
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
                userRole === "ispOwner" ||
                userRole === "manager" ||
                (userRole === "collector" && user.collector.ispOwner) ? (
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

            {/* others customer  */}
            {/* <Route
              path="/other/customer"
              element={
                userRole === "ispOwner" ||
                userRole === "manager" ||
                (userRole === "collector" && !user.reseller.collector ? (
                  <OtherCustomer />
                ) : (
                  <Navigate to={"/"} />
                ))
              }
            /> */}

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

            {/* OLT Route */}
            <Route
              path="olt"
              element={user ? <OLT /> : <Navigate to={"/home"} />}
            />

            {/* network diagram */}
            <Route
              path="network/device"
              element={
                (userRole === "ispOwner" || userRole === "manager") && user ? (
                  <Device />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            <Route
              path="/network/diagram"
              element={
                (userRole === "ispOwner" || userRole === "manager") && user ? (
                  <Diagram />
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
                  (userRole === "manager" && permissions?.readMessageLog)) ? (
                  <MessageLog />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            <Route
              path="customer/invoice"
              element={
                user &&
                ((userRole === "ispOwner" && bpSettings?.customerInvoice) ||
                  (userRole === "manager" && permissions?.customerInvoice)) ? (
                  <CustomerInvoice />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            <Route
              path="/support/ticket"
              element={
                user ? (
                  userRole === "ispOwner" || userRole === "manager" ? (
                    <CustomerSupportTicket />
                  ) : (
                    userRole === "collector" && <CollectorSupportTicket />
                  )
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />
            <Route
              path="/netFee/support"
              element={
                user && (userRole === "ispOwner" || userRole === "manager") ? (
                  <NetFeeSupport />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            <Route
              path="/netFee/support/numbers"
              element={
                user &&
                (userRole === "ispOwner" ||
                  userRole === "manager" ||
                  userRole === "reseller") ? (
                  <SupportCall />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            <Route
              path="/netFee/supportNumber"
              element={
                user &&
                (userRole === "ispOwner" ||
                  userRole === "manager" ||
                  userRole === "collector") ? (
                  <SupportNumbers />
                ) : (
                  <Navigate to={"/home"} />
                )
              }
            />

            <Route
              path="/netFee/packageChange"
              element={
                user && userRole === "ispOwner" ? (
                  <PackageChange />
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
              <Route
                path="reseller/collection/report"
                element={userRole === "ispOwner" && <ResellerCollection />}
              />

              <Route path="webhook/message" element={<WebhookMessage />} />

              {/* <Route path="account" element={<Account />} /> */}
              <Route path="message" element={<Message />} />
              <Route path="expenditure" element={<Expenditure />} />
              {/* <Route path="stock" element={<Stock />} /> */}
              <Route
                path="staff"
                element={
                  userRole === "ispOwner" || permissions?.staffSalary ? (
                    <Staff />
                  ) : (
                    <Navigate to={"/home"} />
                  )
                }
              />
              <Route
                path="staff/:staffId"
                element={
                  userRole === "ispOwner" || permissions?.staffSalary ? (
                    <StaffSalary />
                  ) : (
                    <Navigate to={"/home"} />
                  )
                }
              />

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
              <Route
                path="deposit"
                element={
                  userRole === "ispOwner" ? (
                    <Diposit />
                  ) : userRole === "manager" ? (
                    <ManagerDeposit />
                  ) : (
                    <CollectorDeposit />
                  )
                }
              />

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
                path="reseller/summary/:resellerId"
                element={
                  userRole === "ispOwner" ? (
                    <ResellerSummary />
                  ) : (
                    <Navigate to={"/home"}></Navigate>
                  )
                }
              />
              <Route
                path="reseller/online-payment-customer/:resellerId"
                element={
                  userRole === "ispOwner" ? (
                    <OnlinePaymentCustomer />
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
              <Route path="reseller/customer" element={<RCustomer />} />
              <Route path="message-request" element={<ResellerSmsRequest />} />
              <Route
                path="withdrawal-request"
                element={<WithdrawalPaymentRequest />}
              />

              <Route path="*" element={<NotFound />} />
            </Route>

            <Route
              path="/poleBox/:subAreaId"
              element={
                <PrivateRoute user={user}>
                  <PoleBox />
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
              path="/mikrotik/customer/:ispOwnerId/:mikrotikId"
              element={
                bpSettings?.hasMikrotik ? (
                  <PrivateRoute user={user}>
                    <MikrotikCustomer />
                  </PrivateRoute>
                ) : (
                  <Navigate to={"/home"} />
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
