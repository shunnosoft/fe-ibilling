import moment from "moment";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { badge } from "../../../components/common/Utils";
import Table from "../../../components/table/Table";
import { getPackageBasedCustomer } from "../../../features/resellerDataApi";

const PackagedCustomer = ({ packageId, resellerId, year, month }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get all packaged
  const packageBaseCustomer = useSelector(
    (state) => state.resellerData?.packageBasedCustomer
  );

  // customer loading state
  const [customerLoading, setCustomerLoading] = useState(false);
  useEffect(() => {
    if (packageId) {
      getPackageBasedCustomer(
        ispOwnerId,
        resellerId,
        packageId,
        year,
        month,
        setCustomerLoading,
        dispatch
      );
    }
  }, [packageId, month]);

  const column = React.useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "10%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "10%",
        Header: "PPPoE",
        accessor: "pppoe.name",
      },
      {
        width: "12%",
        Header: t("mobile"),
        accessor: "mobile",
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
        width: "10%",
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
        width: "10%",
        Header: t("month"),
        accessor: "monthlyFee",
      },
      {
        width: "9%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "11%",
        Header: t("date"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
    ],
    [t]
  );

  return (
    <div className="table-section">
      <Table
        isLoading={customerLoading}
        columns={column}
        data={packageBaseCustomer}
      ></Table>
    </div>
  );
};

export default PackagedCustomer;
