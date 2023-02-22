import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Table from "../../../components/table/Table";

const Reseller = () => {
  const { t } = useTranslation();

  // get reseller data
  const resellerData = useSelector(
    (state) => state.chart.customerStat.resellerStat
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  const column = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "23%",
        Header: t("balance"),
        accessor: "currentBalance",
      },
      {
        width: "23%",
        Header: t("billCollected"),
        accessor: "totalBillCollected",
      },
      {
        width: "23%",
        Header: t("billDue"),
        accessor: "totalDueAmount",
      },
    ],
    [t]
  );

  return (
    <div
      className="modal fade"
      id="resellerInformationModal"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("reseller")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {resellerData && (
              <div className="table-section">
                <Table
                  isLoading={isLoading}
                  columns={column}
                  data={resellerData}
                ></Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reseller;
