import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-bootstrap";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { FontColor } from "../../../assets/js/theme";
import useDash from "../../../assets/css/dash.module.css";
import { ArchiveFill, PersonPlusFill, ThreeDots } from "react-bootstrap-icons";
import {
  deleteNetFeeSupportNumbers,
  getNetFeeSupportNumbers,
} from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import CreateSupportNumber from "./modal/CreateSupportNumber";
import Table from "../../../components/table/Table";

const NetFeeSupportNumbers = () => {
  const dispatch = useDispatch();

  // netFee support Numbers
  const supportNumbers = useSelector(
    (state) => state.netFeeSupport?.supportNumbers
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    supportNumbers.length === 0 &&
      getNetFeeSupportNumbers(dispatch, setIsLoading);
  }, []);

  // netFee support numbers delete handle
  const supportNUmberDelete = (supportId) => {
    const confirm = window.confirm("Do you want to delete the number?");

    if (confirm) {
      deleteNetFeeSupportNumbers(dispatch, supportId);
    }
  };

  const columns = useMemo(
    () => [
      {
        width: "16%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "Name",
        width: "16%",
        accessor: "name",
      },
      {
        Header: "Mobile",
        width: "20%",
        accessor: "mobile",
      },
      {
        width: "16%",
        Header: "Start Time",
        accessor: "start",
      },
      {
        width: "16%",
        Header: "End Time",
        accessor: "end",
      },

      {
        width: "16%",
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
                  data-bs-toggle="modal"
                  data-bs-target="#supportEdit"
                  onClick={() => numberEditHandler(original.id)}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>*/}

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
                      onClick={() => setShow(true)}
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
      <CreateSupportNumber show={show} setShow={setShow} />
    </>
  );
};

export default NetFeeSupportNumbers;
