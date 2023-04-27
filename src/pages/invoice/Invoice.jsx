import React, { useEffect, useRef, useState } from "react";
import "../Customer/customer.css";
import "./invoice.css";
import moment from "moment";
// import { Link } from "react-router-dom";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";

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

  const invoices = useSelector((state) => state?.invoice?.invoices);

  // invoice delete loading state
  const [deleteInvoiceLoading, setDeleteInvoiceLoading] = useState(false);

  const [mainData, setMainData] = useState([]);

  const [type, setType] = useState("");

  const [status, setStatus] = useState("");

  //date filter section
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  const dispatch = useDispatch();

  //get ISPOwner ID
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

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

  //invoices set to Main Data
  useEffect(() => {
    setMainData(invoices);
  }, [invoices]);

  //get invoices
  useEffect(() => {
    if (invoices.length === 0) getInvoices(dispatch, ispOwnerId, setIsloading);
  }, [dispatch, ispOwnerId]);

  //react memo
  const columns = React.useMemo(
    () => [
      {
        width: "9%",
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
        width: "13%",
        Header: t("invoiceDate"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      {
        width: "13%",
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
        Header: () => t("paidAt"),
        accessor: "paidAt",
        Cell: ({ cell: { value } }) => (
          <span>{value && moment(value).format("MMM DD YYYY hh:mm a")}</span>
        ),
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

  //filter handler
  const onClickFilter = () => {
    let arr = [...invoices];

    //date filter
    arr = arr.filter(
      (item) =>
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(dateStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(dateEnd).format("YYYY-MM-DD")).getTime()
    );

    //type filter
    if (type) {
      arr = arr.filter((item) => item.type === type);
    }

    //status Filter
    if (status) {
      arr = arr.filter((item) => item.status === status);
    }

    setMainData(arr);
  };

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
                {/* filter div */}
                <div className="selectFilteringg pt-2">
                  <select
                    className="form-select mx-2"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="" defaultValue>
                      {t("type")}
                    </option>

                    <option value="registration"> {t("registration")}</option>
                    <option value="migration"> {t("migration")} </option>
                    <option value="smsPurchase"> {t("smsPurchase")} </option>
                    <option value="monthlyServiceCharge">
                      {" "}
                      {t("monthlyServiceCharge")}{" "}
                    </option>
                  </select>

                  <select
                    className="form-select mx-2"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="" defaultValue>
                      {t("status")}
                    </option>

                    <option value="paid"> {t("paid")}</option>
                    <option value="unpaid"> {t("unpaid")} </option>
                  </select>

                  <div className="ms-2">
                    <DatePicker
                      className="form-control w-140 mt-2"
                      selected={dateStart}
                      onChange={(date) => setStartDate(date)}
                      dateFormat="MMM dd yyyy"
                      placeholderText={t("selectBillDate")}
                    />
                  </div>
                  <div className="mx-2">
                    <DatePicker
                      className="form-control w-140 mt-2"
                      selected={dateEnd}
                      onChange={(date) => setEndDate(date)}
                      dateFormat="MMM dd yyyy"
                      placeholderText={t("selectBillDate")}
                    />
                  </div>

                  <div>
                    <button
                      className="btn btn-outline-primary w-110 mt-2"
                      type="button"
                      onClick={onClickFilter}
                    >
                      {t("filter")}
                    </button>
                  </div>
                </div>

                <div style={{ display: "none" }}>
                  <PrintInvoice
                    currentCustomers={mainData}
                    ref={componentRef}
                  />
                </div>
                <div className="collectorWrapper ">
                  {/* table */}
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      data={mainData}
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
