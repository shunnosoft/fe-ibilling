import React, { useEffect, useState } from "react";
import "./netfeebulletin.css";
import {
  getIspOwnerBulletin,
  getResellerBulletin,
} from "../../features/apiCallAdmin";
import { useSelector } from "react-redux";

const NetFeeBulletin = () => {
  // get user role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get current user data
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // get bulletin in isp & reseller state
  const [bulletins, setBulletins] = useState([]);

  useEffect(() => {
    if (role === "reseller" || (role === "collector" && userData.reseller)) {
      getResellerBulletin(setBulletins);
    } else {
      getIspOwnerBulletin(setBulletins);
    }
  }, []);

  return (
    bulletins &&
    bulletins.map((val) => (
      <div className="bulletin">
        <marquee id="bulletin_marquee" scrollamount="6" scrolldelay="100">
          <span
            className="bulletin_title"
            onMouseEnter={() =>
              document.getElementById("bulletin_marquee").stop()
            }
            onMouseLeave={() =>
              document.getElementById("bulletin_marquee").start()
            }
          >
            {val && val.title}
          </span>
        </marquee>
      </div>
    ))
  );
};

export default NetFeeBulletin;
