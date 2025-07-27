import React from "react";
import moment from "moment";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
import { App } from "react-bootstrap-icons";

const CustomerInvoicePrint = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { invoiceData, ispOwnerData } = props;

  return (
    <>
      <div ref={ref}>
        {invoiceData?.status === "both" && (
          <>
            <div className="text-center mb-1">{t("officeCopy")}</div>

            <div className="container">
              <div
                className="text-center text-white fw-bold p-1"
                style={{ borderRadius: "10px", backgroundColor: "#4A9782" }}
              >
                <h2 className="mt-1">{ispOwnerData?.company}</h2>
                {ispOwnerData?.address && (
                  <p>
                    {t("address")} : {ispOwnerData?.address}
                  </p>
                )}
              </div>
              <div className="d-flex justify-content-between p-1 m-1">
                <div>
                  <p>
                    {t("name")} :
                    <strong style={{ marginLeft: ".7rem" }}>
                      {invoiceData?.name}
                    </strong>
                  </p>
                  <p>
                    {invoiceData?.mobile && (
                      <span>
                        {t("mobile")} :
                        <strong style={{ marginLeft: ".7rem" }}>
                          {invoiceData.mobile}
                        </strong>
                      </span>
                    )}
                  </p>
                  <p>
                    {invoiceData?.address && (
                      <span>
                        {t("address")} : {invoiceData.address}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  {invoiceData?.package && (
                    <span>
                      {t("package")} :
                      <strong style={{ marginLeft: ".7rem" }}>
                        {invoiceData?.package}
                      </strong>
                    </span>
                  )}
                  <p>
                    {t("invoiceDate")}:
                    <strong style={{ marginLeft: ".7rem" }}>
                      {moment(invoiceData?.createdAt).format("MMM DD YYYY")}
                    </strong>
                  </p>
                </div>
              </div>

              <Table
                bordered
                className="text-center align-center"
                style={{ lineHeight: "4px" }}
              >
                <tbody>
                  <tr>
                    <th>{t("billType")}</th>
                    <td>
                      {invoiceData?.billType == "bill"
                        ? t("bill")
                        : t("connectionFee")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("amount")}</th>
                    <td> {invoiceData?.amount}</td>
                  </tr>
                  <tr>
                    <th>{t("due")}</th>
                    <td>{invoiceData?.due}</td>
                  </tr>
                  <tr>
                    <th>{t("discount")}</th>
                    <td>{invoiceData?.discount}</td>
                  </tr>
                  <tr>
                    <th>{t("note")}</th>
                    <td>{invoiceData?.note}</td>
                  </tr>
                  <tr>
                    <th>{t("medium")}</th>
                    <td>{invoiceData?.medium}</td>
                  </tr>
                  <tr>
                    <th>{t("billingCycle")}</th>
                    <td>
                      {moment(invoiceData?.billingCycle).format("MMM DD YYYY")}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("status")}</th>
                    <td>
                      {<App className="me-1" style={{ marginTop: "-5px" }} />}
                      {t("paid")}{" "}
                      {
                        <App
                          className="ms-2 me-1"
                          style={{ marginTop: "-5px" }}
                        />
                      }
                      {t("unpaid")}
                    </td>
                  </tr>
                </tbody>
              </Table>

              <div
                className="d-flex justify-content-between h5"
                style={{ marginTop: "1rem" }}
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

              <div>
                <hr className="mb-4 mt-4" style={{ borderStyle: "dotted" }} />
              </div>
            </div>
          </>
        )}

        <div>
          <div className="text-center mb-1 ">{t("customerCopy")}</div>

          <div className="container">
            <div
              className="text-center text-white fw-bold p-1 "
              style={{ borderRadius: "10px", backgroundColor: "#4A9782" }}
            >
              <h2 className="mt-1">{ispOwnerData?.company}</h2>
              {ispOwnerData?.address && (
                <p>
                  {t("address")} : {ispOwnerData?.address}
                </p>
              )}
            </div>

            <div className="d-flex justify-content-between p-1 m-1">
              <div className="text-justify">
                <p>
                  {t("name")} :
                  <strong style={{ marginLeft: ".7rem" }}>
                    {invoiceData?.name}
                  </strong>
                </p>
                <p>
                  {invoiceData?.mobile && (
                    <span>
                      {t("mobile")} :
                      <strong style={{ marginLeft: ".7rem" }}>
                        {invoiceData.mobile}
                      </strong>
                    </span>
                  )}
                </p>
                <p>
                  {invoiceData?.address && (
                    <span>
                      {t("address")} : {invoiceData.address}
                    </span>
                  )}
                </p>
              </div>
              <div>
                {invoiceData?.package && (
                  <span>
                    {t("package")} :
                    <strong style={{ marginLeft: ".7rem" }}>
                      {invoiceData?.package}
                    </strong>
                  </span>
                )}
                <p>
                  {t("invoiceDate")}:
                  <strong style={{ marginLeft: ".7rem" }}>
                    {moment(invoiceData?.createdAt).format("MMM DD YYYY")}
                  </strong>
                </p>
              </div>
            </div>

            <Table
              bordered
              className="text-center align-align"
              style={{ lineHeight: "4px" }}
            >
              <tbody>
                <tr>
                  <th>{t("billType")}</th>
                  <td>
                    {invoiceData?.billType == "bill"
                      ? t("bill")
                      : t("connectionFee")}
                  </td>
                </tr>
                <tr>
                  <th>{t("amount")}</th>
                  <td> {invoiceData?.amount}</td>
                </tr>
                <tr>
                  <th>{t("due")}</th>
                  <td>{invoiceData?.due}</td>
                </tr>
                <tr>
                  <th>{t("discount")}</th>
                  <td>{invoiceData?.discount}</td>
                </tr>
                <tr>
                  <th>{t("note")}</th>
                  <td>{invoiceData?.note}</td>
                </tr>
                <tr>
                  <th>{t("medium")}</th>
                  <td>{invoiceData?.medium}</td>
                </tr>
                <tr>
                  <th>{t("billingCycle")}</th>
                  <td>
                    {moment(invoiceData?.billingCycle).format("MMM DD YYYY")}
                  </td>
                </tr>
                <tr>
                  <th>{t("status")}</th>
                  <td>
                    {<App className="me-1" style={{ marginTop: "-5px" }} />}
                    {t("paid")}{" "}
                    {
                      <App
                        className="ms-2 me-1"
                        style={{ marginTop: "-5px" }}
                      />
                    }
                    {t("unpaid")}
                  </td>
                </tr>
              </tbody>
            </Table>

            <div
              className="d-flex justify-content-between h5"
              style={{ marginTop: "1rem" }}
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
export default CustomerInvoicePrint;
