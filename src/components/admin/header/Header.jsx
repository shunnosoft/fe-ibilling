import React from "react";
import "./header.css";
import { FourGround } from "../../../assets/js/theme";
import { HeaderData } from "./HeaderData";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { BoxArrowLeft } from "react-bootstrap-icons";

export default function Header(props) {
  const { isAuth } = useSelector((state) => state.auth);

  console.log("From home Header: ", isAuth);

  const changeTHeme = () => {
    if (props.theme === "light") {
      props.setTheme("dark");
    } else {
      props.setTheme("light");
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ispWoner");
    window.location.reload();
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
              {isAuth ? (
                <div className="dropdown">
                  <button
                    type="button"
                    className="dropdown-toggle profileDropdownBtn"
                    data-bs-toggle="dropdown"
                  >
                    রাকিবুজ্জামান
                    <img
                      src="https://us.123rf.com/450wm/luismolinero/luismolinero1909/luismolinero190917934/130592146-handsome-young-man-in-pink-shirt-over-isolated-blue-background-keeping-the-arms-crossed-in-frontal-p.jpg?ver=6"
                      alt=""
                      className="profileDropdownImg"
                    />
                  </button>

                  <ul className="dropdown-menu">
                    {HeaderData.map((val, key) => {
                      return (
                        <li key={key} className="profileList">
                          <NavLink to="" className="dropdown-item">
                            <span className="dropdownIcon">{val.icon}</span>
                            {val.name}
                          </NavLink>
                        </li>
                      );
                    })}
                    <li className="profileList logOutLi" onClick={handleLogOut}>
                      <NavLink to="" className="dropdown-item logOutTxt">
                        <span className="dropdownIcon">
                          <BoxArrowLeft />
                        </span>
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </div>
              ) : (
                <NavLink to="/login">
                  <p className="goToLoginPage">Login</p>
                </NavLink>
              )}
            </div>
          </header>
        </div>
      </FourGround>
    </div>
  );
}
