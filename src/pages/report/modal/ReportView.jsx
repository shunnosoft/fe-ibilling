import React from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// internal import
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const ReportView = ({ show, setShow, reportId, status }) => {
  const { t } = useTranslation();

  // get bill report status base form redux store
  let report = useSelector((state) =>
    status === "resellerCustomerReport"
      ? state.reseller?.resellerCollection
      : status === "resellerCollection"
      ? state.payment?.allBills
      : status === "resellerCollector"
      ? state.collector.collectorBill
      : state.payment?.allBills
  );
  console.log(report, reportId);

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // customer bill report find
  const data = report.find((item) => item._id === reportId);
  console.log(data);

  // customer current package find
  const getCustomerPackage = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={true}
        size={"md"}
        header={t("viewReport")}
      >
        <div className="report5_5 collectReport">
          <div className="reportOptions row gt-1">
            <p>
              <b>{t("ID")} </b> {data?.customer?.customerId}
            </p>
            <p>
              <b>{t("name")}</b> {data?.customer?.name}
            </p>
            <p>
              <b>{t("package")}</b>
              {status === "resellerCollection"
                ? getCustomerPackage(data?.customer?.mikrotikPackage)?.name
                : data?.customer?.mikrotikPackage?.name}
            </p>
            <p>
              <b>{t("bill")}</b> {data?.amount}
            </p>
            <p>
              <b>{t("due")}</b> {data?.due}
            </p>
          </div>
          <div className="reportOptions row gt-1">
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

        <div className="float-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default ReportView;
