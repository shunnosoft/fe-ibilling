import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";
import { useTranslation } from "react-i18next";
import { getOwnerUsers } from "../../../features/getIspOwnerUsersApi";

export default function ResellerCustomerDetails({ single, resellerCount }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  // get all data from redux state
  let customer = useSelector(
    (state) => state?.resellerCustomer?.resellerCustomer
  );

  let allCustomer = useSelector(
    (state) => state?.resellerCustomer?.allResellerCustomer
  );

  let data;
  if (resellerCount === "singleReseller") {
    data = customer.find((item) => item.id === single);
  }

  if (resellerCount === "allReseller") {
    data = allCustomer.find((item) => item.id === single);
  }

  // find performer
  const performer = ownerUsers.find((item) => item[data?.createdBy]);

  useEffect(() => {
    getOwnerUsers(dispatch, ispOwnerId);
  }, []);

  return (
    <div>
      <div
        className="modal fade"
        id="resellerCustomerModalDetails"
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
                    <b>{data?.autoDisable ? "YES" : "NO"}</b>
                  </h6>
                </div>
                <div>
                  <div>
                    <h5>PPPoE</h5>
                    <hr />
                    <h6>
                      {t("userName")} : <b>{data?.pppoe?.name}</b>
                    </h6>
                    <h6>
                      {t("password ")} : <b>{data?.pppoe?.password}</b>
                    </h6>
                    <h6>
                      {t("profile")} : <b> {data?.pppoe?.profile}</b>
                    </h6>
                    <h6>
                      {t("service")} : <b>{data?.pppoe?.service}</b>
                    </h6>
                    <h6>
                      {t("comment")} : <b>{data?.pppoe?.comment}</b>
                    </h6>
                    <hr />
                  </div>
                  <div className="reference">
                    <h5>{t("reference")}</h5>
                    <hr />
                    <h6>
                      {t("referenceName")} : {data?.referenceName}
                    </h6>
                    <h6>
                      {t("referenceMobile")} : {data?.referenceMobile}
                    </h6>
                    <h6>
                      {t("createdBy")} :{" "}
                      {performer && performer[data?.createdBy].name}
                    </h6>
                    <h6>
                      {t("role")} :{" "}
                      {performer && performer[data?.createdBy].role}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
