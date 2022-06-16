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
} from "react-bootstrap-icons";
import { getIspOwners } from "../../features/apiCallAdmin";
import Table from "../../components/table/Table";
import EditModal from "./modal/EditModal";
import "./home.css";
import DetailsModal from "./modal/DetailsModal";
import Note from "./modal/Note";

export default function Home() {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // import dispatch
  const dispatch = useDispatch();

  // set owner at local state
  const [ownerId, setOwnerId] = useState();

  // set owner name
  const [ownerName, setOwnerName] = useState();

  // set filter status
  const [filterStatus, setFilterStatus] = useState(null);

  // get isp owner
  let ispOwners = useSelector((state) => state.admin?.ispOwners);

  // payment filter
  if (filterStatus && filterStatus !== "Select") {
    ispOwners = ispOwners.filter(
      (value) => value.bpSettings.paymentStatus === filterStatus
    );
  }

  // api call
  useEffect(() => {
    getIspOwners(dispatch, setIsLoading);
  }, [dispatch]);

  // edit modal method
  const editModal = (ispOwnerId) => {
    setOwnerId(ispOwnerId);
  };

  // details modal handle
  const detailsModal = (showDetailsId) => {
    setOwnerId(showDetailsId);
  };

  const noteModal = (noteId, ownerName) => {
    setOwnerId(noteId);
    setOwnerName(ownerName);
  };

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
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "mobile",
        Header: "Mobile",
      },
      {
        accessor: "company",
        Header: "Comapny",
      },
      {
        accessor: "address",
        Header: "Address",
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
        Header: "CreatedAt",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YY hh:mm A");
        },
      },

      {
        Header: () => <div className="text-center">Action</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
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
                      <Link to={"/admin/isp-owner/invoice-list/" + original.id}>
                        <p className="actionP text-white">Invoice</p>
                      </Link>
                    </div>
                  </div>
                </li>
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#clientNoteModal"
                  onClick={() => {
                    noteModal(original.id, original.name);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <CardChecklist />
                      <p className="actionP">Note</p>
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
      <div className="homeWrapper isp_owner_list">
        <ToastContainer position="top-right" theme="colored" />
        <div className="card">
          <div className="card-header">
            <div className="row">
              <h2 className="dashboardTitle text-center">Admin Dashborad</h2>
            </div>
          </div>
          <div className="card-body">
            <div className="d-flex">
              <select
                className="form-select mt-0 me-3"
                aria-label="Default select example"
                onChange={(event) => setFilterStatus(event.target.value)}
              >
                <option selected>Select</option>
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
            </div>

            <FontColor>
              <Table
                isLoading={isLoading}
                columns={columns}
                data={ispOwners}
              ></Table>

              <EditModal ownerId={ownerId} />
              <DetailsModal ownerId={ownerId} />
              <Note ownerId={ownerId} ownerName={ownerName} />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
