import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { FontColor } from "../../../assets/js/theme";
import useDash from "../../../assets/css/dash.module.css";
import {
  ArchiveFill,
  PenFill,
  PersonPlusFill,
  ThreeDots,
} from "react-bootstrap-icons";
import {
  deleteNetFeeSupportNumbers,
  getNetFeeSupportNumbers,
  updateNetFeeSupportNumbers,
} from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import CreateSupportNumber from "./modal/CreateSupportNumber";
import Table from "../../../components/table/Table";
import { ToastContainer } from "react-toastify";

const NetFeeSupportNumbers = () => {
  const dispatch = useDispatch();

  // iBilling support Numbers
  const supportNumbers = useSelector(
    (state) => state.netFeeSupport?.supportNumbers
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  // modal open close status
  const [modalStatus, setModalStatus] = useState(false);

  useEffect(() => {
    supportNumbers.length === 0 &&
      getNetFeeSupportNumbers(dispatch, setIsLoading);
  }, []);

  // iBilling support numbers delete handle
  const supportNUmberDelete = (supportId) => {
    const confirm = window.confirm("Do you want to delete the number?");

    if (confirm) {
      deleteNetFeeSupportNumbers(dispatch, supportId);
    }
  };

  // iBilling support online offline handle
  const supportOnlineHandle = (value) => {
    const data = { isShow: value.checked };
    updateNetFeeSupportNumbers(dispatch, data, value.id);
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
        Header: "status",
        width: "10%",
        accessor: "isShow",
        Cell: ({ row: { original } }) => (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id={original.id}
              checked={original.isShow}
              onChange={(e) => supportOnlineHandle(e.target)}
            />
          </div>
        ),
      },
      {
        Header: "Name",
        width: "16%",
        accessor: "name",
      },
      {
        Header: "Mobile 1",
        width: "16%",
        accessor: "mobile1",
      },
      {
        Header: "Mobile 2",
        width: "16%",
        accessor: "mobile2",
      },
      {
        width: "10%",
        Header: "Start Time",
        accessor: "start",
      },
      {
        width: "10%",
        Header: "End Time",
        accessor: "end",
      },

      {
        width: "12%",
        Header: () => <div className="text-center">Action</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center justify-content-center">
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                {/* <li
                  onClick={() => {
                    setSupportId(original.id);
                    setModalStatus("supportEdit");
                    setShow(true);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">Edit</p>
                    </div>
                  </div>
                </li> */}

                <li onClick={() => supportNUmberDelete(original.id)}>
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">Delete</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
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
                  <h2 className="dashboardTitle text-center">
                    Support Numbers
                  </h2>
                  <div className="addAndSettingIcon d-flex justify-content-center align-items-center">
                    <PersonPlusFill
                      className="addcutmButton"
                      title="Create Support Number"
                      onClick={() => {
                        setModalStatus("supportPost");
                        setShow(true);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <Table
                  columns={columns}
                  data={supportNumbers}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </FontColor>

      {/* create support number */}
      {modalStatus === "supportPost" && (
        <CreateSupportNumber show={show} setShow={setShow} />
      )}
    </>
  );
};

export default NetFeeSupportNumbers;
