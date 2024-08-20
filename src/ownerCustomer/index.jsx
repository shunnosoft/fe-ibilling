import moment from "moment/moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import {
  BarChart,
  CurrencyDollar,
  PersonFill,
  Question,
  GearFill,
  KeyFill,
  BoxArrowLeft,
  SortAlphaUp,
} from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { userLogout } from "../features/actions/authAsyncAction";
import "./client.css";
import ClientProfile from "./ClientProfile";
import Packages from "./packages";
import PasswordReset from "./PasswordReset";
import Payment from "./Payment";
import PaymentHistory from "./PaymentHistory";
import SupportTicket from "./SupportTicket";
import OwnerSupportNumbers from "./OwnerSupportNumbers";

const Client = () => {
  const [renderText, setRenderText] = useState("profile");
  const dispatch = useDispatch();

  // logout
  const handleLogOut = async () => {
    userLogout(dispatch);
  };

  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser.customer
  );

  const hasPG = userData.ispOwner.bpSettings.hasPG;

  useEffect(() => {
    const rText = localStorage.getItem("nf:textR"); //render page from local storage
    if (rText) setRenderText(rText);
  }, []);

  const renderPageController = (text) => {
    localStorage.setItem("nf:textR", text); //set page in local storage
    setRenderText(text);
  };
  const [isMenuOpen, setMenuOpen] = useState(false);

  const diffFormBillDate = moment(userData.billingCycle).diff(
    new Date(),
    "days"
  );

  const serviceData = [
    {
      header: "Home Internet",
      desc: "Get ready for more potential and more opportunity",
    },
    {
      header: "Corporate Connectivity",
      desc: "More than 1K corporate clients have trust in us",
    },
    {
      header: "SME Internet",
      desc: "Designed for more speed within a reasonable price",
    },
    {
      header: "Dedicated Server",
      desc: "Powerful Dedicated SSD Hosting with Root Access",
    },
    {
      header: "GPS Tracker",
      desc: "Suitable for personal use or any type of business",
    },

    {
      header: "Business Email",
      desc: "The most well-known which is said to have originated",
    },
  ];

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
              className={renderText === "profile" ? "pageActive" : ""}
              onClick={() => renderPageController("profile")}
            >
              <div className="menu_icon">
                <PersonFill />
              </div>
              <div className="menu_label">Profile</div>
            </li>
            <hr className="mt-0 mb-0" />

            <li
              className={renderText === "packages" ? "pageActive" : ""}
              onClick={() => renderPageController("packages")}
            >
              <div className="menu_icon">
                <BarChart />
              </div>
              <div className="menu_label">Packages</div>
            </li>
            <hr className="mt-0 mb-0" />
            <li
              className={renderText === "supportNumbers" ? "pageActive" : ""}
              onClick={() => renderPageController("supportNumbers")}
            >
              <div className="menu_icon">
                <SortAlphaUp />
              </div>
              <div className="menu_label">Support Numbers</div>
            </li>
            <hr className="mt-0 mb-0" />
            <li
              className={renderText === "supportPage" ? "pageActive" : ""}
              onClick={() => renderPageController("supportPage")}
            >
              <div className="menu_icon">
                <Question />
              </div>
              <div className="menu_label">Support Ticket</div>
            </li>
            <hr className="mt-0 mb-0" />

            {hasPG && (
              <>
                <li onClick={() => renderPageController("payBill")}>
                  <div className="menu_icon">
                    <CurrencyDollar />
                  </div>
                  <div className="menu_label">Pay bill</div>
                </li>
                <hr className="mt-0 mb-0" />
              </>
            )}

            <li
              className={renderText === "paymentHistory" ? "pageActive" : ""}
              onClick={() => renderPageController("paymentHistory")}
            >
              <div className="menu_icon">
                <CurrencyDollar />
              </div>
              <div className="menu_label">Payment History</div>
            </li>
            <hr className="mt-0 mb-0" />

            <li
              className={renderText === "resetPassword" ? "pageActive" : ""}
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
                <BoxArrowLeft />
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
        <Navbar
          className="client_navbar"
          collapseOnSelect
          expand="lg"
          variant="light"
        >
          <Container>
            <Navbar.Brand href="/">
              <span className="navHeaderCompany">
                {userData.ispOwner.company}
              </span>
            </Navbar.Brand>
            <Navbar.Toggle
              className=" shadow-none"
              aria-controls="responsive-navbar-nav"
            />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto client_nav_link">
                <Nav.Link onClick={() => renderPageController("profile")}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={() => renderPageController("packages")}>
                  Package
                </Nav.Link>
                <Nav.Link
                  onClick={() => renderPageController("supportNumbers")}
                >
                  Support Numbers
                </Nav.Link>
                <Nav.Link onClick={() => renderPageController("supportPage")}>
                  Support Ticket
                </Nav.Link>
                {hasPG && (
                  <Nav.Link onClick={() => renderPageController("payBill")}>
                    Pay Bill
                  </Nav.Link>
                )}

                <Nav.Link
                  onClick={() => renderPageController("paymentHistory")}
                >
                  Payment History
                </Nav.Link>
                <Nav.Link onClick={() => renderPageController("resetPassword")}>
                  Reset Password
                </Nav.Link>
                <Nav.Link onClick={handleLogOut}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <section className="client_dashboard_section">
          <div className="customer_information">
            <h1 className="welcome_title text-center">
              Welcome to {userData.ispOwner.company}
            </h1>
            {diffFormBillDate <= 7 && userData.paymentStatus !== "paid" && (
              <div className=" bg-primary py-3 text-center">
                <div className="h5">
                  <strong>Warning:</strong>Your billing date expire in{" "}
                  <span className="text-warning">
                    {moment(userData.billingCycle).format("DD MMM YYYY")}
                  </span>
                </div>
                {hasPG && (
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#billPaymentModal"
                    type="button"
                    className="btn btn-success "
                  >
                    Pay now
                  </button>
                )}
              </div>
            )}

            {renderText === "profile" && <ClientProfile />}
            {renderText === "resetPassword" && <PasswordReset />}
            {renderText === "packages" && <Packages />}
            {renderText === "payBill" && <Payment />}
            {renderText === "paymentHistory" && <PaymentHistory />}
            {renderText === "supportPage" && <SupportTicket />}
            {renderText === "supportNumbers" && <OwnerSupportNumbers />}
          </div>
        </section>
        {renderText === "profile" && (
          <div className="container services">
            <h2>Services</h2>
            <hr />

            <section className="section" id="courses">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <div className="features-absolute">
                      <div className="row mb-2">
                        {serviceData.map((item) => (
                          <div
                            key={item}
                            className="col-lg-3 col-md-6 col-12 mb-3"
                          >
                            <div className="card features feature-clean explore-feature p-4 px-md-3 border-0 rounded-md shadow text-center bg-dark ">
                              <div className="icons text-primary text-center mx-auto">
                                <i className="uil uil-home d-block rounded h3 mb-0"></i>
                              </div>

                              <div className="card-body p-0 content ">
                                <h5 className="mt-4">
                                  <span className="title text-white">
                                    {item.header}
                                  </span>
                                </h5>
                                <p className="text-muted">{item.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        <footer className="footer text-start">
          <div className="client_footer">
            <div style={{ flex: 6 }}>
              To get started with us, please go over all of our internet plans
              and other plans to let our operators know which one works for you
              the best! We guarantee high-quality customer support service with
              high-speed broadband connection all over the country.
            </div>

            <div style={{ flex: 6 }}>
              <h3>Contract</h3>
              <hr />
              <p>Mobile: {userData.ispOwner.signature}</p>
              <p>Office: {userData.ispOwner.address}</p>
              <p>Email: {userData.ispOwner.email}</p>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Client;

//customerId-> 6293c72e50bdd42730321733
