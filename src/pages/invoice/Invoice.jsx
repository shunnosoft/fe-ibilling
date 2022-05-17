import React, { useEffect, useState } from "react";
import "../Customer/customer.css";
import "./invoice.css";
import moment from "moment";
// import { Link } from "react-router-dom";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import {
  PersonPlusFill,
  Wallet,
  ThreeDots,
  ArchiveFill,
  PenFill,
  PersonFill,
  ArrowDownUp,
  CashStack,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";

import Loader from "../../components/common/Loader";
import TdLoader from "../../components/common/TdLoader";
import Pagination from "../../components/Pagination";

import { getInvoices, initiatePayment } from "../../features/apiCalls";
import { showModal } from "../../features/uiSlice";
import Table from "../../components/table/Table";

function Invoice() {
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const invoices = useSelector(
    (state) => state.persistedReducer.invoice.invoices
  );

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [customerPerPage, setCustomerPerPage] = useState(50);
  const lastIndex = currentPage * customerPerPage;
  const firstIndex = lastIndex - customerPerPage;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getInvoices(dispatch, ispOwnerId, setIsloading);
  }, [dispatch, ispOwnerId]);

  // const payNowHandler = (invoice) => {
  //   initiatePayment(invoice);
  // };

  const columns2 = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "টাইপ",
        accessor: "reseller.name",
        Cell: ({ row: { val } }) => (
          <td>
            {val.type === "registration"
              ? "রেজিস্ট্রেশন"
              : val.type === "migration"
              ? "প্যাকেজ মাইগ্রেশন"
              : val.type === "smsPurchase"
              ? "এসএমএস"
              : "মাসিক ফি"}
          </td>
        ),
      },
      {
        Header: "	পরিমাণ",
        accessor: "amount",
        Cell: ({ row: { val } }) => <td>{val.amount} Tk</td>,
      },
      {
        Header: "স্ট্যাটাস",
        accessor: "status",
        Cell: ({ row: { val } }) => (
          <td>
            {val.status === "unpaid" ? (
              <span className="p-1 mb-1 bg-danger text-white">
                {val.status}
              </span>
            ) : (
              <span className="p-1 mb-1 bg-success text-white">
                {val.status}{" "}
              </span>
            )}
          </td>
        ),
      },

      {
        Header: "ইনভয়েস তৈরির তারিখ",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YYYY hh:mm:ss A");
        },
      },
      {
        Header: "পেমেন্টের শেষ তারিখ",
        accessor: "dueDate",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YYYY hh:mm:ss A");
        },
      },
      {
        Header: () => <div className="text-center">অ্যাকশন</div>,
        id: "option",

        Cell: ({ row: { val } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="areaDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <td>
              {val.status === "unpaid" ? (
                <div className="AcceptRejectBtn">
                  <button
                    onClick={() => {
                      dispatch(showModal(val));
                      // payNowHandler(val);
                    }}
                  >
                    <strong>Pay Now</strong>
                  </button>
                </div>
              ) : (
                ""
              )}
            </td>
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
                <h2 className="collectorTitle">ইনভয়েস </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  {/* table */}
                  <Table data={invoices} columns={columns2}></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}

export default Invoice;
