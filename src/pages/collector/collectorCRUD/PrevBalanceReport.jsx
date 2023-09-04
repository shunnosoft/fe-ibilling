import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { collectorAllPrevBalance } from "../../../features/apiCalls";
import Table from "../../../components/table/Table";

const PrevBalanceReport = ({ collectorId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const allPrevBalance = useSelector((state) => state?.collector?.prevBalance);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (collectorId)
      collectorAllPrevBalance(dispatch, collectorId, setIsLoading);
  }, [collectorId]);

  const columns = useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "20%",
        Header: t("month"),
        accessor: "month",
      },

      {
        width: "18%",
        Header: t("year"),
        accessor: "year",
      },
      {
        width: "18%",
        Header: t("diposit"),
        accessor: "deposit",
      },
      {
        width: "18%",
        Header: t("billReport"),
        accessor: "billReport",
      },
      {
        width: "18%",
        Header: t("balance"),
        accessor: "balance",
      },
    ],
    [t]
  );

  return (
    <div
      className="modal fade"
      id="collectorPrevMonthBalance"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {/* {single?.name}  */}
              {t("previousBalance")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <Table
              isLoading={isLoading}
              columns={columns}
              data={allPrevBalance}
            ></Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrevBalanceReport;
