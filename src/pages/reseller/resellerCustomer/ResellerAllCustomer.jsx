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

const AllResellerCustomer = () => {
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
  // get reseller
  const resellers = useSelector(
    (state) => state?.persistedReducer?.reseller.reseller
  );

  // import dispatch
  const dispatch = useDispatch();

  // loading local state
  const [isLoading, setIsLoading] = useState(false);

  // status local state
  const [filterStatus, setFilterStatus] = useState(null);

  // payment status state
  const [filterPayment, setFilterPayment] = useState(null);
  const [resellerId, setResellerId] = useState("");
  // get all data from redux state
  let resellerCustomer = useSelector(
    (state) => state?.persistedReducer?.resellerCustomer?.allResellerCustomer
  );
  // get all reseller customer api call
  useEffect(() => {
    getAllResellerCustomer(dispatch, ispOwner, setIsLoading);
  }, []);

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

  // table column
  const columns = useMemo(
    () => [
      {
        Header: t("id"),
        accessor: "customerId",
        width: "9%",
      },
      {
        Header: t("reseller"),
        accessor: "reseller.name",
        width: "12%",
      },
      {
        Header: t("name"),
        accessor: "name",
        width: "12%",
      },
      {
        Header: t("mobile"),
        accessor: "mobile",
        width: "12%",
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
        Header: t("payment"),
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
        width: "8%",
        Header: t("month"),
        accessor: "monthlyFee",
      },
      {
        width: "10%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "14%",
        Header: t("billingCycle"),
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
                  onClick={() => {
                    let con = window.confirm(
                      `${original.name} ${t("wantToDeleteCustomer")}`
                    );
                    con && deleteCustomer(original.id);
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
                        {t("payment")}{" "}
                      </option>
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
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={resellerCustomer}
                  />
                </div>
              </div>
            </FontColor>
          </div>
        </div>
      </div>
      <ResellerCustomerDetails single={singleCustomer} />
      <CustomerReport hideReportDelete={true} single={customerReportId} />
      <ResellerCustomerEdit allCustomer={true} customerId={singleCustomer} />
    </>
  );
};

export default AllResellerCustomer;
