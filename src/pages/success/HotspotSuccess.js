import { useEffect } from "react";
import "./success.css";
import "../public-pages/hotspotCoustomerQRCode/qrCodeHotspot.css";
import PaymentSuccessful from "../../assets/img/HotspotSuccessful.png";

export default function HotspotSuccess() {
  const userName = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = `http://ibnul.net/login?username=${userName}&password=${password}`;
    }, 3000);

    return () => clearTimeout(timer);
  }, [userName, password]);

  return (
    <div className="center-container">
      <img
        src={PaymentSuccessful}
        alt="Payment Successful"
        className="success-image"
      />

      <h2 className="text-success">Paid successfully</h2>
      <p className="countdown-text">Connecting in 3 seconds...</p>
    </div>
  );
}
