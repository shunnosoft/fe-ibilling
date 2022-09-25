import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ArrowRight } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export default function Details({ activityId }) {
  const { t } = useTranslation();
  const activityLogData = useSelector((state) => state.activityLog.activityLog);
  console.log(activityLogData);

  const singleData = activityLogData.find((item) => item.id === activityId);

  const [value, setValue] = useState([]);

  useEffect(() => {
    if (singleData?.data) {
      setValue(JSON.parse(singleData.data));
    }
  }, [singleData]);
  console.log(value);
  const checkOp = value[0]?.op;

  return (
    <div
      className="modal fade"
      id="showActivityLogDetails"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className={`modal-dialog ${checkOp != "add" && "modal-xl"}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {t("details")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {Object.keys(value).forEach((k) => {
              console.log(value[k]);
              // <p>{value[k]}</p>
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
