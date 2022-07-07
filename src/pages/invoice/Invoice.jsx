import React, { useEffect, useState } from "react";
import "../Customer/customer.css";
import "./invoice.css";
import moment from "moment";
// import { Link } from "react-router-dom";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

// internal imports
import Footer from "../../components/admin/footer/Footer";
import { FontColor, FourGround } from "../../assets/js/theme";

import { getInvoices } from "../../features/apiCalls";
import { showModal } from "../../features/uiSlice";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import { useTranslation } from "react-i18next";

function Invoice() {
  const { t } = useTranslation();
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  const invoices = useSelector(
    (state) => state?.persistedReducer?.invoice?.invoices
  );

  useEffect(() => {
    getInvoices(dispatch, ispOwnerId, setIsloading);
  }, [dispatch, ispOwnerId]);

  const columns2 = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "16%",
        Header: t("type"),
        accessor: "reseller.name",
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
        width: "16%",
        Header: t("amount"),
        accessor: "amount",
        Cell: ({ row: { original } }) => <td>{original.amount} Tk</td>,
      },
      {
        width: "16%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },

      {
        width: "26%",
        Header: t("invoiceDate"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YYYY hh:mm:ss A");
        },
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
            {original.status === "unpaid" ? (
              <span
                style={{ cursor: "pointer" }}
                className="badge bg-warning text-dark shadow"
                onClick={() => {
                  dispatch(showModal(original));
                }}
              >
                Pay ৳
              </span>
            ) : (
              ""
            )}
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
                <h2 className="collectorTitle"> {t("invoice")} </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  {/* table */}
                  <div className="table-section">
                    <Table data={invoices} columns={columns2}></Table>
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
