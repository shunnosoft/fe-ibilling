import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";
import { useTranslation } from "react-i18next";

export default function CustomerDetails({ single }) {
  const { t } = useTranslation();
  const customer = useSelector(
    (state) => state?.persistedReducer?.customer?.customer
  );

  const data = customer.find((item) => item.id === single);

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
                    {t("customerId")} : <b>{data?.customerId}</b>
                  </h6>
                  <h6>
                    {t("name")} : <b>{data?.name}</b>
                  </h6>
                  <h6>
                    {t("mobile")} : <b>{data?.mobile}</b>
                  </h6>
                  <h6>
                    {t("address")} : <b>{data?.address}</b>
                  </h6>
                  <h6>
                    {t("email")} : <b> {data?.email}</b>
                  </h6>
                  <h6>
                    {t("NIDno")} : <b>{data?.nid}</b>
                  </h6>
                  <h6>
                    {t("status")} : <b>{badge(data?.status)}</b>
                  </h6>
                  <h6>
                    {t("payment")} : <b>{badge(data?.paymentStatus)}</b>
                  </h6>
                  <h6>
                    {t("monthFee")} :<b> {FormatNumber(data?.monthlyFee)}</b>
                  </h6>
                  <h6>
                    {t("balance")} :<b> {FormatNumber(data?.balance)}</b>
                  </h6>
                  <h6>
                    {t("billingCycle")} :{" "}
                    <b>
                      {moment(data?.billingCycle).format("DD-MM-YYYY hh:mm A")}
                    </b>
                  </h6>
                  <h6>
                    {t("automaticConnectionOff")} :{" "}
                    <b>{single?.autoDisable ? "YES" : "NO"}</b>
                  </h6>
                </div>
                <div>
                  <h5>PPPoE</h5>
                  <hr />
                  <h6>
                    {t("userName")} : <b>{single?.pppoe?.name}</b>
                  </h6>
                  <h6>
                    <h6>
                      {t("password")} : <b>{single?.password}</b>
                    </h6>
                    {t("profile")} : <b> {single?.pppoe?.profile}</b>
                  </h6>
                  <h6>
                    {t("service")} : <b>{single?.pppoe?.service}</b>
                  </h6>
                  <h6>
                    {t("comment")} : <b>{single?.pppoe?.comment}</b>
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
