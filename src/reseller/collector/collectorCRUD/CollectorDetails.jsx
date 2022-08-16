import React from "react";
import "../../Customer/customer.css";
import "../collector.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function CollectorDetails({ single }) {
  const { t } = useTranslation();

  // get all collector from redux
  const collector = useSelector((state) => state?.collector?.collector);
  const data = collector.find((item) => item.id === single);

  return (
    <div>
      <div
        className="modal fade"
        id="showCollectorDetails"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                {data?.name} {t("erProfile")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="profileImage">
                <img
                  src="https://roottogether.net/wp-content/uploads/2020/04/img-avatar-blank.jpg"
                  alt=""
                />
              </div>
              <h2 className="ProfileName">{data?.name}</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("mobile")} :
                    </th>
                    <th scope="col">{data?.mobile}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("address")} :
                    </th>
                    <th scope="col">{data?.address}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("email")} :
                    </th>
                    <th scope="col">{data?.email}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("NIDno")} :
                    </th>
                    <th scope="col">{data?.nid}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("status")} :
                    </th>
                    <th scope="col">{data?.status}</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
