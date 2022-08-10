import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { ArrowClockwise, PersonPlusFill } from "react-bootstrap-icons";
//internal import
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Footer from "../../components/admin/footer/Footer";

import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import StaffPost from "./staffModal/staffPost";
import { getStaffs, deleteStaffApi } from "../../features/apiCallStaff";
import ActionButton from "./ActionButton";
import StaffEdit from "./staffModal/staffEdit";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import { badge } from "../../components/common/Utils";
import { useTranslation } from "react-i18next";

const Staff = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const getAllStaffs = useSelector((state) => state?.staff?.staff);
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  const [isLoading, setIsLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [staffId, setStafId] = useState(null);
  const [staffSmsId, setStafSmsId] = useState();

  const deleteStaff = (staffId) => {
    deleteStaffApi(dispatch, staffId, setIsLoading);
  };

  const editHandler = (staffId) => {
    setStafId(staffId);
  };

  const handleSingleMessage = (staffId) => {
    setStafSmsId(staffId);
  };

  // reload handler
  const reloadHandler = () => {
    getStaffs(dispatch, ispOwner, setTableLoading);
  };

  useEffect(() => {
    if (getAllStaffs.length === 0)
      getStaffs(dispatch, ispOwner, setTableLoading);
  }, [dispatch]);

  //create column of table
  const columns = React.useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "20%",
        Header: t("name"),
        accessor: "name",
      },
      // {
      //   Header: "ঠিকানা",
      //   accessor: "address",
      // },
      {
        width: "20%",
        Header: t("mobile"),
        accessor: "mobile",
      },
      {
        width: "20%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "20%",
        Header: t("salaryType"),
        accessor: "salaryType",
      },
      {
        width: "20%",
        Header: t("salary"),
        accessor: "salary",
      },
      {
        width: "12%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActionButton
              deleteStaff={deleteStaff}
              editHandler={editHandler}
              handleSingleMessage={handleSingleMessage}
              data={original}
            />
          </div>
        ),
      },
    ],
    [t]
  );
  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container">
          <FontColor>
            <StaffPost />
            <SingleMessage single={staffSmsId} sendCustomer="staff" />
            <StaffEdit staffId={staffId} />
            <FourGround>
              <div className="collectorTitle d-flex justify-content-between px-5">
                {/* <div> {t("staff")} </div> */}
                <div className="d-flex">
                  <div>{t("staff")}</div>
                  <div className="reloadBtn">
                    {tableLoading ? (
                      <Loader></Loader>
                    ) : (
                      <ArrowClockwise
                        onClick={() => reloadHandler()}
                      ></ArrowClockwise>
                    )}
                  </div>
                </div>
                {(role === "ispOwner" || role === "reseller") && (
                  <div
                    title={t("addStaff")}
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#staffModal"
                  >
                    <PersonPlusFill />
                  </div>
                )}
              </div>
            </FourGround>
            <FourGround>
              <div className="collectorWrapper mt-2 py-2">
                <div className="addCollector">
                  <div className="table-section">
                    <Table
                      isLoading={tableLoading}
                      columns={columns}
                      data={getAllStaffs}
                    />
                  </div>
                </div>
              </div>
            </FourGround>
          </FontColor>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Staff;
