import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FontColor, FourGround } from "../../../assets/js/theme";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { badge } from "../../../components/common/Utils";
import { getResellerCustomer } from "../../../features/resellerCustomerAdminApi";
import useDash from "../../../assets/css/dash.module.css";
import Table from "../../../components/table/Table";
import {
  ArchiveFill,
  CashStack,
  PenFill,
  PersonFill,
  ThreeDots,
  Wallet,
} from "react-bootstrap-icons";
import ResellerCustomerDetails from "../resellerModals/resellerCustomerModal";
import CustomerReport from "../../Customer/customerCRUD/showCustomerReport";
import { deleteACustomer } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";
import ResellerCustomerEdit from "../resellerModals/ResellerCustomerEdit";
import { useTranslation } from "react-i18next";
import CustomerDelete from "../resellerModals/CustomerDelete";

// get specific customer

const ResellerCustomer = () => {
  const { t } = useTranslation();
  const [singleCustomer, setSingleCustomer] = useState("");
  // get specific customer Report
  const [customerReportId, setcustomerReportId] = useState([]);

  // delete state
  const [isDelete, setIsDeleting] = useState(false);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  // get id from route
  const { resellerId } = useParams();

  // import dispatch
  const dispatch = useDispatch();

  // get all data from redux state
  let resellerCustomer = useSelector(
    (state) => state?.persistedReducer?.resellerCustomer?.resellerCustomer
  );

  // loading local state
  const [isLoading, setIsLoading] = useState(false);

  // status local state
  const [filterStatus, setFilterStatus] = useState(null);

  // payment status state
  const [filterPayment, setFilterPayment] = useState(null);

  const [customerId, setCustomerId] = useState();

  // check mikrotik checkbox
  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  // get all reseller customer api call
  useEffect(() => {
    getResellerCustomer(dispatch, resellerId, setIsLoading);
  }, []);

  // cutomer delete
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);

    setCustomerId(customerId);
  };

  // status filter
  if (filterStatus && filterStatus !== t("status")) {
    if (filterStatus !== "all") {
      resellerCustomer = resellerCustomer.filter(
        (value) => value.status === filterStatus
      );
    }
  }

  // payment status filter
  if (filterPayment && filterPayment !== t("payment")) {
    resellerCustomer = resellerCustomer.filter(
      (value) => value.paymentStatus === filterPayment
    );
  }

  // get specific customer
  const getSpecificCustomer = (id) => {
    setSingleCustomer(id);
  };

  // get specific customer Report
  const getSpecificCustomerReport = (reportData) => {
    setcustomerReportId(reportData);
  };

  // table column
  const columns = React.useMemo(
    () => [
      {
        Header: t("id"),
        accessor: "customerId",
        width: "9%",
      },
      {
        Header: t("name"),
        accessor: "name",
        width: "10%",
      },
      {
        Header: "PPPoE",
        accessor: "pppoe.name",
        width: "10%",
      },
      {
        Header: t("mobile"),
        accessor: "mobile",
        width: "12%",
      },

      {
        width: "9%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "11%",
        Header: t("paymentFilter"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "11%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "10%",
        Header: t("month"),
        accessor: "monthlyFee",
      },
      {
        width: "11%",

        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MM DD YYYY hh:mm a");
        },
      },

      {
        width: "7%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#resellerCustomerModalDetails"
                  onClick={() => {
                    getSpecificCustomer(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PersonFill />
                      <p className="actionP">{t("profile")}</p>
                    </div>
                  </div>
                </li>

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#CustomerEditModal"
                  onClick={() => {
                    getSpecificCustomer(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#showCustomerReport"
                  onClick={() => {
                    getSpecificCustomerReport(original);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CashStack />
                      <p className="actionP">{t("report")}</p>
                    </div>
                  </div>
                </li>

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#customerDelete"
                  onClick={() => {
                    customerDelete(original.id);
                  }}
                >
                  <div className="dropdown-item">
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

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle"> {t("customer")} </h2>
              </FourGround>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-row justify-content-center">
                    {/* status filter */}
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(event) => setFilterStatus(event.target.value)}
                    >
                      <option selected value="all">
                        {" "}
                        {t("status")}{" "}
                      </option>
                      <option value="active"> {t("active")} </option>
                      <option value="inactive"> {t("in active")} </option>
                      <option value="expired"> {t("expired")} </option>
                    </select>
                    {/* end status filter */}

                    {/* payment status filter */}
                    <select
                      className="form-select ms-4"
                      aria-label="Default select example"
                      onChange={(event) => setFilterPayment(event.target.value)}
                    >
                      <option selected> {t("paymentFilter")} </option>
                      <option value="paid"> {t("paid")} </option>
                      <option value="unpaid"> {t("unpaid")} </option>
                    </select>
                    {/* end payment status filter */}
                  </div>
                  {isDelete ? (
                    <div className="deletingAction">
                      <Loader /> <b>Deleting...</b>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* call table component */}
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={resellerCustomer}
                    />
                  </div>
                </div>
              </div>
            </FontColor>
          </div>
        </div>
      </div>
      <ResellerCustomerDetails single={singleCustomer} />
      <CustomerReport hideReportDelete={true} single={customerReportId} />
      <ResellerCustomerEdit allCustomer={false} customerId={singleCustomer} />
      <CustomerDelete
        customerId={customerId}
        mikrotikCheck={mikrotikCheck}
        setMikrotikCheck={setMikrotikCheck}
      />
    </>
  );
};

export default ResellerCustomer;
