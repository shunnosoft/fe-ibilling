import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { badge } from "../../../components/common/Utils";
import Table from "../../../components/table/Table";
import { getActiveCustomer } from "../../../features/apiCalls";

const Active = ({ ispOwnerId, month, year }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get active customer data
  const activeCustomer = useSelector(
    (state) => state.dashboardInformation?.activeCustomer
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  const column = useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "9%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "9%",
        Header: t("PPPoE"),
        accessor: "pppoe.name",
      },

      {
        width: "8%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "8%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "9%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "11%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
    ],
    [t]
  );

  useEffect(() => {
    getActiveCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [month]);

  return (
    <div
      className="modal fade"
      id="activeCustomer"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("activeCustomer")}
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
                columns={column}
                data={activeCustomer}
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Active;
