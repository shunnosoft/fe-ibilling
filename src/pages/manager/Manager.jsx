import { useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  // ArchiveFill,
  PenFill,
  PersonFill,
  KeyFill,
} from "react-bootstrap-icons";
import { Formik, Form } from "formik";
import { ToastContainer } from "react-toastify";
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
import { useTranslation } from "react-i18next";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";

export default function Manager() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [addStaffStatus, setAddStaffStatus] = useState(false);

  const [userId, setUserId] = useState();
  const manager = useSelector((state) => state.manager?.manager);

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.ispOwner?.id
  );

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  useEffect(() => {
    getManger(dispatch, ispOwnerId);
  }, [ispOwnerId]);

  const [permissions, setPermissions] = useState(
    managerPermission(manager?.permissions)
  );

  useEffect(() => {
    if (manager)
      setPermissions(managerPermission(manager.permissions, bpSettings));
  }, [manager]);

  const managerValidate = Yup.object({
    name: Yup.string()
      .min(3, t("minimumContaining3letter"))
      .required(t("enterManagerName")),
    mobile: Yup.string()
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("enterManagerNumber")),
    address: Yup.string().required(t("enterManagerAddress")),
    email: Yup.string()
      .email(t("incorrectEmail"))
      .required(t("enterManagerEmail")),
    nid: Yup.string().required(t("enterManagerNID")),
    salary: Yup.string(),
  });

  const addManagerHandle = (data) => {
    if (addStaffStatus) {
      if (!data.salary) {
        alert(t("incorrectSalary"));
      }
    }
    if (!addStaffStatus) {
      delete data.salary;
    }
    addManager(dispatch, addStaffStatus, {
      ...data,
      ispOwner: ispOwnerId,
    });
  };

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
                <div className="d-flex justify-content-between collectorTitle px-5">
                  <h2 className="">
                    {manager?.name} ({t("manager")}) {t("profile")}
                  </h2>
                  {!manager?.name && (
                    <div
                      title={t("addNewManager")}
                      className="header_icon"
                      data-bs-toggle="modal"
                      data-bs-target="#managerAddModal"
                    >
                      <PersonPlusFill />
                    </div>
                  )}
                </div>
              </FourGround>
              {/* edit manager */}
              <WriteModals manager={manager} />
              {/* Model */}
              <div
                className="modal fade modal-dialog-scrollable "
                id="managerAddModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4 className="modal-title" id="exampleModalLabel">
                        {t("addManager")}
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
                          salary: "",
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
                              label={t("managerName")}
                              name="name"
                            />
                            <FtextField
                              type="text"
                              label={t("managerMobile")}
                              name="mobile"
                            />
                            <FtextField
                              type="text"
                              label={t("managerAddress")}
                              name="address"
                            />
                            <FtextField
                              type="email"
                              label={t("managerEmail")}
                              name="email"
                            />
                            <FtextField
                              type="text"
                              label={t("managerNID")}
                              name="nid"
                            />

                            <div className="autoDisable mb-2">
                              <input
                                type="checkBox"
                                checked={addStaffStatus}
                                onChange={(e) =>
                                  setAddStaffStatus(e.target.checked)
                                }
                              />
                              <label className="ps-2"> {t("addStaff")} </label>
                            </div>

                            {addStaffStatus && (
                              <FtextField
                                type="number"
                                label={t("salary")}
                                name="salary"
                              />
                            )}

                            {/* Button */}
                            <div className="submitSection">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                {t("cancel")}
                              </button>
                              <button
                                type="submit"
                                className="btn btn-primary marginLeft"
                              >
                                {t("save")}
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
                <div className="collectorWrapper py-2 pb-5 mt-2">
                  <div className="addCollector">
                    {manager?.name && (
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
                                  data-bs-target="#showDwtailsModel"
                                >
                                  <div className="dropdown-item">
                                    <div className="ManagerAactionLi">
                                      <PersonFill />
                                      <p className="actionP"> {t("profile")}</p>
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
                                      <p className="actionP"> {t("edit")}</p>
                                    </div>
                                  </div>
                                </li>

                                <li
                                  data-bs-toggle="modal"
                                  data-bs-target="#resetPassword"
                                  onClick={() => {
                                    setUserId(manager.user);
                                  }}
                                >
                                  <div className="dropdown-item">
                                    <div className="ManagerAactionLi">
                                      <KeyFill />
                                      <p className="actionP">
                                        {t("passwordReset")}
                                      </p>
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
                          <h4> {t("changePermission")} </h4>
                          <hr />

                          {permissions.map((val, key) => (
                            <div
                              className={!val?.disabled && "CheckboxContainer"}
                              key={key}
                            >
                              {!val?.disabled && (
                                <>
                                  <input
                                    type="checkbox"
                                    className="CheckBox"
                                    name={val.value}
                                    checked={val.isChecked}
                                    onChange={handleChange}
                                    id={val.value + key}
                                    // disabled={val?.disabled}
                                  />

                                  <label
                                    htmlFor={val.value + key}
                                    className="checkboxLabel"
                                  >
                                    {val.label}
                                  </label>
                                </>
                              )}
                            </div>
                          ))}
                          <button
                            className="btn btn-outline-primary w-140"
                            onClick={updatePermissionsHandler}
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader /> : t("update")}
                          </button>
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
      <PasswordReset resetCustomerId={userId} />
    </>
  );
}
