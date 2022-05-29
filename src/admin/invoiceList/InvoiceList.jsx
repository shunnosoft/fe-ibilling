import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import Table from "../../components/table/Table";
import { PenFill, ThreeDots } from "react-bootstrap-icons";
import { getIspOwnerInvoice } from "../../features/apiCallAdmin";
import InvoiceEditModal from "./modal/InvoiceEditModal";

const InvoiceList = () => {
  // import dispatch
  const dispatch = useDispatch();

  // get owner id in params
  const { ispOwnerId } = useParams();

  // set invoice id
  const [invoiceId, setInvoiceId] = useState("");

  // get invoice list
  const invoiceList = useSelector((state) => state.ownerInvoice?.ownerInvoice);

  // invoice edit method
  const invoiceEditModal = (invoiceId) => {
    setInvoiceId(invoiceId);
  };

  // dispatch data to api
  useEffect(() => {
    getIspOwnerInvoice(ispOwnerId, dispatch);
  }, []);

  // table column
  const columns = React.useMemo(
    () => [
      {
        Header: "Serial",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },

      {
        accessor: "type",
        Header: "Type",
      },
      {
        accessor: "amount",
        Header: "Amount",
      },
      {
        accessor: "createdAt",
        Header: "Create Date",
        Cell: ({ row: { original } }) =>
          moment(original.createdAt).format("DD/MM/YYYY"),
      },
      {
        accessor: "dueDate",
        Header: "Due Date",
        Cell: ({ row: { original } }) =>
          moment(original.dueDate).format("DD/MM/YYYY"),
      },
      {
        Header: "Payment Status",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              className={
                "badge " +
                (original.status === "paid" ? "bg-success" : "bg-warning")
              }
            >
              {original.status}
            </span>
          </div>
        ),
      },

      {
        Header: () => <div className="text-center">Action</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <>
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="areaDropdown">
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#InvoiceEditModal"
                  onClick={() => {
                    invoiceEditModal(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">Edit</p>
                    </div>
                  </div>
                </li>
              </ul>
            </>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <FontColor>
        <Sidebar />
        <div className="isp_owner_invoice_list">
          <ToastContainer position="top-right" theme="colored" />
          <div className={useDash.dashboardWrapper}>
            <div className="card">
              <div className="card-header">
                <h2 className="dashboardTitle text-center">
                  ISP Owner Invoice
                </h2>
              </div>
              <div className="card-body">
                <div className="dashboardField">
                  <div className="invoice">
                    {invoiceList.length > 0 && (
                      <Table columns={columns} data={invoiceList} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FontColor>
      <InvoiceEditModal invoiceId={invoiceId} />
    </>
  );
};

export default InvoiceList;
