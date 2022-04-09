import { NavLink } from "react-router-dom";
import "./netfee.css";
export default function FooterLink() {
  return (
    <div className="textnew">
      <div className="alllinks">
        <NavLink className={"navnew"} to={"/netfee"}>
          <p className="newLink">Home</p>
        </NavLink>
        |
        <NavLink className={"navnew"} to={"/about"}>
          <p className="newLink">About</p>
        </NavLink>
        |
        <NavLink className={"navnew"} to={"/privacy-policy"}>
          <p className="newLink">privacy Policy</p>
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
        src="./assets/img/ssl.png"
        height="120px"
        width="600px"
      ></img>
    </div>
  );
}
