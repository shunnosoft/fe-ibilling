import React, { useEffect, useRef, useState } from "react";
import "../Customer/customer.css";
import "./invoice.css";
import moment from "moment";
// import { Link } from "react-router-dom";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";

import { deleteInvoice, getInvoices } from "../../features/apiCalls";
import { showModal } from "../../features/uiSlice";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import { useTranslation } from "react-i18next";
import ReactToPrint from "react-to-print";
import {
  ArrowClockwise,
  CurrencyDollar,
  PrinterFill,
  ThreeDots,
} from "react-bootstrap-icons";
import PrintInvoice from "./invoicePDF";
import Loader from "../../components/common/Loader";

function Invoice() {
  const { t } = useTranslation();
  const componentRef = useRef(); //reference of pdf export component
  const [isLoading, setIsloading] = useState(false);

  // invoice delete loading state
  const [deleteInvoiceLoading, setDeleteInvoiceLoading] = useState(false);

  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const invoices = useSelector((state) => state?.invoice?.invoices);

  // delete invoice
  const deleteInvoiceHandler = (invoiceId) => {
    const confirm = window.confirm(t("invoiceDelete"));
    if (confirm) {
      deleteInvoice(dispatch, invoiceId, setDeleteInvoiceLoading);
    }
  };

  // reload handler
  const reloadHandler = () => {
    getInvoices(dispatch, ispOwnerId, setIsloading);
  };

  useEffect(() => {
    if (invoices.length === 0) getInvoices(dispatch, ispOwnerId, setIsloading);
  }, [dispatch, ispOwnerId]);

  const columns = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "13%",
        Header: t("type"),
        Cell: ({ row: { original } }) => (
          <td>
            {original.type === "registration"
              ? t("registration")
              : original.type === "migration"
              ? t("packageMigration")
              : original.type === "smsPurchase"
              ? t("message")
              : t("monthFee")}
          </td>
        ),
      },
      {
        width: "15%",
        Header: t("smsType"),
        Cell: ({ row: { original } }) =>
          original?.type === "smsPurchase" ? original?.smsPurchaseType : "",
      },
      {
        width: "11%",
        Header: t("amount"),
        accessor: "amount",
        Cell: ({ row: { original } }) => <td>{original.amount} Tk</td>,
      },
      {
        width: "13%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },

      {
        width: "18%",
        Header: t("invoiceDate"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      {
        width: "18%",
        Header: () => t("dueDate"),
        accessor: "dueDate",
        Cell: ({ cell: { value } }) => (
          <span>
            {value ? moment(value).format("MMM DD YYYY hh:mm a") : ""}
          </span>
        ),
      },
      {
        width: "15%",
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
                {original.status === "unpaid" && (
                  <li
                    onClick={() => {
                      dispatch(showModal(original));
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CurrencyDollar />
                        <p className="actionP">Pay</p>
                      </div>
                    </div>
                  </li>
                )}
                {original.type === "smsPurchase" &&
                  original.status &&
                  "unpaid" && (
                    <li onClick={() => deleteInvoiceHandler(original.id)}>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <CurrencyDollar />
                          <p className="actionP">{t("delete")}</p>
                        </div>
                      </div>
                    </li>
                  )}
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("invoice")}</div>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>

                  <div className="addAndSettingIcon">
                    <ReactToPrint
                      documentTitle="গ্রাহক লিস্ট"
                      trigger={() => (
                        <PrinterFill
                          title={t("print")}
                          className="addcutmButton"
                        />
                      )}
                      content={() => componentRef.current}
                    />
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div style={{ display: "none" }}>
                  <PrintInvoice
                    currentCustomers={invoices}
                    ref={componentRef}
                  />
                </div>
                <div className="collectorWrapper mt-2 py-2">
                  {/* table */}
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      data={invoices}
                      columns={columns}
                    ></Table>
                  </div>
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
