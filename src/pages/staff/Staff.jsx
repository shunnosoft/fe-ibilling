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
import StaffTable from "./staffModal/staffTable";
import ActionButton from "./ActionButton";
import StaffEdit from "./staffModal/staffEdit";

const Staff = () => {
  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  const getAllStaffs = useSelector(
    (state) => state.persistedReducer.staff.staff
  );

  const [isLoading, setIsLoading] = useState(false);
  const [staffId, setStafId] = useState(null);

  const deleteStaff = (staffId) => {
    deleteStaffApi(dispatch, staffId, setIsLoading);
  };

  const editHandler = (staffId) => {
    setStafId(staffId);
  };

  useEffect(() => {
    getStaffs(dispatch, ispOwner);
  }, [dispatch]);

  //create column of table
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        id: "row",
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Mobile",
        accessor: "mobile",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Salary",
        accessor: "salary",
      },
      {
        Header: "Action",
        accessor: "id",

        Cell: ({ row: { original } }) => (
          <ActionButton
            deleteStaff={deleteStaff}
            editHandler={editHandler}
            data={original}
          />
        ),
      },
    ],
    []
  );

  const data = useMemo(() => getAllStaffs, []);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <StaffPost />
              <StaffEdit staffId={staffId} />
              <FourGround>
                <h2 className="collectorTitle">কর্মচারী</h2>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
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
                    <div className="row searchCollector">
                      <div className="col-sm-6">
                        <h4 className="allCollector">
                          মোট কর্মচারী : <span>{getAllStaffs.length}</span>
                        </h4>
                      </div>
                      <div className="addAndSettingIcon col-sm-6 text-end">
                        <PersonPlusFill
                          style={{ background: "#fff", color: "#328eea" }}
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#staffModal"
                        />
                      </div>
                      {/* <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="Search"
                          />
                        </div>
                      </div> */}
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
                  <StaffTable columns={columns} data={getAllStaffs} />
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
