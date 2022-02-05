import React from "react";
import {
  PersonPlusFill,
  ThreeDots,
  ArchiveFill,
  PenFill,
  PersonFill,
} from "react-bootstrap-icons";
import { Formik, Form } from "formik";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { useSelector } from "react-redux";

// internal imports
import "./manager.css";
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import { FtextField } from "../../components/common/FtextField";
import {
  addNewManager,
  deleteManager,
} from "../../features/actions/managerHandle";
import { getManager } from "../../features/authSlice";
import ReadModals from "../../components/modals/ReadModals";
import WriteModals from "../../components/modals/WriteModals";
import Footer from "../../components/admin/footer/Footer";
import { managerPermission } from "./managerData";

export default function Manager() {
  const manager = useSelector(getManager);

  const managerValidate = Yup.object({
    name: Yup.string()
      .min(3, "সর্বনিম্ন ৩টা অক্ষর থাকতে হবে")
      .required("ম্যানেজার এর নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("ম্যানেজার এর মোবাইল নম্বর দিন "),
    address: Yup.string().required("ম্যানেজার এর  এড্রেস দিন "),
    email: Yup.string()
      .email("ইমেইল সঠিক নয় ")
      .required("ম্যানেজার এর ইমেইল দিতে হবে"),
    nid: Yup.string().required("ম্যানেজার এর NID দিন"),
    image: Yup.string(),
  });

  const addManagerHandle = (data) => {
    addNewManager(data);
  };

  const deleteManagerHandler = () => {
    deleteManager();
  };

  return (
    <>
      <Sidebar />
      <ToastContainer
        toastStyle={{ backgroundColor: "#992c0c", color: "white" }}
      />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            {/* manager modal */}
            <ReadModals managerDetails={manager} />
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">
                  {manager?.name} (ম্যানেজার) প্রোফাইল
                </h2>
              </FourGround>
              {/* edit manager */}
              <WriteModals manager={manager} />
              {/* Model */}
              <div
                className="modal fade modal-dialog-scrollable "
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title" id="exampleModalLabel">
                        অ্যাড ম্যানেজার
                      </h4>
                      <button
                        type="button"
                        className="btn-close"
                        id="closeAddManagerBtn"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <Formik
                        initialValues={{
                          name: "",
                          mobile: "",
                          address: "",
                          email: "",
                          nid: "",
                          // photo: "",
                        }}
                        validationSchema={managerValidate}
                        onSubmit={(values) => {
                          addManagerHandle(values);
                        }}
                      >
                        {(formik) => (
                          <Form>
                            <FtextField
                              type="text"
                              label="ম্যানেজার এর নাম"
                              name="name"
                            />
                            <FtextField
                              type="text"
                              label="ম্যানেজার এর মোবাইল নম্বর"
                              name="mobile"
                            />
                            <FtextField
                              type="text"
                              label="ম্যানেজার এর এড্রেস"
                              name="address"
                            />
                            <FtextField
                              type="email"
                              label="ম্যানেজার এর ইমেইল"
                              name="email"
                            />
                            <FtextField
                              type="text"
                              label="ম্যানেজার এর NID নম্বর"
                              name="nid"
                            />
                            <FtextField
                              type="file"
                              label="ম্যানেজার এর ছবি "
                              name="photo"
                            />

                            {/* Button */}
                            <div className="submitSection">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                বাতিল
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary marginLeft"
                              >
                                সেভ করুন
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
              {/* Model */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    {manager?.name ? (
                      <div className="managerDetails">
                        <div className="managerProfile">
                          <img
                            src="https://roottogether.net/wp-content/uploads/2020/04/img-avatar-blank.jpg"
                            alt=""
                            className="managerProfilePic"
                          />
                          <div className="actionsManager">
                            <div className="dropdown">
                              <ThreeDots
                                className="dropdown-toggle ActionDots managerAction"
                                id="ManagerDropdownMenu"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              />
                              <ul
                                className="dropdown-menu"
                                aria-labelledby="ManagerDropdownMenu"
                              >
                                <li onClick={deleteManagerHandler}>
                                  <div className="dropdown-item actionManager">
                                    <div className="ManagerAactionLi">
                                      <ArchiveFill />
                                      <p className="actionP">ডিলিট</p>
                                    </div>
                                  </div>
                                </li>
                                <li
                                  data-bs-toggle="modal"
                                  data-bs-target="#writeModal"
                                >
                                  <div className="dropdown-item">
                                    <div className="ManagerAactionLi">
                                      <PenFill />
                                      <p className="actionP">এডিট</p>
                                    </div>
                                  </div>
                                </li>
                                <li
                                  data-bs-toggle="modal"
                                  data-bs-target="#showDwtailsModel"
                                >
                                  <div className="dropdown-item">
                                    <div className="ManagerAactionLi">
                                      <PersonFill />
                                      <p className="actionP">বিস্তারিত</p>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </div>

                          <div>
                            {manager.name ? (
                              <div className="ManagerData">
                                <p>
                                  <b>{manager.name} </b>,{" "}
                                  <b> {manager.address}</b>
                                </p>
                                <p>
                                  <b>{manager.mobile}</b>
                                </p>
                                <p>{manager.email}</p>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        <div>
                          <h4>পারমিশান পরিবর্তন করুন</h4>
                          <hr />
                          {console.log(manager)}
                          {managerPermission.map((val, key) => (
                            <div className="CheckboxContainer" key={key}>
                              <input
                                type="checkbox"
                                className="CheckBox"
                                value={val.value}
                                checked={val.isChecked}
                              />
                              <label className="checkboxLabel">
                                {val.label}
                              </label>
                            </div>
                          ))}
                          <button className="managerUpdateBtn">আপডেট</button>
                        </div>
                      </div>
                    ) : (
                      <div className="addNewCollector">
                        <p>অ্যাড ম্যানেজার</p>
                        <div className="addAndSettingIcon">
                          <PersonPlusFill
                            className="addcutmButton"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
