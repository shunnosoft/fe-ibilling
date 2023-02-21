import moment from "moment";
import React, { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { badge } from "../../../components/common/Utils";
import Table from "../../../components/table/Table";
import { getInactiveCustomer } from "../../../features/apiCalls";

const Inactive = ({ ispOwnerId, year, month }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // get inactive customer
  const customer = useSelector(
    (state) => state.dashboardInformation?.inactiveCustomer
  );

  //column for table
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
    getInactiveCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [month]);

  return (
    <div
      className="modal fade"
      id="inactiveCustomer"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("inactiveCustomer")}
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
                data={customer}
              ></Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inactive;
