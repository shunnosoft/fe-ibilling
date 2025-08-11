import React, { useEffect, useState } from "react";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import Table from "../../components/table/Table";
import {
  deleteAdminNetFeeSupport,
  getAllNetFeeSupport,
} from "../../features/apiCallAdmin";
import { useDispatch, useSelector } from "react-redux";
import {
  ArchiveFill,
  PenFill,
  PersonFill,
  ThreeDots,
} from "react-bootstrap-icons";
import moment from "moment";
import { badge } from "../../components/common/Utils";
import AdminSupportUpdate from "./supportOpration/AdminSupportUpdate";
import { ToastContainer } from "react-toastify";
import AdminSupportDetails from "./supportOpration/AdminSupportDetails";

const Supports = () => {
  const dispatch = useDispatch();

  // oneBilling support all data
  const supportAllData = useSelector(
    (state) => state.adminNetFeeSupport?.adminSupport
  );

  // isLoading state
  const [isLoading, setIsLoading] = useState(false);

  // support edit id
  const [editId, setEditId] = useState("");

  // support details id state
  const [detailsId, setDetailsId] = useState("");

  // support edit handler
  const supportEditId = (id) => {
    setEditId(id);
  };

  // support delete handler
  const supportDeleteHandler = (id) => {
    let confirm = window.confirm("Are You Want Delete");
    if (confirm) {
      deleteAdminNetFeeSupport(dispatch, setIsLoading, id);
    }
  };

  // support details handler
  const supportDetailsHandler = (id) => {
    setDetailsId(id);
  };

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
        width: "9%",
        accessor: "company",
        Header: "Company",
      },
      {
        width: "8%",
        accessor: "mobile",
        Header: "Mobile",
      },
      {
        width: "11%",
        Header: "Support Type",
        accessor: "support",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "8%",
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "35%",
        Header: "Description",
        accessor: "description",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {original.description && original.description.slice(0, 80)}
              <span
                className="text-primary see-more"
                data-bs-toggle="modal"
                data-bs-target="#adminSupportDetails"
                onClick={() => {
                  supportDetailsHandler(original.id);
                }}
              >
                {original.description.length > 80 ? "...see more" : ""}
              </span>
            </div>
          );
        },
      },

      {
        width: "12%",
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
      {
        width: "6%",
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
                  data-bs-target="#adminSupportDetails"
                  onClick={() => {
                    supportDetailsHandler(original.id);
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
                  data-bs-target="#adminSupportEditModal"
                  onClick={() => supportEditId(original.id)}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">Edit</p>
                    </div>
                  </div>
                </li>
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#adminSupportDelete"
                  onClick={() => supportDeleteHandler(original.id)}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">Delete</p>
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

  useEffect(() => {
    supportAllData.length === 0 && getAllNetFeeSupport(dispatch, setIsLoading);
  }, [supportAllData]);

  return (
    <>
      <FontColor>
        <Sidebar />
        <ToastContainer position="top-right" theme="colored" />
        <div className="isp_owner_invoice_list">
          <div className={useDash.dashboardWrapper}>
            <div className="card">
              <div className="card-header">
                <h2 className="dashboardTitle text-center">
                  All OneBilling Support
                </h2>
              </div>
              <div className="card-body">
                <Table
                  isLoading={isLoading}
                  columns={columns}
                  data={supportAllData}
                />
              </div>
            </div>
          </div>
        </div>
      </FontColor>
      <AdminSupportUpdate editId={editId} />
      <AdminSupportDetails detailsId={detailsId} />
    </>
  );
};

export default Supports;
