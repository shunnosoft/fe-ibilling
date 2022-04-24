import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { PersonPlusFill } from "react-bootstrap-icons";
//internal import
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import StaffPost from "./staffModal/staffPost";

const Staff = () => {
  const [singleUser, setSingleUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <StaffPost />
              <FourGround>
                <h2 className="collectorTitle">কর্মচারী</h2>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector ms-auto">
                      <p>অ্যাড কর্মচারী</p>
                      <div className="addAndSettingIcon">
                        <PersonPlusFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#staffModal"
                        />
                      </div>
                    </div>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট কর্মচারী : <span>{"0"}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="Search"
                          />
                        </div>
                      </div>
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
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default Staff;
