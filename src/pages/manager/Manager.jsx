import { useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  // ArchiveFill,
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

// import { getManager } from "../../features/authSlice";
import ReadModals from "../../components/modals/ReadModals";
import WriteModals from "../../components/modals/WriteModals";
import Footer from "../../components/admin/footer/Footer";
import { managerPermission } from "./managerData";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addManager,
  // deleteManager,
  editManager,
  getManger,
} from "../../features/apiCalls";
import Loader from "../../components/common/Loader";

export default function Manager() {
  const [isLoading, setIsLoading] = useState(false);
  const manager = useSelector(
    (state) => state.persistedReducer.manager?.manager
  );
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.ispOwner?.id
  );
  const dispatch = useDispatch();

  useEffect(() => {
    getManger(dispatch, ispOwnerId);
  }, [dispatch, ispOwnerId]);

  const [permissions, setPermissions] = useState(
    managerPermission(manager?.permissions)
  );

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
    addManager(dispatch, {
      ...data,
      ispOwner: ispOwnerId,
    });
    // if (!manager) {
    // } else {
    //   toast("You can't add more than one manager");
    // }
  };

  // const deleteManagerHandler = () => {
  //   deleteManager(dispatch, ispOwnerId);
  // };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    let temp = permissions.map((val) =>
      val.value === name ? { ...val, isChecked: checked } : val
    );

    setPermissions(temp);
  };

  const updatePermissionsHandler = () => {
    setIsLoading(true);
    let temp = {};
    permissions.forEach((val) => {
      temp[val.value] = val.isChecked;
    });
    const newP = {
      ...manager.permissions,
      ...temp,
    };

    editManager(
      dispatch,
      {
        //manager not edited with only permission so (api problem)
        //so we have to add those extra fields
        email: manager.email, //required
        ispOwner: manager.ispOwner,
        mobile: manager.mobile, // required
        name: manager.name, // reqired
        permissions: newP, // can't changed api problem
      },
      setIsLoading
    );
  };

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
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
                            src="/assets/img/noAvater.jpg"
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
                                {/* <li onClick={deleteManagerHandler}>
                                  <div className="dropdown-item actionManager">
                                    <div className="ManagerAactionLi">
                                      <ArchiveFill />
                                      <p className="actionP">ডিলিট</p>
                                    </div>
                                  </div>
                                </li> */}
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
                                      <p className="actionP">প্রোফাইল</p>
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

                          {permissions.map((val, key) => (
                            <div className="CheckboxContainer" key={key}>
                              <input
                                type="checkbox"
                                className="CheckBox"
                                name={val.value}
                                checked={val.isChecked}
                                onChange={handleChange}
                              />
                              <label className="checkboxLabel">
                                {val.label}
                              </label>
                            </div>
                          ))}
                          <button
                            className="managerUpdateBtn"
                            onClick={updatePermissionsHandler}
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader /> : " আপডেট"}
                          </button>
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
