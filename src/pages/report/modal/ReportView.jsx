import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const ReportView = ({ reportId, status }) => {
  const { t } = useTranslation();

  let report = useSelector((state) =>
    status === "resellerCustomerReport"
      ? state.reseller?.resellerCollection
      : status === "resellerCollection"
      ? state.payment?.allBills
      : state.payment?.allBills
  );

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  const data = report.find((item) => item.id === reportId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // customer current package find
  const getCustomerPackage = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
  };

  return (
    <div
      className="modal fade"
      id="reportView"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("viewReport")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex justify-content-between">
              <div>
                <p>
                  <b>{t("ID")} </b> {data?.customer?.customerId}
                </p>
                <p>
                  <b>{t("name")}</b> {data?.customer?.name}
                </p>
                <p>
                  <b>{t("package")}</b>{" "}
                  {status === "resellerCollection"
                    ? getCustomerPackage(data?.customer?.mikrotikPackage)?.name
                    : data.customer?.mikrotikPackage?.name}
                </p>
                <p>
                  <b>{t("bill")}</b> {data?.amount}
                </p>
                <p>
                  <b>{t("due")}</b> {data?.due}
                </p>
              </div>
              <div>
                <p>
                  <b>{t("agent")}</b> {data?.medium}
                </p>
                <p>
                  <b>{t("collector")}</b> {data?.name}
                </p>
                <p>
                  <b>{t("startDate")} </b>
                  {moment(data?.start).format("ll")}
                </p>
                <p>
                  <b>{t("endDate")} </b>
                  {moment(data?.end).format("ll")}
                </p>
                <p>
                  <b>{t("month")}</b> {data?.month}
                </p>
              </div>
            </div>
            <br />
            <p>
              <b>{t("note")} </b> {data?.note}
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportView;
