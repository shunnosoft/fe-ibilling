import React, { useState, useMemo, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { PersonPlusFill } from "react-bootstrap-icons";
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

const Staff = () => {
  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const getAllStaffs = useSelector(
    (state) => state.persistedReducer?.staff?.staff
  );
  const role = useSelector((state) => state?.persistedReducer?.auth?.role);

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

  useEffect(() => {
    getStaffs(dispatch, ispOwner, setTableLoading);
  }, [dispatch]);

  //create column of table
  const columns = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "নাম",
        accessor: "name",
      },
      // {
      //   Header: "ঠিকানা",
      //   accessor: "address",
      // },
      {
        Header: "মোবাইল",
        accessor: "mobile",
      },
      {
        Header: "স্টেটাস",
        accessor: "status",
      },
      {
        Header: "স্যালারি",
        accessor: "salary",
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
    []
  );
  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <StaffPost />
              <SingleMessage single={staffSmsId} sendCustomer="staff" />
              <StaffEdit staffId={staffId} />
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div>কর্মচারী</div>
                  {(role === "ispOwner" || role === "reseller") && (
                    <button
                      title="কর্মচারী এড করুন"
                      className="btn btn-outline-light btn-md"
                      data-bs-toggle="modal"
                      data-bs-target="#staffModal"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        fill="currentColor"
                        class="bi bi-person-plus"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                        <path
                          fill-rule="evenodd"
                          d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper">
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                    className="addCollector"
                  >
                    {/* <div className="addNewCollector text-end">
                      <p>অ্যাড কর্মচারী</p>
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#staffModal"
                        />
                      </div>
                    </div> */}
                    {/* <div className="addAndSettingIcon col-sm-6 text-end">
                      <PersonPlusFill
                        style={{ background: "#328eea", color: "#fff" }}
                        className="addcutmButton"
                        data-bs-toggle="modal"
                        data-bs-target="#staffModal"
                      />
                    </div> */}

                    {isLoading && (
                      <div className="deleteReseller">
                        <h6>
                          <Loader /> Deleting...
                        </h6>
                      </div>
                    )}
                  </div>
                  <Table
                    isLoading={tableLoading}
                    columns={columns}
                    data={getAllStaffs}
                  />
                </div>
              </FourGround>
            </FontColor>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Staff;
