import React, { useEffect, useMemo, useState } from "react";
import Table from "../../../../components/table/Table";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getPPPoEActiveCustomer,
  getStaticActiveCustomer,
} from "../../../../features/apiCalls";
import { Check2Circle } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { FourGround } from "../../../../assets/js/theme";
import { Tab, Tabs } from "react-bootstrap";
import useISPowner from "../../../../hooks/useISPOwner";

const AllCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwnerId and mikrotikId
  const { mikrotikId } = useParams();

  //---> Get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  // get all mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // mikrotik
  const configMikrotik = mikrotik.find((item) => item.id === mikrotikId);

  // get all user
  const allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);

  // get all static customer
  let staticActiveCustomer = useSelector(
    (state) => state?.customer?.staticActiveCustomer
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStatic, setIsLoadingStatic] = useState(false);

  useEffect(() => {
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: mikrotikId,
    };

    getPPPoEActiveCustomer(
      dispatch,
      IDs,
      configMikrotik?.name,
      setIsLoading,
      "mikrotikUser"
    );

    getStaticActiveCustomer(
      dispatch,
      ispOwnerId,
      mikrotikId,
      setIsLoadingStatic
    );
  }, []);

  // customer column
  const customerColumn = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "10%",
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
        width: "20%",
        Header: t("package"),
        accessor: "profile",
      },
      {
        width: "10%",
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
        width: "10%",
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
    ],
    [t]
  );

  // static customer column
  const staticColumn = useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "10%",
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
        width: "10%",
        Header: t("ipAddress"),
        accessor: "ipAddress",
      },
      {
        width: "8%",
        Header: "Upload",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {original?.bytes?.split("/")?.[0]
              ? original?.bytes?.split("/")?.[0] / 1024 / 1024 <= 1024
                ? (original?.bytes?.split("/")?.[0] / 1024 / 1024).toFixed(2) +
                  " MB"
                : (
                    original?.bytes?.split("/")?.[0] /
                    1024 /
                    1024 /
                    1024
                  ).toFixed(2) + " GB"
              : ""}
          </div>
        ),
      },
      {
        width: "8%",
        Header: "Download",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.bytes?.split("/")?.[1]
              ? original?.bytes?.split("/")?.[1] / 1024 / 1024 <= 1024
                ? (original?.bytes?.split("/")?.[1] / 1024 / 1024).toFixed(2) +
                  " MB"
                : (
                    original?.bytes?.split("/")?.[1] /
                    1024 /
                    1024 /
                    1024
                  ).toFixed(2) + " GB"
              : ""}
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <div className="collectorWrapper mt-2 p-2">
        <div className="addCollector">
          <FourGround>
            <Tabs id="uncontrolled-tab-example">
              {bpSettings?.customerType &&
                bpSettings.customerType.map((type) => {
                  const components = {
                    pppoe: (
                      <Table
                        isLoading={isLoading}
                        columns={customerColumn}
                        data={allMikrotikUsers}
                      ></Table>
                    ),
                    static: (
                      <Table
                        isLoading={isLoadingStatic}
                        columns={staticColumn}
                        data={staticActiveCustomer}
                      ></Table>
                    ),
                  };

                  return components[type] ? (
                    <Tab key={type} eventKey={type} title={t(type)}>
                      {components[type]}
                    </Tab>
                  ) : null;
                })}
            </Tabs>
          </FourGround>
        </div>
      </div>
    </>
  );
};

export default AllCustomer;
