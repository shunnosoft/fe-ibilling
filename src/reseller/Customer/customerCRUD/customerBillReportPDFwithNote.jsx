import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Table from "react-bootstrap/Table";
const BillCollectInvoiceWithoutNote = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { billingData, ispOwnerData, customerData, paymentDate } = props;
  return (
    <>
      <div ref={ref}>
        {billingData?.status === "both" && (
          <>
            <div className="text-center mb-1">{t("officeCopy")}</div>
            <div
              className="text-center bg-primary text-white fw-bold p-1"
              style={{ borderRadius: "1.1rem" }}
            >
              <h2>{ispOwnerData.company}</h2>
            </div>

            <div className="container">
              <div className="d-flex justify-content-between p-1 m-1">
                <div>
                  <p>
                    {t("name")} :
                    <strong style={{ marginLeft: "2.7rem" }}>
                      {customerData.name}
                    </strong>
                  </p>
                  <p>
                    {customerData.mobile && (
                      <span>
                        {t("mobile")} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {customerData.mobile}
                        </strong>
                      </span>
                    )}
                  </p>
                  <p>
                    {customerData.address && (
                      <span>
                        {t("address")} : {customerData.address}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p>
                    {t("package")}:
                    <strong style={{ marginLeft: "4rem" }}>
                      {customerData.userType === "simple-queue" ||
                      customerData.userType === "firewall-queue"
                        ? customerData.queue.package
                        : customerData.pppoe.profile}
                    </strong>
                  </p>
                  <p>
                    {t("paidDate")}:
                    <strong style={{ marginLeft: ".7rem" }}>
                      {moment(paymentDate).format("MMM DD YYYY")}
                    </strong>
                  </p>
                </div>
              </div>

              <Table
                bordered
                className="text-center align-center"
                style={{ lineHeight: "9px" }}
              >
                <tbody>
                  <tr>
                    <th>{t("billDhoron")}</th>
                    <td>
                      {billingData?.billType == "bill"
                        ? t("bill")
                        : t("connectionFee")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("amount")}</th>
                    <td> {billingData?.amount}</td>
                  </tr>
                  <tr>
                    <th>{t("due")}</th>
                    <td>{billingData.due ? billingData.due : 0}</td>
                  </tr>
                  <tr>
                    <th>{t("medium")}</th>
                    <td>{billingData?.medium}</td>
                  </tr>
                  <tr>
                    <th>{t("billingCycle")}</th>
                    <td>
                      {moment(billingData?.billingCycle).format("MMM DD YYYY")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("promiseDate")}</th>
                    <td>
                      {moment(billingData?.promiseDate).format("MMM DD YYYY")}
                    </td>
                  </tr>
                </tbody>
              </Table>

              <div
                className="d-flex justify-content-between h4"
                style={{ marginTop: "1.8rem" }}
              >
                <div>
                  <hr className="mb-1" />
                  <p>{t("Proprietor")}</p>
                </div>

                <div>
                  <hr className="mb-1" />
                  <p>{t("customer")}</p>
                </div>
              </div>
            </div>

            {/* hhhhhhhhhhhhhhhhhhh */}
            <div style={{ marginTop: "1rem" }}>
              <hr />
            </div>
          </>
        )}

        <div style={{ marginTop: "1rem" }}>
          <div className="text-center mb-1 ">{t("customerCopy")}</div>
          <div
            className="text-center bg-primary text-white fw-bold p-1 "
            style={{ borderRadius: "1.1rem" }}
          >
            <h2>{ispOwnerData.company}</h2>
          </div>

          <div className="container">
            <div className="d-flex justify-content-between p-1 m-1">
              <div className="text-justify">
                <p>
                  {t("name")} :
                  <strong style={{ marginLeft: "2.7rem" }}>
                    {customerData.name}
                  </strong>
                </p>
                <p>
                  {customerData.mobile && (
                    <span>
                      {t("mobile")} :
                      <strong style={{ marginLeft: ".7rem" }}>
                        {customerData.mobile}
                      </strong>
                    </span>
                  )}
                </p>
                <p>
                  {customerData.address && (
                    <span>
                      {t("address")} : {customerData.address}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p>
                  <span>{t("package")}:</span>
                  <strong style={{ marginLeft: "4rem" }}>
                    {customerData.userType === "simple-queue" ||
                    customerData.userType === "firewall-queue"
                      ? customerData.queue.package
                      : customerData.pppoe.profile}
                  </strong>
                </p>
                <p>
                  {t("paidDate")}:
                  <strong style={{ marginLeft: ".7rem" }}>
                    {moment(paymentDate).format("MMM DD YYYY")}
                  </strong>
                </p>
              </div>
            </div>

            <Table
              bordered
              className="text-center align-align"
              style={{ lineHeight: "9px" }}
            >
              <tbody>
                <tr>
                  <th>{t("billDhoron")}</th>
                  <td>
                    {billingData?.billType == "bill"
                      ? t("bill")
                      : t("connectionFee")}
                  </td>
                </tr>
                <tr>
                  <th>{t("amount")}</th>
                  <td> {billingData?.amount}</td>
                </tr>
                <tr>
                  <th>{t("due")}</th>
                  <td>{billingData.due ? billingData.due : 0}</td>
                </tr>
                <tr>
                  <th>{t("medium")}</th>
                  <td>{billingData?.medium}</td>
                </tr>
                <tr>
                  <th>{t("billingCycle")}</th>
                  <td>
                    {moment(billingData?.billingCycle).format("MMM DD YYYY")}
                  </td>
                </tr>
                <tr>
                  <th>{t("promiseDate")}</th>
                  <td>
                    {moment(billingData?.promiseDate).format("MMM DD YYYY")}
                  </td>
                </tr>
              </tbody>
            </Table>

            <div
              className="d-flex justify-content-between h4"
              style={{ marginTop: "1.8rem" }}
            >
              <div>
                <hr className="mb-1" />
                <p>{t("Proprietor")}</p>
              </div>

              <div>
                <hr className="mb-1" />
                <p>{t("customer")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
export default BillCollectInvoiceWithoutNote;
