import React, { useEffect, useMemo, useState } from "react";
import {
  ArchiveFill,
  CashStack,
  PenFill,
  PersonFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { FontColor, FourGround } from "../../../assets/js/theme";
import useDash from "../../../assets/css/dash.module.css";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import Loader from "../../../components/common/Loader";
import { deleteACustomer } from "../../../features/apiCalls";
import CustomerReport from "../../Customer/customerCRUD/showCustomerReport";
import ResellerCustomerEdit from "../resellerModals/ResellerCustomerEdit";
import ResellerCustomerDetails from "../resellerModals/resellerCustomerModal";
import { badge } from "../../../components/common/Utils";
import moment from "moment";
import { getAllResellerCustomer } from "../../../features/resellerCustomerAdminApi";
import Table from "../../../components/table/Table";
import { ToastContainer } from "react-toastify";
import CustomerDelete from "../resellerModals/CustomerDelete";
import BulkCustomerReturn from "../resellerModals/BulkCustomerReturn";
import IndeterminateCheckbox from "../../../components/table/bulkCheckbox";

const AllResellerCustomer = () => {
  const { t } = useTranslation();
  const [singleCustomer, setSingleCustomer] = useState("");
  // get specific customer Report
  const [customerReportId, setcustomerReportId] = useState([]);

  // delete state
  const [isDelete, setIsDeleting] = useState(false);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  // get reseller
  const resellers = useSelector((state) => state?.reseller.reseller);

  // import dispatch
  const dispatch = useDispatch();

  // loading local state
  const [isLoading, setIsLoading] = useState(false);

  // status local state
  const [filterStatus, setFilterStatus] = useState(null);

  const [customerId, setCustomerId] = useState();

  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  // payment status state
  const [filterPayment, setFilterPayment] = useState(null);
  const [resellerId, setResellerId] = useState("");
  // get all data from redux state
  let resellerCustomer = useSelector(
    (state) => state?.resellerCustomer?.allResellerCustomer
  );
  // get all reseller customer api call
  useEffect(() => {
    if (ispOwner) getAllResellerCustomer(dispatch, ispOwner, setIsLoading);
  }, [ispOwner]);

  // cutomer delete
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);

    setCustomerId(customerId);
  };

  if (resellerId) {
    if (resellerId !== "all") {
      resellerCustomer = resellerCustomer.filter(
        (customer) => customer.reseller.id === resellerId
      );
    }
  }

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
    if (filterPayment !== "all") {
      resellerCustomer = resellerCustomer.filter(
        (value) => value.paymentStatus === filterPayment
      );
    }
  }

  // get specific customer
  const getSpecificCustomer = (id) => {
    setSingleCustomer(id);
  };

  // get specific customer Report
  const getSpecificCustomerReport = (reportData) => {
    setcustomerReportId(reportData);
  };

  // DELETE handler
  const deleteCustomer = async (ID) => {
    setIsDeleting(true);
    const IDs = {
      ispID: ispOwner,
      customerID: ID,
    };
    deleteACustomer(dispatch, IDs, true);
    setIsDeleting(false);
  };
  //bulk-operations state
  const [bulkCustomer, setBulkCustomer] = useState([]);

  // table column
  const columns = useMemo(
    () => [
      {
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
        width: "2%",
      },
      {
        Header: t("id"),
        accessor: "customerId",
        width: "9%",
      },
      {
        Header: t("reseller"),
        accessor: "reseller.name",
        width: "11%",
      },
      {
        Header: t("name"),
        accessor: "name",
        width: "11%",
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
        width: "10%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "9%",
        Header: t("month"),
        accessor: "monthlyFee",
      },
      {
        width: "11%",
        Header: t("date"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
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
                      className="form-select me-3"
                      aria-label="Default select example"
                      onChange={(event) => setResellerId(event.target.value)}
                    >
                      <option selected value="all">
                        {t("allReseller")}
                      </option>
                      {resellers.map((reseller) => (
                        <option value={reseller.id}> {reseller.name} </option>
                      ))}
                    </select>
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
                      <option selected value="all">
                        {" "}
                        {t("paymentFilter")}{" "}
                      </option>
                      <option value="paid"> {t("paid")} </option>
                      <option value="unpaid"> {t("unpaid")} </option>
                    </select>
                    {/* end payment status filter */}
                  </div>
                  {/* call table component */}
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={resellerCustomer}
                      bulkState={{
                        setBulkCustomer,
                      }}
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
      <ResellerCustomerEdit allCustomer={true} customerId={singleCustomer} />
      <CustomerDelete
        customerId={customerId}
        mikrotikCheck={mikrotikCheck}
        setMikrotikCheck={setMikrotikCheck}
      />
      <BulkCustomerReturn
        modalId="returnCustomer"
        bulkCustomer={bulkCustomer}
        isAllCustomer={true}
      />
      {bulkCustomer.length > 0 && (
        <div className="bulkActionButton">
          <button
            className="bulk_action_button"
            title={t("returnCustomer")}
            data-bs-toggle="modal"
            data-bs-target="#returnCustomer"
            type="button"
            class="btn btn-dark btn-floating btn-sm"
          >
            <i class="fa-solid fa-right-left"></i>
            <span className="button_title"> {t("returnCustomer")} </span>
          </button>
        </div>
      )}
    </>
  );
};

export default AllResellerCustomer;
