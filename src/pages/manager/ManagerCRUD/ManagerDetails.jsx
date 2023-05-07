import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function ManagerDetails({ managerId }) {
  const { t } = useTranslation();

  //get all manager
  const manager = useSelector((state) => state?.manager?.manager);

  //get single manager by id
  const single = manager?.find((val) => val.id === managerId);

  return (
    <div>
      <div
        className="modal fade"
        id="showManagerDetails"
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
                {single?.name} {t("erProfile")}
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
              <h2 className="ProfileName">{single?.name}</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("mobile")} :
                    </th>
                    <th scope="col">{single?.mobile}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("address")} :
                    </th>
                    <th scope="col">{single?.address}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("email")} :
                    </th>
                    <th scope="col">{single?.email}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("NIDno")} :
                    </th>
                    <th scope="col">{single?.nid}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("status")} :
                    </th>
                    <th scope="col">{single?.status}</th>
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
