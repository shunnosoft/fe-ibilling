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

  // const data = useMemo(() => getAllStaffs, []);

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
                <h2 className="collectorTitle">কর্মচারী</h2>
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
                    <div className="addAndSettingIcon col-sm-6 text-end">
                      <PersonPlusFill
                        style={{ background: "#328eea", color: "#fff" }}
                        className="addcutmButton"
                        data-bs-toggle="modal"
                        data-bs-target="#staffModal"
                      />
                    </div>

                    {isLoading ? (
                      <div className="deleteReseller">
                        <h6>
                          <Loader /> Deleting...
                        </h6>
                      </div>
                    ) : (
                      ""
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
