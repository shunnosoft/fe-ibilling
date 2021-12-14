import React from "react";
import { PersonPlusFill, GearFill, Search } from "react-bootstrap-icons";
import { Formik, Form } from "formik";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

// internal imports
import "./manager.css";
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import { FtextField } from "../../components/common/FtextField";
import { addNewManager } from "../../features/managerHandle";

export default function Manager() {
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

  return (
    <>
      <Sidebar />
      <ToastContainer
        toastStyle={{ backgroundColor: "#992c0c", color: "white" }}
      />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <div className="alert alert-success mt-3" id="successAlert">
              <strong>ম্যানেজার অ্যাড সফল হয়েছে!</strong> এখন সে ম্যানেজার এর
              অ্যাকশন গুলা পারফর্ম করতে পারে ।
            </div>
            <FontColor>
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
                          photo: "",
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
                <div className="collectorWrapper mt-4">
                  <div className="addCollector">
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
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          মোট ম্যানেজার : <span>34</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="Search"
                          />
                          <button type="button" className="searchButton">
                            <Search />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr>
                          <th scope="col">First</th>
                          <th scope="col">Second</th>
                          <th scope="col">Last</th>
                          <th scope="col">Handle</th>
                          <th scope="col">bundle</th>
                          <th scope="col">Thandle</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Mark</td>
                          <td>Otto</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                        </tr>
                        <tr>
                          <td>Jacob</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                          <td>@mdo</td>
                          <td>Thornton</td>
                          <td>@fat</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
