import React, { useMemo } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  deleteNetFeeCustomer,
  netFeeCustomerGet,
} from "../../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import { badge } from "../../../../components/common/Utils";
import moment from "moment";
import Table from "../../../../components/table/Table";
import { ArchiveFill, ThreeDots } from "react-bootstrap-icons";
import IndeterminateCheckbox from "../../../../components/table/bulkCheckbox";
import BulkOptions from "../../../Customer/customerCRUD/bulkOpration/BulkOptions";

const NetFeeCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwnerId & mikrotikId from params
  const { ispOwnerId, mikrotikId } = useParams();

  // states
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  //---> Bulk customer
  const [bulkCustomers, setBulkCustomer] = useState([]);

  // get data from redux
  const allUsers = useSelector((state) => state.crossCustomer.netFeeCustomer);

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
    netFeeCustomerGet(mikrotikId, ispOwnerId, setIsLoading, dispatch);
  }, [mikrotikId]);

  return (
    <>
      <div className="collectorWrapper mt-2 py-2">
        <div className="addCollector">
          <div className="table-section">
            <Table
              isLoading={isLoading}
              columns={columns}
              data={allUsers}
              bulkLength={bulkCustomers?.length}
              bulkState={{
                setBulkCustomer,
              }}
            ></Table>
          </div>
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
