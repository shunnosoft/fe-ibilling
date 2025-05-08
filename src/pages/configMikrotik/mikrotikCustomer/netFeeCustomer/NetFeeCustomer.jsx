import React, { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  deleteNetFeeCustomer,
  getNetFeeStaticCustomer,
  netFeeCustomerGet,
} from "../../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import { badge } from "../../../../components/common/Utils";
import moment from "moment";
import Table from "../../../../components/table/Table";
import { ArchiveFill, ThreeDots } from "react-bootstrap-icons";
import IndeterminateCheckbox from "../../../../components/table/bulkCheckbox";
import BulkOptions from "../../../Customer/customerCRUD/bulkOpration/BulkOptions";
import { FourGround } from "../../../../assets/js/theme";
import { Tab, Tabs } from "react-bootstrap";
import useISPowner from "../../../../hooks/useISPOwner";

const NetFeeCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwnerId & mikrotikId from params
  const { mikrotikId } = useParams();

  //---> Get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  // states
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  //---> Bulk customer
  const [bulkCustomers, setBulkCustomer] = useState([]);

  // get data from redux
  const allUsers = useSelector((state) => state.crossCustomer.netFeeCustomer);

  const netFeeStaticCustomer = useSelector(
    (state) => state.crossCustomer.netFeeStaticCustomer
  );

  // customer delete handler
  const deleteCustomer = (ispOwnerId, customerId) => {
    const data = {
      ispID: ispOwnerId,
      customerID: customerId,
      mikrotik: false,
    };
    const confirm = window.confirm(t("deleteCustomer"));
    if (confirm) {
      deleteNetFeeCustomer(dispatch, data, setDeleteLoading);
    }
  };

  // column for table
  const columns = useMemo(
    () => [
      {
        width: "2%",
        id: "selection",
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <IndeterminateCheckbox
            customeStyle={true}
            {...getToggleAllPageRowsSelectedProps()}
          />
        ),
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      {
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "12%",
        Header: t("PPPoE"),
        accessor: "pppoe.name",
      },

      {
        width: "10%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "12%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "10%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "10%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "20%",
        Header: t("date"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
      {
        width: "10%",
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
                    deleteCustomer(original.ispOwner, original.id);
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
        width: "10%",
        Header: t("ipAddress"),
        accessor: "queue.target",
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

  const bulkOptions = [
    {
      id: 12,
      name: "customerDelete",
      class: "bg-danger",
      isVisiable: true,
      icon: <i className="fas fa-trash-alt fa-xs" />,
      value: "customerDelete",
    },
  ];

  useEffect(() => {
    // get data api call
    bpSettings?.customerType.includes("pppoe") &&
      netFeeCustomerGet(mikrotikId, ispOwnerId, setIsLoading, dispatch);

    bpSettings?.customerType.includes("static") &&
      getNetFeeStaticCustomer(mikrotikId, ispOwnerId, setIsLoading, dispatch);
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
                        columns={columns}
                        data={allUsers}
                        bulkLength={bulkCustomers?.length}
                        bulkState={{
                          setBulkCustomer,
                        }}
                      ></Table>
                    ),
                    static: (
                      <Table
                        isLoading={isLoading}
                        columns={staticColumn}
                        data={netFeeStaticCustomer}
                        bulkLength={bulkCustomers?.length}
                        bulkState={{
                          setBulkCustomer,
                        }}
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

      {/* bulk options modal  */}
      <BulkOptions
        bulkCustomers={bulkCustomers}
        pageOption={bulkOptions}
        page="extra-user"
      />
    </>
  );
};

export default NetFeeCustomer;
