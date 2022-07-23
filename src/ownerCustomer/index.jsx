import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  BarChart,
  CurrencyDollar,
  PersonFill,
  Question,
  GearFill,
  KeyFill,
} from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { userLogout } from "../features/actions/authAsyncAction";
import "./client.css";
import ClientProfile from "./ClientProfile";
import Packages from "./packages";
import PasswordReset from "./PasswordReset";
import PaymentHistory from "./PaymentHistory";
import SupportTicket from "./SupportTicket";

const Client = () => {
  const [renderText, setRenderText] = useState("profile");
  const dispatch = useDispatch();

  // logout
  const handleLogOut = async () => {
    userLogout(dispatch);
  };

  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser.customer
  );

  useEffect(() => {
    const rText = localStorage.getItem("nf:textR"); //render page from local storage
    if (rText) setRenderText(rText);
  }, []);

  const renderPageController = (text) => {
    localStorage.setItem("nf:textR", text); //set page in local storage
    setRenderText(text);
  };

  const [isMenuOpen, setMenuOpen] = useState(false);
  return (
    <section className="client_section">
      <ToastContainer />
      <div className="client_wraper">
        <div
          className={`settings_wraper ${
            isMenuOpen ? "show-menu" : "hide-menu"
          }`}
        >
          <ul className="client_service_list ps-0">
            <li
              className={renderText === "profile" && "pageActive"}
              onClick={() => renderPageController("profile")}
            >
              <div className="menu_icon">
                <PersonFill />
              </div>
              <div className="menu_label">Profile</div>
            </li>
            <hr className="mt-0 mb-0" />

            <li
              className={renderText === "packages" && "pageActive"}
              onClick={() => renderPageController("packages")}
            >
              <div className="menu_icon">
                <BarChart />
              </div>
              <div className="menu_label">Packages</div>
            </li>
            <hr className="mt-0 mb-0" />
            <li
              className={renderText === "supportPage" && "pageActive"}
              onClick={() => renderPageController("supportPage")}
            >
              <div className="menu_icon">
                <Question />
              </div>
              <div className="menu_label">Support Ticket</div>
            </li>
            <hr className="mt-0 mb-0" />

            {/* <li onClick={() => renderPageController("billpay")}>
              <div className="menu_icon">
                <CurrencyDollar />
              </div>
              <div className="menu_label">Pay bill</div>
            </li>
            <hr className="mt-0 mb-0" /> */}

            <li
              className={renderText === "paymentHistory" && "pageActive"}
              onClick={() => renderPageController("paymentHistory")}
            >
              <div className="menu_icon">
                <CurrencyDollar />
              </div>
              <div className="menu_label">Payment History</div>
            </li>
            <hr className="mt-0 mb-0" />

            <li
              className={renderText === "resetPassword" && "pageActive"}
              onClick={() => renderPageController("resetPassword")}
            >
              <div className="menu_icon">
                <KeyFill />
              </div>
              <div className="menu_label">Reset Password</div>
            </li>
            <hr className="mt-0 mb-0" />

            <li onClick={handleLogOut}>
              <div className="menu_icon">
                <KeyFill />
              </div>
              <div className="menu_label">Logout</div>
            </li>
          </ul>
          <div className="setting_icon_wraper">
            <div
              onClick={() => setMenuOpen(!isMenuOpen)}
              className="client_setting_icon"
            >
              <GearFill />
            </div>
          </div>
        </div>
      </div>
      <div className="client_profile">
        <section className="client_dashboard_section">
          <h1 className="text-center jumbotron">
            Welcome to {userData.ispOwner.company}
          </h1>
          <hr class="my-2" />

          {renderText === "profile" && <ClientProfile />}
          {renderText === "resetPassword" && <PasswordReset />}
          {renderText === "packages" && <Packages />}
          {renderText === "paymentHistory" && <PaymentHistory />}
          {renderText === "supportPage" && <SupportTicket />}
        </section>
      </div>
    </section>
  );
};

export default Client;
