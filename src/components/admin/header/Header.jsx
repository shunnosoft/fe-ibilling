import React from "react";
import { FourGround } from "../../../assets/js/theme";
import { HeaderData } from "./HeaderData";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { BoxArrowLeft } from "react-bootstrap-icons";

// internal imports
import "./header.css";
// import { logOut } from "../../../features/authSlice";
import { useDispatch } from "react-redux";
import { userLogout } from "../../../features/actions/authAsyncAction";
import ProfileModal from "../../headersOptions/ProfileModal";

export default function Header(props) {
  const  currentUser = useSelector((state) => state.auth.currentUser);
  const ispOwner = useSelector(state=>state.auth.ispOwner)
  const dispatch= useDispatch() ; 
  // const navigate = useNavigate();

  const changeTHeme = () => {
    if (props.theme === "light") {
      props.setTheme("dark");
    } else {
      props.setTheme("light");
    }
  };

  // logout
  const handleLogOut = async () => {
    userLogout(dispatch)
     
     

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
                    {ispOwner ? ispOwner.name : "Owner"}
                    <img
                      src="https://us.123rf.com/450wm/luismolinero/luismolinero1909/luismolinero190917934/130592146-handsome-young-man-in-pink-shirt-over-isolated-blue-background-keeping-the-arms-crossed-in-frontal-p.jpg?ver=6"
                      alt=""
                      className="profileDropdownImg"
                    />
                  </button>

                  <ul className="dropdown-menu">
                    {HeaderData.map((val, key) => {
                      return (
                        <li  data-bs-toggle="modal" data-bs-target="#exampleModal" key={key} className="profileList">
                          <div className="dropdown-item">
                            <span className="dropdownIcon">{val.icon}</span>
                            {val.name}
                          </div>
                        </li>
                      );
                    })}
                    <li className="profileList logOutLi" onClick={handleLogOut}>
                      <div className="dropdown-item logOutTxt">
                        <span className="dropdownIcon">
                          <BoxArrowLeft />
                        </span>
                        Logout
                      </div>
                    </li>
                  </ul>
                </div>
              ) : (
                <NavLink to="/login">
                  <p className="goToLoginPage">লগইন</p>
                </NavLink>
              )}
            </div>
          </header>
        </div>
      </FourGround>
    </div>
  );
}
