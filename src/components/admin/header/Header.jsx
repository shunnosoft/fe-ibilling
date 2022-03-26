import React from "react";
import { FourGround } from "../../../assets/js/theme";
import { HeaderData } from "./HeaderData";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { BoxArrowLeft } from "react-bootstrap-icons";

// internal imports
import "./header.css";
// import { logOut } from "../../../features/authSlice";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../features/actions/authAsyncAction";

export default function Header(props) {
  const userRole = useSelector((state) => state.auth.role);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userData = useSelector((state) => state.auth.userData);
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

  // logout
  const handleLogOut = async () => {
    userLogout(dispatch);
  };

  const icon =
    props.theme === "light" ? (
      <i className="fas fa-moon"></i>
    ) : (
      <i className="fas fa-sun"></i>
    );

  return (
    <div className="header">
      <FourGround>
        <div className="container-fluied">
          <header className="headerBar">
            <div className="logoSide">{/* <h2>Bayanno pay</h2> */}</div>
            <div className="headerLinks">
              <div className="darkLight" onClick={changeTHeme}>
                {icon}
              </div>
              {currentUser ? (
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
                          <NavLink to={val.link} className="dropdown-item">
                            <span className="dropdownIcon">{val.icon}</span>
                            {val.name}
                          </NavLink>
                        </li>
                      );
                    })}
                    <li className="profileList logOutLi" onClick={handleLogOut}>
                      <div className="dropdown-item logOutTxt">
                        <span className="dropdownIcon">
                          <BoxArrowLeft />
                        </span>
                        লগআউট
                      </div>
                    </li>
                  </ul>
                </div>
              ) : pathName === "/register" ? (
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
