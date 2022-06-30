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
import { badge } from "../../components/common/Utils";
import { useTranslation } from "react-i18next";

const Staff = () => {
  const { t } = useTranslation();
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
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "20%",
        Header: "নাম",
        accessor: "name",
      },
      // {
      //   Header: "ঠিকানা",
      //   accessor: "address",
      // },
      {
        width: "20%",
        Header: "মোবাইল",
        accessor: "mobile",
      },
      {
        width: "20%",
        Header: "স্ট্যাটাস",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "20%",
        Header: "স্যালারি",
        accessor: "salary",
      },
      {
        width: "12%",
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
                  <div> {t("staff")} </div>
                  {(role === "ispOwner" || role === "reseller") && (
                    <div
                      title="কর্মচারী এড করুন"
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
                  <div className="table-section">
                    <Table
                      isLoading={tableLoading}
                      columns={columns}
                      data={getAllStaffs}
                    />
                  </div>
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
