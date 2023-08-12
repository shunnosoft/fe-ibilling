import React, { useEffect, useState } from "react";
import "./netfeebulletin.css";
import {
  getIspOwnerBulletin,
  getResellerBulletin,
} from "../../features/apiCallAdmin";
import moment from "moment";
import { useSelector } from "react-redux";

const NetFeeBulletin = () => {
  const date = new Date();

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
    <>
      {bulletins.length > 0 && (
        <div className="bulletin">
          <marquee id="bulletin_marquee" scrollamount="6" scrolldelay="100">
            {bulletins &&
              bulletins.map((val) => {
                if (
                  moment(val.startDate).format("YYYY-MM-DD hh:mm") >=
                    moment(date).format("YYYY-MM-DD hh:mm") &&
                  moment(date).format("YYYY-MM-DD hh:mm") <=
                    moment(val.endDate).format("YYYY-MM-DD hh:mm")
                ) {
                  return (
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
                  );
                }
              })}
          </marquee>
        </div>
      )}
    </>
  );
};

export default NetFeeBulletin;
