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
// get specific customer

const ResellerCustomer = () => {
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

  // loading local state
  const [isLoading, setIsLoading] = useState(false);

  // status local state
  const [filterStatus, setFilterStatus] = useState(null);

  // payment status state
  const [filterPayment, setFilterPayment] = useState(null);

  // get all data from redux state
  let resellerCustomer = useSelector(
    (state) => state?.persistedReducer?.resellerCustomer?.resellerCustomer
  );

  // get all reseller customer api call
  useEffect(() => {
    getResellerCustomer(dispatch, resellerId, setIsLoading);
  }, []);

  // status filter
  if (filterStatus && filterStatus !== "স্ট্যাটাস") {
    resellerCustomer = resellerCustomer.filter(
      (value) => value.status === filterStatus
    );
  }

  // payment status filter
  if (filterPayment && filterPayment !== "পেমেন্ট") {
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
  const columns = React.useMemo(
    () => [
      {
        Header: "আইডি",
        accessor: "customerId",
        width: "8%",
      },
      {
        Header: "নাম",
        accessor: "name",
        width: "10%",
      },
      {
        Header: "PPPoE",
        accessor: "pppoe.name",
        width: "10%",
      },
      {
        Header: "মোবাইল",
        accessor: "mobile",
        width: "12%",
      },

      {
        width: "9%",

        Header: "স্ট্যাটাস",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: "পেমেন্ট",
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        Header: "প্যাকেজ",
        accessor: "pppoe.profile",
      },
      {
        width: "10%",

        Header: "মাসিক ফি",
        accessor: "monthlyFee",
      },
      {
        width: "9%",

        Header: "ব্যালান্স",
        accessor: "balance",
      },
      {
        width: "12%",

        Header: "বিল সাইকেল",
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMMM DD YYYY hh:mm A");
        },
      },

      {
        width: "7%",

        Header: () => <div className="text-center">অ্যাকশন</div>,
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
                      <p className="actionP">প্রোফাইল</p>
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
                      <p className="actionP">এডিট</p>
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
                      <p className="actionP">রিপোর্ট</p>
                    </div>
                  </div>
                </li>

                <li
                  onClick={() => {
                    let con = window.confirm(
                      `${original.name} গ্রাহক ডিলিট করতে চান?`
                    );
                    con && deleteCustomer(original.id);
                  }}
                >
                  <div className="dropdown-item actionManager">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">ডিলিট</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    []
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
                <h2 className="collectorTitle">গ্রাহক </h2>
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
                      <option selected>স্ট্যাটাস</option>
                      <option value="active">এক্টিভ</option>
                      <option value="inactive">ইন-এক্টিভ</option>
                      <option value="expired">এক্সপায়ার্ড</option>
                    </select>
                    {/* end status filter */}

                    {/* payment status filter */}
                    <select
                      className="form-select ms-4"
                      aria-label="Default select example"
                      onChange={(event) => setFilterPayment(event.target.value)}
                    >
                      <option selected>পেমেন্ট</option>
                      <option value="paid">পেইড</option>
                      <option value="unpaid">আন-পেইড</option>
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
      <CustomerReport single={customerReportId} />
      <ResellerCustomerEdit customerId={singleCustomer} />
    </>
  );
};

export default ResellerCustomer;
