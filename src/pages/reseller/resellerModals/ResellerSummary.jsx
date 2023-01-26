import React, { useEffect, useMemo, useState } from "react";
import "../reseller.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getResellerData } from "../../../features/resellerDataApi";
import { useDispatch } from "react-redux";
import Table from "../../../components/table/Table";
import FormatNumber from "../../../components/common/NumberFormat";

export default function ({ resellerId, resellerName }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get reseller data
  const data = useSelector((state) => state.resellerData.data);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (resellerId) {
      getResellerData(ispOwnerId, resellerId, setIsLoading, dispatch);
    }
  }, [resellerId]);

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "5%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },

      {
        width: "10%",
        Header: t("customer"),
        accessor: "customerCount",
      },

      {
        width: "10%",
        Header: t("paid"),
        accessor: "paidCustomer",
      },
      {
        width: "10%",
        Header: t("unpaid"),
        accessor: "unpaidCustomer",
      },

      {
        width: "10%",
        Header: t("package"),
        accessor: "packageName",
      },
      {
        width: "10%",
        Header: t("rate"),
        accessor: "packageRate",
      },
      {
        width: "10%",
        Header: t("isp"),
        accessor: "ispOwnerRate",
      },
      {
        width: "10%",
        Header: t("reseller"),
        accessor: "resellerRate",
      },
    ],
    [t]
  );

  //total monthly fee and due calculation
  const summaryCalculation = useMemo(() => {
    const initialValue = {
      totalPackageRate: 0,
      totalIspCommission: 0,
      totalResellerCommission: 0,
    };

    const calculatedValue = data.reduce((previous, current) => {
      // sum of all package rate
      previous.totalPackageRate += current.packageRate;

      // sum of all isp owner commission
      previous.totalIspCommission += current.ispOwnerRate;

      // sum of all reseller commission
      previous.totalResellerCommission += current.resellerRate;

      return previous;
    }, initialValue);
    return calculatedValue;
  }, [data]);

  //custom table header component
  const customComponent = (
    <div className="text-center" style={{ fontSize: "18px", display: "flex" }}>
      {t("rate")}&nbsp; {FormatNumber(summaryCalculation?.totalPackageRate)}
      &nbsp;
      {t("tk")} &nbsp; {t("isp")}&nbsp;
      {FormatNumber(summaryCalculation?.totalIspCommission)} &nbsp;{t("tk")}
      &nbsp;&nbsp;
      {t("reseller")}&nbsp;
      {FormatNumber(summaryCalculation?.totalResellerCommission)} &nbsp;
      {t("tk")} &nbsp;
    </div>
  );

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="resellerSummary"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              <span className="text-primary">{resellerName}</span>{" "}
              {t("resellerSummary")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="table-section">
              <Table
                isLoading={isLoading}
                customComponent={customComponent}
                columns={columns}
                data={data}
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
