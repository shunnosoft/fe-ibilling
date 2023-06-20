import React, { useEffect, useState } from "react";
import Table from "../../../../components/table/Table";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchpppoeUser } from "../../../../features/apiCalls";
import { Check2Circle } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

const AllCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwnerId and mikrotikId
  const { ispOwnerId, mikrotikId } = useParams();

  // get all mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // mikrotik
  const configMikrotik = mikrotik.find((item) => item.id === mikrotikId);

  // get all user
  const allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: mikrotikId,
    };

    fetchpppoeUser(
      dispatch,
      IDs,
      configMikrotik?.name,
      setIsLoading,
      "mikrotikUser"
    );
  }, []);

  // customer column
  const customerColumn = React.useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "11%",
        Header: t("status"),
        accessor: "running",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.disabled ? (
              <Check2Circle color="red" />
            ) : (
              <Check2Circle color="green" />
            )}
          </div>
        ),
      },
      {
        width: "20%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "12%",
        Header: t("package"),
        accessor: "profile",
      },
      {
        width: "12%",
        Header: "RX",
        accessor: "rxByte",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {original?.rxByte
              ? (original?.rxByte / 1024 / 1024).toFixed(2) + " MB"
              : ""}
          </div>
        ),
      },
      {
        width: "12%",
        Header: "TX",
        accessor: "txByte",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {original?.txByte
              ? (original?.txByte / 1024 / 1024).toFixed(2) + " MB"
              : ""}
          </div>
        ),
      },
      {
        width: "25%",
        Header: "Last Link Up Time",
        accessor: "lastLinkUpTime",
      },
    ],
    [t]
  );
  return (
    <>
      <div className="collectorWrapper mt-2 py-2">
        <div className="addCollector">
          <div className="table-section">
            <Table
              isLoading={isLoading}
              columns={customerColumn}
              data={allMikrotikUsers}
            ></Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCustomer;
