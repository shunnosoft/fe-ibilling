import { useEffect, useState } from "react";
import "./success.css";
import "../public-pages/hotspotCoustomerQRCode/qrCodeHotspot.css";
import PaymentSuccessful from "../../assets/img/HotspotSuccessful.png";

export default function HotspotSuccess() {
  const userName = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let intervalId;
    if (userName && password) {
      intervalId = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            window.location.href = `http://wifi.login/login?username=${userName}&password=${password}`;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [userName, password]);

  return (
    <div className="center-container">
      <img
        src={PaymentSuccessful}
        alt="Payment Successful"
        className="success-image"
      />

      <h2 className="text-success">Paid successfully</h2>
      <p className="countdown-text">Connecting in {countdown} seconds...</p>
    </div>
  );
}
