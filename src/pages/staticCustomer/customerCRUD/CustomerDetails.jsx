import React from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";
import { useTranslation } from "react-i18next";

export default function CustomerDetails({ single }) {
  const { t } = useTranslation();
  // get all customer
  const customer = useSelector((state) => state?.customer?.staticCustomer);

  // find editable data
  const data = customer.find((item) => item.id === single);

  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );
  return (
    <div>
      <div
        className="modal fade"
        id="showCustomerDetails"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                {data?.name} - {t("profile")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h2 className="ProfileName">{data?.name}</h2>
              <div className="profileMain">
                <div>
                  <h5> {t("customer")} </h5>
                  <hr />
                  <h6>
                    {t("customerId")} {data?.customerId}
                  </h6>
                  <h6>
                    {t("name")}: {data?.name}
                  </h6>
                  <h6>
                    {t("mobile")}: {data?.mobile}
                  </h6>
                  <h6>
                    {t("address")}: {data?.address}
                  </h6>
                  <h6>
                    {t("email")}: {data?.email}
                  </h6>
                  <h6>
                    {t("createdAt")} :{" "}
                    {moment(data?.createdAt).format("DD-MM-YYYY hh:mm A")}
                  </h6>
                  <h6>
                    {t("NIDno")}: {data?.nid}
                  </h6>
                  <h6>
                    {t("status")}: {badge(data?.status)}
                  </h6>
                  <h6>
                    {t("paymentStatus")}: {badge(data?.paymentStatus)}
                  </h6>
                  <h6>
                    {t("monthFee")}: {FormatNumber(data?.monthlyFee)}
                  </h6>
                  <h6>
                    {t("balance")}: {FormatNumber(data?.balance)}
                  </h6>
                  <h6>
                    {t("billingCycle")}:{" "}
                    {moment(data?.billingCycle).format("MMM DD YYYY hh:mm A")}
                  </h6>
                  <h6>
                    {t("promiseDate")}:{" "}
                    {moment(data?.promiseDate).format("MMM DD YYYY hh:mm A")}
                  </h6>
                  {bpSettings?.hasMikrotik && (
                    <h6>
                      {t("automaticConnectionOff")}:{" "}
                      {data?.autoDisable ? "YES" : "NO"}
                    </h6>
                  )}
                </div>
                <div>
                  <h5> {t("staticCustomer")} </h5>
                  <hr />
                  <h6>
                    {t("userName")}: {data?.queue?.name}
                  </h6>
                  <h6>
                    {t("ip")}: {data?.queue?.target}
                  </h6>
                  <h6>
                    {t("comment")}: {data?.queue?.comment}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
