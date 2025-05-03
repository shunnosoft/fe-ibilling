import React, { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  deleteMikrotikCustomer,
  getExtraMikrotikCustomers,
  getStaticExtraMikrotikCustomers,
} from "../../../../features/apiCalls";
import Table from "../../../../components/table/Table";
import { useSelector } from "react-redux";
import { ArchiveFill, ThreeDots } from "react-bootstrap-icons";
import moment from "moment";
import { FourGround } from "../../../../assets/js/theme";
import { Tab, Tabs } from "react-bootstrap";
import useISPowner from "../../../../hooks/useISPOwner";

const MikrotikCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwnerId & mikrotikId from params
  const { mikrotikId } = useParams();

  //---> Get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  // loading sates
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // get data from redux
  const allUsers = useSelector((state) => state.crossCustomer.mikrotikCustomer);
  const queueUsers = useSelector(
    (state) => state.crossCustomer.mikrotikStaticCustomer
  );

  // customer delete handler
  const deleteCustomer = (name) => {
    const data = {
      mikrotikId,
      ispOwnerId,
      name,
    };

    const confirm = window.confirm(t("deleteCustomer"));
    if (confirm) {
      deleteMikrotikCustomer(dispatch, data, setDeleteLoading);
    }
  };

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
        width: "20%",
        Header: t("lastLoggedOut"),
        accessor: "lastLoggedOut",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.lastLoggedOut &&
              moment(original.lastLoggedOut).format("MMM DD YYYY hh:mm A")}
          </div>
        ),
      },
      {
        width: "8%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul
                className="dropdown-menu"
                aria-labelledby="pppoePackageDropdown"
              >
                <li
                  onClick={() => {
                    deleteCustomer(original.name);
                  }}
                >
                  <div className="dropdown-item actionManager">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">{t("delete")}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
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
        width: "20%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "50%",
        Header: t("ipAddress"),
        accessor: "target",
      },
      {
        width: "10%",
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
        width: "10%",
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

  useEffect(() => {
    // get data api call
    getExtraMikrotikCustomers(mikrotikId, ispOwnerId, setIsLoading, dispatch);

    getStaticExtraMikrotikCustomers(
      mikrotikId,
      ispOwnerId,
      setIsLoading,
      dispatch
    );
  }, [mikrotikId]);

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
                        data={allUsers}
                      ></Table>
                    ),
                    static: (
                      <Table
                        isLoading={isLoading}
                        columns={staticColumn}
                        data={queueUsers}
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

export default MikrotikCustomer;
