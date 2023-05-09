import React, { useEffect, useState } from "react";
import { FourGround } from "../../../assets/js/theme";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowClockwise,
  BoxArrowLeft,
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
import MessageAlert from "../../../pages/message/MessageAlert";
import SupportDetails from "./netFeeSupport/SupportDetails";
import SupportCall from "../../../pages/netFeeSupport/supportOpration/SupportCall";

export default function Header(props) {
  const { t } = useTranslation();
  // const userRole = useSelector(state => state.persistedReducer.auth.role);
  const [isRefrsh, setIsrefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [rechargeBalnace, setRechargeBalance] = useState(0);
  const [smsBalance, setSmsBalance] = useState(0);
  const [ispOwner, setIspOwner] = useState("");

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
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
    if (userRole === "manager") {
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

              {currentUser && userRole === "ispOwner" ? (
                <div style={{ marginRight: "20px" }} className="refreshDiv">
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

              {currentUser && userRole === "manager" ? (
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

              {userRole !== "admin" && userRole !== "superadmin" ? (
                <div className="darkLight me-3" title={t("netFeeSupportTeam")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-telephone-outbound-fill"
                    viewBox="0 0 16 16"
                    onClick={() => setIsOpen({ ...isOpen, [false]: true })}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511zM11 .5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V1.707l-4.146 4.147a.5.5 0 0 1-.708-.708L14.293 1H11.5a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </div>
              ) : (
                ""
              )}

              <div className="darkLight" onClick={changeTHeme}>
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
      {/* <MessageAlert ispOwner={ispOwner} /> */}
      <SupportCall isOpen={isOpen} />
    </div>
  );
}
