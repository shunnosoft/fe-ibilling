import React, { useEffect, useMemo, useState } from "react";
import { FontColor } from "../../../assets/js/theme";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import useDash from "../../../assets/css/dash.module.css";
import { deleteBulletin, getBulletin } from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { ArchiveFill, PersonPlusFill, ThreeDots } from "react-bootstrap-icons";
import BulletinPost from "./modal/BulletinPost";
import Table from "../../../components/table/Table";
import moment from "moment";

const Bulletin = () => {
  const dispatch = useDispatch();

  //  netFee Bulletin all data
  const bulletinData = useSelector((state) => state.netFeeSupport?.bulletin);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // bulletin modal state
  const [show, setShow] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);

  useEffect(() => {
    bulletinData.length === 0 && getBulletin(dispatch, setIsLoading);
  }, []);

  // single bulletin delete handle
  const bulletinDeleteHandle = (id) => {
    const confirm = window.confirm("Do you want to delete the bulletin?");
    if (confirm) {
      deleteBulletin(dispatch, id);
    }
  };

  const columns = useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "45%",
        accessor: "title",
        Header: "Title",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {original?.title && original?.title.slice(0, 70)}
              <span
              // className="text-primary see-more"
              // data-bs-toggle="modal"
              // data-bs-target="#dipositNoteDetailsModal"
              // onClick={() => setMessage(original?.note)}
              >
                {original?.title.length > 70 ? "...see more" : ""}
              </span>
            </div>
          );
        },
      },
      {
        width: "10%",
        accessor: "startDate",
        Header: "Start Date",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD");
        },
      },
      {
        width: "10%",
        accessor: "endDate",
        Header: "End Date",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD");
        },
      },
      {
        width: "15%",
        Header: "Status",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              {original?.ispOwner && (
                <span className="badge bg-secondary me-2">ispOwner</span>
              )}
              {original?.reseller && (
                <span className="badge bg-secondary">reseller</span>
              )}
            </div>
          );
        },
      },
      {
        width: "10%",
        Header: () => <div className="text-center">Action</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <>
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="areaDropdown">
                {/* <li
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
                </li> */}
                <li onClick={() => bulletinDeleteHandle(original.id)}>
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

  return (
    <>
      <FontColor>
        <Sidebar />
        <ToastContainer position="top-right" theme="colored" />
        <div className="isp_owner_invoice_list">
          <div className={useDash.dashboardWrapper}>
            <div className="card">
              <div className="card-header">
                <div className="d-flex justify-content-between">
                  <h2 className="dashboardTitle text-center">Bulletin</h2>
                  <div className="addAndSettingIcon d-flex justify-content-center align-items-center">
                    <PersonPlusFill
                      className="addcutmButton"
                      title="Create Bulletin"
                      onClick={() => {
                        setModalStatus("bulletinPost");
                        setShow(true);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <Table
                  isLoading={isLoading}
                  columns={columns}
                  data={bulletinData}
                />
              </div>
            </div>
          </div>
        </div>
      </FontColor>

      {/* bulletin all modal start */}
      {modalStatus === "bulletinPost" && (
        <BulletinPost show={show} setShow={setShow} />
      )}

      {/* bulletin all modal end */}
    </>
  );
};

export default Bulletin;
