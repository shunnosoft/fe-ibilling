import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import Table from "../../components/table/Table";
import { ArchiveFill, PenFill, ThreeDots } from "react-bootstrap-icons";
import { getIspOwnerInvoice } from "../../features/apiCallAdmin";
import moment from "moment";
import InvoiceEditModal from "./modal/InvoiceEditModal";

const InvoiceList = () => {
  const [invoiceId, setInvoiceId] = useState("");
  // get supplier id in params
  const { ispOwnerId } = useParams();

  const dispatch = useDispatch();

  const invoiceList = useSelector((state) => state.ownerInvoice.ownerInvoice);

  const invoiceEditModal = (invoiceId) => {
    setInvoiceId(invoiceId);
    console.log(invoiceId);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
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
        Header: "Status",
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

  // dispatch data to api
  useEffect(() => {
    getIspOwnerInvoice(ispOwnerId, dispatch);
  }, []);

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />

      <FontColor>
        <Sidebar />
        <div className={useDash.dashboardWrapper}>
          <div className="container-fluied dashboardField">
            <div className="invoice">
              <h2 className="dashboardTitle">ISP Owner Invoice</h2>

              <div className="row"></div>
              <br />
              {invoiceList.length > 0 && (
                <Table columns={columns} data={invoiceList} />
              )}
            </div>
          </div>
        </div>
      </FontColor>
      <InvoiceEditModal invoiceId={invoiceId} />
    </>
  );
};

export default InvoiceList;
