import React, { useEffect, useState } from "react";
import { FontColor } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { useParams } from "react-router-dom";
import Table from "../../components/table/Table";
import {
  deleteIspOwnerCreateSupport,
  getIspOwnerCreateSupport,
} from "../../features/apiCallAdmin";
import { useDispatch, useSelector } from "react-redux";
import { badge } from "../../components/common/Utils";
import moment from "moment";
import {
  ArchiveFill,
  PenFill,
  PersonFill,
  ThreeDots,
} from "react-bootstrap-icons";
import NetFeeIspOwnerSupportEdit from "./supportOpration/NetFeeIspOwnerSupportEdit";
import NetFeeIspOwnerSupportDetails from "./supportOpration/NetFeeIspOwnerSupportDetails";

const NetFeeIspOwnerSupport = () => {
  const { ispOwnerId } = useParams();
  const dispatch = useDispatch();

  // get ispOwner support create history
  const ispOwnerSupport = useSelector(
    (state) => state.adminNetFeeSupport?.ispOwnerSupport
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  // ispOwner support edit id state
  const [editID, setEditID] = useState("");

  // support details id state
  const [detailsID, setDetailsID] = useState("");

  // ispOwner support edit handler
  const ispOwnerSupportEditHandler = (id) => {
    setEditID(id);
  };

  // ispOwner support delete handler
  const ispOwnerSupportDeleteHandler = (id) => {
    let confirm = window.confirm("Do you want to delete support?");
    if (confirm) {
      deleteIspOwnerCreateSupport(dispatch, setIsLoading, id);
    }
  };

  // support details handler
  const supportDetailsHandler = (id) => {
    setDetailsID(id);
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
        width: "15%",
        Header: "supportType",
        accessor: "support",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "8%",
        Header: "status",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "48%",
        Header: "description",
        accessor: "description",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {original.description && original.description.slice(0, 80)}
              <span
                className="text-primary see-more"
                data-bs-toggle="modal"
                data-bs-target="#netFeeIspOwnerSupportDetails"
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
        width: "15%",
        Header: "createdAt",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
      {
        width: "15%",
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
                  data-bs-target="#netFeeIspOwnerSupportDetails"
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
                  data-bs-target="#ispOwnerSupportEdit"
                  onClick={() => ispOwnerSupportEditHandler(original.id)}
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
                  onClick={() => ispOwnerSupportDeleteHandler(original.id)}
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
    getIspOwnerCreateSupport(dispatch, setIsLoading, ispOwnerId);
  }, []);

  return (
    <>
      <FontColor>
        <Sidebar />
        <div className="isp_owner_invoice_list">
          <div className={useDash.dashboardWrapper}>
            <div className="card">
              <div className="card-header">
                <h2 className="dashboardTitle text-center">
                  All iBilling Support
                </h2>
              </div>
              <div className="card-body">
                <Table
                  isLoading={isLoading}
                  columns={columns}
                  data={ispOwnerSupport}
                />
              </div>
            </div>
          </div>
        </div>
      </FontColor>
      <NetFeeIspOwnerSupportEdit editID={editID} />
      <NetFeeIspOwnerSupportDetails detailsID={detailsID} />
    </>
  );
};

export default NetFeeIspOwnerSupport;
