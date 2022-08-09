// external imports
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
// internal imports
import "chart.js/auto";
import { FontColor } from "../../assets/js/theme";
import {
  PersonBoundingBox,
  PersonFill,
  PenFill,
  ThreeDots,
  CardChecklist,
  PrinterFill,
} from "react-bootstrap-icons";
import { getIspOwners } from "../../features/apiCallAdmin";
import Table from "../../components/table/Table";
import EditModal from "./modal/EditModal";
import "./home.css";
import DetailsModal from "./modal/DetailsModal";
import Note from "./modal/Note";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import CustomerPdf from "./CustomerPDF";
import apiLink from "../../api/apiLink";
import PrintCustomer from "./CustomerPDF";

export default function Home() {
  //print customer ref
  // const componentRef = useRef();

  // loading
  const [isLoading, setIsLoading] = useState(false);
  // import dispatch
  const dispatch = useDispatch();

  // set owner at local state
  const [ownerId, setOwnerId] = useState();

  // set owner name
  const [companyName, setCompanyName] = useState();

  // set filter status
  const [filterStatus, setFilterStatus] = useState(null);

  // get isp owner
  let ispOwners = useSelector((state) => state.admin?.ispOwners);

  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  // payment filter
  if (filterStatus && filterStatus !== "All") {
    ispOwners = ispOwners.filter(
      (value) => value.bpSettings.paymentStatus === filterStatus
    );
  }

  // api call
  useEffect(() => {
    if (!ispOwners.length) getIspOwners(dispatch, setIsLoading);
  }, []);

  // edit modal method
  const editModal = (ispOwnerId) => {
    setOwnerId(ispOwnerId);
  };

  // details modal handle
  const detailsModal = (showDetailsId) => {
    setOwnerId(showDetailsId);
  };

  const noteModal = (noteId, companyName) => {
    setOwnerId(noteId);
    setCompanyName(companyName);
  };

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "5%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },

      {
        width: "15%",
        accessor: "company",
        Header: "Comapny",
      },

      {
        width: "12%",
        accessor: "name",
        Header: "Name",
      },
      {
        width: "10%",
        accessor: "mobile",
        Header: "Mobile",
      },
      {
        width: "5%",
        accessor: "bpSettings.hasMikrotik",
        Header: "MTK",
        Cell: ({ cell: { value } }) => {
          return value ? "" : "NO";
        },
      },
      {
        width: "5%",
        accessor: "smsBalance",
        Header: "SMS",
      },
      {
        width: "5%",
        accessor: "bpSettings.customerLimit",
        Header: "Customer",
      },
      {
        width: "5%",
        accessor: "bpSettings.packageRate",
        Header: "Rate",
      },

      {
        width: "15%",
        accessor: "address",
        Header: "Address",
      },
      {
        width: "5%",
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
                (original.bpSettings.paymentStatus === "paid"
                  ? "bg-success"
                  : "bg-warning")
              }
            >
              {original.bpSettings.paymentStatus}
            </span>
          </div>
        ),
      },

      {
        width: "8%",
        Header: "CreatedAt",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD MMM YY hh:mm a");
        },
      },

      {
        width: "8%",
        Header: "Bill Date",
        accessor: "bpSettings.monthlyDueDate",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD MMM YY hh:mm a");
        },
      },

      {
        width: "5%",
        Header: () => <div className="text-center">Action</div>,
        id: "option",

        Cell: ({ row: { original } }) => {
          const componentRef = useRef();
          return (
            <div className="text-center">
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
                    data-bs-target="#showCustomerDetails"
                    onClick={() => {
                      detailsModal(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PersonFill />
                        <p className="actionP">Details</p>
                      </div>
                    </div>
                  </li>

                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#clientEditModal"
                    onClick={() => {
                      editModal(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PenFill />
                        <p className="actionP">Edit</p>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <PersonBoundingBox />
                        <Link
                          to={
                            "/admin/isp-owner/invoice-list/" +
                            original.id +
                            "?company=" +
                            original.company
                          }
                        >
                          <p className="actionP text-white">Invoice</p>
                        </Link>
                      </div>
                    </div>
                  </li>
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#clientNoteModal"
                    onClick={() => {
                      noteModal(original.id, original.company);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CardChecklist />
                        <p className="actionP">Note</p>
                      </div>
                    </div>
                  </li>
                  {/* <li>
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ReactToPrint
                          documentTitle={`${original.name} customer list`}
                          trigger={() => (
                            <div>
                              {" "}
                              <PrinterFill /> &nbsp; Download Customer
                            </div>
                          )}
                          content={() => componentRef.current}
                        />
                      </div>
                    </div>
                    <div style={{ display: "none" }}>
                      <PrintCustomer
                        customers={customer}
                        ref={componentRef}
                        ispOwnerData={original}
                      />
                    </div>
                  </li> */}
                </ul>
              </>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <>
      <div className="homeWrapper isp_owner_list">
        <ToastContainer position="top-right" theme="colored" />
        <div className="card">
          <div className="card-header">
            <div className="row">
              <h2 className="dashboardTitle text-center">
                {userRole === "admin" ? "Admin Dashborad" : "Super Admin"}
              </h2>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex">
              <select
                className="form-select mt-0 me-3"
                aria-label="Default select example"
                onChange={(event) => setFilterStatus(event.target.value)}
              >
                <option value="All" selected>
                  All
                </option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>
              <Link to={"/admin/all-comments"}>
                <div className="all-comment-btn">
                  <button className="btn btn-outline-success">
                    All Comment
                  </button>
                </div>
              </Link>
              &nbsp;
              {userRole === "superadmin" && (
                <Link to={"/admin/invoices"}>
                  <div className="all-comment-btn">
                    <button className="btn btn-outline-primary">Invoice</button>
                  </div>
                </Link>
              )}
            </div>

            <FontColor>
              <Table
                isLoading={isLoading}
                columns={columns}
                data={ispOwners}
              ></Table>

              <EditModal ownerId={ownerId} />
              <DetailsModal ownerId={ownerId} />
              <Note ownerId={ownerId} companyName={companyName} />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
