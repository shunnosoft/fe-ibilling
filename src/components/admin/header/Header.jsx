import React, { useEffect, useState } from "react";
import { FourGround } from "../../../assets/js/theme";
import { HeaderData } from "./HeaderData";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowClockwise,
  BoxArrowLeft,
  PersonBoundingBox,
} from "react-bootstrap-icons";

// internal imports
import "./header.css";
// import { logOut } from "../../../features/authSlice";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../features/actions/authAsyncAction";
import Loader from "../../common/Loader";
import { getResellerBalance, getTotalbal } from "../../../features/apiCalls";
import i18n from "../../../language/i18n/i18n";
import FormatNumber from "../../common/NumberFormat";
import { useTranslation } from "react-i18next";

export default function Header(props) {
  const { t } = useTranslation();
  // const userRole = useSelector(state => state.auth.role);
  const [isRefrsh, setIsrefresh] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [rechargeBalnace, setRechargeBalance] = useState(0);
  const [smsBalance, setSmsBalance] = useState(0);
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const balancee = useSelector(
    (state) => state?.persistedReducer?.payment?.balance
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
    setGetLang(localStorage.getItem("netFee:lang"));
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
              <img src="./assets/img/logo.png" alt="" />
            </div>
            <div className="headerLinks">
              {currentUser && userRole === "reseller" ? (
                <div style={{ marginRight: "20px" }} className="refreshDiv">
                  <div
                    style={{ backgroundColor: "inherit" }}
                    className="balancetext"
                  >
                    {t("SMS")}
                    <strong className="mainsmsbalance">{smsBalance}</strong>
                  </div>
                  <div
                    style={{ backgroundColor: "inherit" }}
                    className="balancetext"
                  >
                    {t("balance")}
                    <strong className="mainsmsbalance">
                      {rechargeBalnace.toFixed()}
                    </strong>
                  </div>
                  <div
                    title={t("refresh")}
                    style={{ borderRadius: "10%", backgroundColor: "#F7E9D7" }}
                    className="refreshIcon"
                  >
                    {isRefrsh ? (
                      <Loader></Loader>
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
                  <div
                    title={t("refresh")}
                    style={{ borderRadius: "10%", backgroundColor: "#F7E9D7" }}
                    className="refreshIcon"
                  >
                    {isRefrsh ? (
                      <Loader></Loader>
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

              <div className="darkLight" onClick={changeTHeme}>
                {icon}
              </div>

              {currentUser ? (
                <>
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
                      {HeaderData.map((val, key) => {
                        return (
                          <li key={key} className="profileList">
                            <NavLink
                              to={
                                userRole === "reseller"
                                  ? val.resellerLink
                                  : val.link
                              }
                              className="dropdown-item"
                            >
                              <span className="dropdownIcon">{val.icon}</span>
                              {val.name}
                            </NavLink>
                          </li>
                        );
                      })}

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
                          {t("logout")}
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
                  <p className="goToLoginPage">লগইন</p>
                </NavLink>
              ) : (
                <NavLink to="/register">
                  <p className="goToLoginPage">রেজিস্টার</p>
                </NavLink>
              )}
            </div>
          </header>
        </div>
      </FourGround>
    </div>
  );
}
