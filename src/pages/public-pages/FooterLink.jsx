import { NavLink } from "react-router-dom";
import "./ibilling.css";
export default function FooterLink() {
  return (
    <div className="textnew">
      <div className="alllinks">
        <NavLink className={"navnew"} to={"/ibilling"}>
          <p className="newLink">Home</p>
        </NavLink>
        |
        <NavLink className={"navnew"} to={"/about"}>
          <p className="newLink">About</p>
        </NavLink>
        |
        <NavLink className={"navnew"} to={"/privacy-policy"}>
          <p className="newLink">Privacy Policy</p>
        </NavLink>
        |
        <NavLink className={"navnew"} to={"/terms-conditions"}>
          <p className="newLink">Terms and Conditions</p>
        </NavLink>
        |
        <NavLink className={"navnew"} to={"/return-and-refund-policy"}>
          <p className="newLink"> Return & Refund Policy</p>
        </NavLink>
      </div>
      <br />
      <img
        className="sslimg"
        alt="ssl"
        src="./assets/img/ssl2.png"
        height="130px"
        width="650px"
      ></img>
    </div>
  );
}
