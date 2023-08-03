import React, { useEffect, useState } from "react";
import { FourGround } from "../../../assets/js/theme";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowClockwise,
  BoxArrowLeft,
  Paypal,
  PersonFill,
} from "react-bootstrap-icons";

// internal imports
import "./header.css";
// import { logOut } from "../../../features/authSlice";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../features/actions/authAsyncAction";
import Loader from "../../common/Loader";
import {
  getIspOwnerWitSMS,
  getResellerBalance,
  getTotalbal,
} from "../../../features/apiCalls";
import i18n from "../../../language/i18n/i18n";
import FormatNumber from "../../common/NumberFormat";
import { useTranslation } from "react-i18next";
import ResellerOnlinePayment from "../../../reseller/onlinePayment/ResellerOnlinePayment";
import SupportCall from "../../../pages/netFeeSupport/supportOpration/SupportCall";

export default function Header(props) {
  const { t } = useTranslation();
  // const userRole = useSelector(state => state.persistedReducer.auth.role);
  const [isRefrsh, setIsrefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // reseller payment modal state
  const [paymentShow, setPaymentShow] = useState(false);

  const [rechargeBalnace, setRechargeBalance] = useState(0);
  const [smsBalance, setSmsBalance] = useState(0);
  const [ispOwner, setIspOwner] = useState("");

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // ispOwner BpSetting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  const currentUser = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const balancee = useSelector((state) => state?.payment?.balance);
  const previousBalancee = useSelector(
    (state) => state?.payment?.previousBalance
  );

  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const pathName = useLocation().pathname;
  const changeTHeme = () => {
    if (props.theme === "light") {
      props.setTheme("dark");
    } else {
      props.setTheme("light");
    }
  };

  useEffect(() => {
    if (userRole === "ispOwner") {
      getIspOwnerWitSMS(ispOwnerId, setIspOwner, setLoading);
    }
    if (userRole === "reseller") {
      getResellerBalance(
        userData.id,
        setRechargeBalance,
        setSmsBalance,
        setIsrefresh
      );
    }
    if (userRole === "manager" || userRole === "collector") {
      getTotalbal(dispatch, setLoading);
    }
  }, [userRole, userData]);
  // logout
  const handleLogOut = async () => {
    userLogout(dispatch);
  };

  // change laguage settings
  const [getLang, setGetLang] = useState("bn");

  useEffect(() => {
    const lang = localStorage.getItem("netFee:lang");
    setGetLang(lang ? lang : localStorage.setItem("netFee:lang", "bn"));
    i18n.changeLanguage(localStorage.getItem("netFee:lang"));
  }, [getLang]);

  const selectLanguage = (event) => {
    setGetLang(event.target.value);
    localStorage.setItem("netFee:lang", event.target.value);
  };
  // end change language settings

  const icon =
    props.theme === "light" ? (
      <i className="fas fa-moon"></i>
    ) : (
      <i className="fas fa-sun"></i>
    );

  // const getResellerBalance = ()=>{
  //   setIsrefresh(true)
  // }

  // reseller ispOwner online payment modal
  const resellerOnlinePayment = () => {
    setPaymentShow(true);
  };

  return pathName === "/terms-conditions" ||
    pathName === "/privacy-policy" ||
    pathName === "/return-and-refund-policy" ? (
    <div></div>
  ) : (
    <div className="header">
      <FourGround>
        <div className="container-fluied">
          <header className="headerBar">
            {pathName === "/login" || pathName === "/register" ? (
              <NavLink to={"/netfee"}>
                <div className="homediv">
                  <img className="newLogoo" src="/assets/img/logo.png" alt="" />
                </div>
              </NavLink>
            ) : (
              ""
            )}

            <div className="logo_section company_logo">
              {/* <img src="./assets/img/logo.png" alt="" /> */}
            </div>

            <div className="headerLinks">
              {/* <Link to="/netFee/support">
                <SupportDetails />
              </Link> */}
              {userRole !== "admin" && userRole !== "superadmin" ? (
                <div
                  style={{ cursor: "pointer", width: "190px" }}
                  className="fw-bold text-primary me-1 phone_view_none"
                  title={t("netFeeSupportTeam")}
                >
                  <p onClick={() => setIsOpen({ ...isOpen, [false]: true })}>
                    {t("netfeeSupportNumbers")}
                  </p>
                </div>
              ) : (
                ""
              )}

              {currentUser && userRole === "ispOwner" ? (
                <div
                  style={{ marginRight: "20px" }}
                  className="refreshDiv phone_view_none"
                >
                  <div
                    style={{ backgroundColor: "inherit" }}
                    className="balancetext"
                  >
                    {ispOwner?.smsBalance > 0 && (
                      <p className="me-2">
                        {t("nonMasking")}
                        <strong className="mainsmsbalance">
                          {FormatNumber(ispOwner.smsBalance)}
                        </strong>
                      </p>
                    )}

                    {ispOwner?.maskingSmsBalance > 0 && (
                      <p className="me-2">
                        {t("masking")}
                        <strong className="mainsmsbalance">
                          {FormatNumber(ispOwner.maskingSmsBalance)}
                        </strong>
                      </p>
                    )}

                    {ispOwner?.fixedNumberSmsBalance > 0 && (
                      <p className="me-2">
                        {t("fixed")}
                        <strong className="mainsmsbalance">
                          {FormatNumber(ispOwner.fixedNumberSmsBalance)}
                        </strong>
                      </p>
                    )}
                  </div>

                  {(ispOwner?.smsBalance ||
                    ispOwner?.maskingSmsBalance ||
                    ispOwner?.fixedNumberSmsBalance) > 0 && (
                    <div
                      title={t("refresh")}
                      style={{
                        borderRadius: "10%",
                        backgroundColor: "#F7E9D7",
                      }}
                      className="refreshIcon"
                    >
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          onClick={() =>
                            getIspOwnerWitSMS(
                              ispOwnerId,
                              setIspOwner,
                              setLoading
                            )
                          }
                        ></ArrowClockwise>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}

              {currentUser && userRole === "reseller" ? (
                <div style={{ marginRight: "20px" }} className="refreshDiv">
                  {/* <div
                    style={{ backgroundColor: "inherit" }}
                    className="balancetext"
                  >
                    {t("SMS")}
                    <strong className="mainsmsbalance">{smsBalance}</strong>
                  </div> */}
                  <div
                    style={{ backgroundColor: "inherit" }}
                    className="balancetext"
                  >
                    {t("balance")}
                    <strong className="mainsmsbalance">
                      {FormatNumber(rechargeBalnace?.toFixed())}
                    </strong>
                  </div>
                  <div
                    style={{ backgroundColor: "inherit" }}
                    className="balancetext"
                  >
                    {t("message")}
                    <strong className="mainsmsbalance">
                      {FormatNumber(smsBalance?.toFixed())}
                    </strong>
                  </div>

                  <div
                    title={t("refresh")}
                    style={{ borderRadius: "10%", backgroundColor: "#F7E9D7" }}
                    className="refreshIcon"
                  >
                    {isRefrsh ? (
                      <Loader />
                    ) : (
                      <ArrowClockwise
                        onClick={() =>
                          getResellerBalance(
                            userData.id,
                            setRechargeBalance,
                            setSmsBalance,
                            setIsrefresh
                          )
                        }
                      ></ArrowClockwise>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}

              {currentUser &&
              (userRole === "manager" || userRole === "collector") ? (
                <div style={{ marginRight: "20px" }} className="refreshDiv">
                  <div
                    style={{ backgroundColor: "inherit" }}
                    className="balancetext"
                  >
                    {t("balance")}
                    <strong className="mainsmsbalance">
                      {FormatNumber(balancee)}
                    </strong>
                  </div>
                  {/* <div
                    style={{ backgroundColor: "inherit" }}
                    className="balancetext"
                  >
                    {t("previousBalance")}
                    <strong className="mainsmsbalance">
                      {FormatNumber(previousBalancee)}
                    </strong>
                  </div> */}
                  <div
                    title={t("refresh")}
                    style={{ borderRadius: "10%", backgroundColor: "#F7E9D7" }}
                    className="refreshIcon"
                  >
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <ArrowClockwise
                        onClick={() => getTotalbal(dispatch, setLoading)}
                      ></ArrowClockwise>
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}

              <div className="darkLight phone_view_none" onClick={changeTHeme}>
                {icon}
              </div>

              {/* change language select box */}
              <select
                onChange={selectLanguage}
                className="me-2"
                style={{
                  border: "none",
                  fontSize: "15px",
                  backgroundColor: "transparent",
                }}
              >
                <option value="bn" selected={getLang === "bn"}>
                  বাং
                </option>
                <option value="en" selected={getLang === "en"}>
                  EN
                </option>
              </select>
              {/* end change language select box */}

              {currentUser ? (
                <>
                  <div className="dropdown">
                    <button
                      type="button"
                      className="dropdown-toggle profileDropdownBtn"
                      data-bs-toggle="dropdown"
                    >
                      {userData?.name}
                      {/* {userRole === "ispOwner" ? "( Admin )" : ""}
                    {userRole === "collector" ? "( Staff )" : ""}
                    {userRole === "manager" ? "( Manager )" : ""} */}

                      <img
                        src="./assets/img/noAvater.jpg"
                        alt=""
                        className="profileDropdownImg"
                      />
                    </button>

                    <ul className="dropdown-menu">
                      <li className="profileList">
                        <NavLink
                          to={
                            userRole === "reseller" ||
                            currentUser?.collector?.reseller
                              ? "/reseller/profile"
                              : "/profile"
                          }
                          className="dropdown-item"
                        >
                          <span className="dropdownIcon">
                            <PersonFill />
                          </span>
                          {t("profile")}
                        </NavLink>
                      </li>

                      {/* {userRole === "ispOwner" || userRole === "manager" ? (
                        <Link to="/activity">
                          <li className="profileList logOutLi">
                            <div className="dropdown-item logOutTxt">
                              <span className="dropdownIcon">
                                <PersonBoundingBox />
                              </span>
                              এক্টিভিটি
                            </div>
                          </li>
                        </Link>
                      ) : (
                        ""
                      )} */}
                      {userRole === "reseller" && bpSettings?.hasPG ? (
                        <li
                          className="profileList"
                          onClick={resellerOnlinePayment}
                        >
                          <div className="dropdown-item">
                            <span className="dropdownIcon">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-cash-coin"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"
                                />
                                <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z" />
                                <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z" />
                                <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z" />
                              </svg>
                            </span>
                            {t("onlinePayment")}
                          </div>
                        </li>
                      ) : (
                        ""
                      )}

                      <li
                        className="profileList logOutLi"
                        onClick={handleLogOut}
                      >
                        <div className="dropdown-item logOutTxt">
                          <span className="dropdownIcon">
                            <BoxArrowLeft />
                          </span>
                          {t("logOut")}
                        </div>
                      </li>
                    </ul>
                  </div>
                </>
              ) : pathName === "/register" ||
                pathName === "/netfee" ||
                pathName === "/terms-conditions" ||
                pathName === "/privacy-policy" ||
                pathName === "/about" ||
                pathName === "/return-and-refund-policy" ? (
                <NavLink to="/login">
                  <p className="goToLoginPage">{t("logIn")}</p>
                </NavLink>
              ) : (
                <NavLink to="/register">
                  <p className="goToLoginPage">{t("register")}</p>
                </NavLink>
              )}
            </div>
          </header>
        </div>
      </FourGround>
      <ResellerOnlinePayment show={paymentShow} setShow={setPaymentShow} />
      {/* <MessageAlert ispOwner={ispOwner} /> */}
      <SupportCall isOpen={isOpen} />
    </div>
  );
}
