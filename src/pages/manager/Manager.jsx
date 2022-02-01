import React from "react";
import {
  PersonPlusFill,
  GearFill,
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
import TdLoader from "../../components/common/TdLoader";

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
                <h2 className="collectorTitle">ম্যানেজার</h2>
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
                      ""
                    ) : (
                      <div className="addNewCollector">
                        <p>অ্যাড ম্যানেজার</p>
                        <div className="addAndSettingIcon">
                          <PersonPlusFill
                            className="addcutmButton"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          />

                          <GearFill
                            className="addcutmButton"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          />
                        </div>
                      </div>
                    )}
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট ম্যানেজার : <span>1</span>
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
                  </div>

                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr>
                          <th scope="col">নাম</th>
                          <th scope="col">এড্রেস</th>
                          <th scope="col">ইমেইল</th>
                          <th scope="col">মোবাইল</th>
                          <th scope="col" style={{ textAlign: "center" }}>
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {manager.name ? (
                          <tr>
                            <td>{manager.name}</td>
                            <td>{manager.address}</td>
                            <td>{manager.email}</td>
                            <td>{manager.mobile}</td>
                            <td style={{ textAlign: "center" }}>
                              <div className="dropdown">
                                <ThreeDots
                                  className="dropdown-toggle ActionDots"
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
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <TdLoader colspan={5} />
                          </tr>
                        )}
                      </tbody>
                    </table>
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
