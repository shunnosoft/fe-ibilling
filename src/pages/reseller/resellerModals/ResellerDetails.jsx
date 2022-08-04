import React from "react";
import "../reseller.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function ResellerDetails({ resellerId }) {
  const { t } = useTranslation();

  const allReseller = useSelector(
    (state) => state.persistedReducer?.reseller?.reseller
  );

  const reseller = allReseller.find((val) => {
    return val.id === resellerId;
  });

  return (
    <div>
      <div>
        <div
          className="modal fade modal-dialog-scrollable "
          id="resellerDetailsModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {t("profile")}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="Profile">
                  <img
                    src="https://www.kindpng.com/picc/m/207-2074624_white-gray-circle-avatar-png-transparent-png.png"
                    alt=""
                  />
                  <h5>{reseller?.name || "N/A"}</h5>
                  <p>
                    {t("website")} {reseller?.website || "N/A"}
                  </p>
                </div>
                <div className="ResellerDetails">
                  <h4>
                    {t("status")} : <b> {reseller?.status || "N/A"} </b>
                  </h4>
                  <h4>
                    {t("email")} : <b> {reseller?.email || "N/A"} </b>
                  </h4>
                  <h4>
                    {t("mobile")} : <b> {reseller?.mobile || "N/A"}</b>
                  </h4>
                  <h4>
                    {t("address")} : <b>{reseller?.address || "N/A"}</b>
                  </h4>
                  <h4>
                    NID: <b>{reseller?.nid || "N/A"}</b>
                  </h4>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
