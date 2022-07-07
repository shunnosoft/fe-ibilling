import React from "react";
import "../../Customer/customer.css";
import { useTranslation } from "react-i18next";

export default function CustomerDetails({ single }) {
  const { t } = useTranslation();
  // const single = useSelector(state => state.customer.singleCustomer);

  return (
    <div>
      <div
        className="modal fade"
        id="showCustomerDetails"
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
                {t("customerProfile")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
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
                      {t("balance")} :
                    </th>
                    <th scope="col">{single?.balance}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("monthlyPayment")} :
                    </th>
                    <th scope="col">{single?.monthlyFee}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("status")} :
                    </th>
                    <th scope="col">{single?.status}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      {t("userType")} :
                    </th>
                    <th scope="col">{single?.userType}</th>
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
