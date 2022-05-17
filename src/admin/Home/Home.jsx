// external imports
import React, { useState, useEffect, useLayoutEffect } from "react";
import { ToastContainer } from "react-toastify";
import "chart.js/auto";
import { Link } from "react-router-dom";
// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { ArchiveFill, PenFill, ThreeDots } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { getIspOwners } from "../../features/apiCallAdmin";
import Table from "../../components/table/Table";
import EditModal from "./modal/EditModal";

export default function Home() {
  const [ownerId, setOwnerId] = useState();
  let ispOwners = useSelector((state) => state.admin.ispOwners);

  const [filterStatus, setFilterStatus] = useState(null);

  if (filterStatus && filterStatus !== "Select") {
    ispOwners = ispOwners.filter(
      (value) => value.bpSettings.paymentStatus === filterStatus
    );
  }

  const dispatch = useDispatch();

  useEffect(() => {
    getIspOwners(dispatch);
  }, [dispatch]);

  const editModal = (ispOwnerId) => {
    setOwnerId(ispOwnerId);
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
        accessor: "name",
        Header: "নাম",
      },
      {
        accessor: "mobile",
        Header: "মোবাইল",
      },
      {
        accessor: "company",
        Header: "কোম্পানি",
      },
      {
        accessor: "address",
        Header: "ঠিকানা",
      },
      {
        Header: "পেমেন্ট স্টেটাস",
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
                      <PenFill />
                      <Link to={"/admin/isp-owner/invoice-list/" + original.id}>
                        <p className="actionP">Invoice</p>
                      </Link>
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
        <div class="card">
          <div class="card-header">
            <div className="row">
              <h2 className="dashboardTitle text-center">Admin Dashborad</h2>
            </div>
          </div>
          <div class="card-body">
            <select
              class="form-select"
              aria-label="Default select example"
              onChange={(event) => setFilterStatus(event.target.value)}
            >
              <option selected>Select</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
            <FontColor>
              <Table columns={columns} data={ispOwners}></Table>

              <EditModal ownerId={ownerId} />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
