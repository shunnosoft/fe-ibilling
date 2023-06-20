import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FtextField } from "../../../components/common/FtextField";
import * as Yup from "yup";
import { useState } from "react";
import { addManager } from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";
import { managerPermission } from "../managerData";
import Loader from "../../../components/common/Loader";

const ManagerPost = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [addStaffStatus, setAddStaffStatus] = useState(false);

  const [subAreaIds, setSubAreaIds] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //get current language
  const language = localStorage.getItem("netFee:lang");

  //fetching ispOwner ID
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.ispOwner?.id
  );

  //get area
  const area = useSelector((state) => state?.area?.area);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //get manager permissions
  useEffect(() => {
    language === "en"
      ? setPermissions(managerPermission(null, null, "en"))
      : setPermissions(managerPermission(null, null, "bn"));
  }, [language]);

  //manager Validate with yup
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

  //edit manager function handler
  const editManagerHandle = (data) => {
    if (subAreaIds.length === 0) {
      alert(t("selectArea"));
      return;
    }

    let temp = {};
    permissions.forEach((val) => {
      temp[val.value] = val.isChecked;
    });
    data.permissions = temp;
    data.areas = subAreaIds;
    data.ispOwner = ispOwnerId;

    if (addStaffStatus) {
      if (!data.salary) {
        alert(t("incorrectSalary"));
      }
    }
    if (!addStaffStatus) {
      delete data.salary;
    }
    addManager(dispatch, addStaffStatus, data, setIsLoading);
  };

  //sub area handler
  const setSubAreaHandler = () => {
    const temp = document.querySelectorAll(".getValueUsingClass");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    setSubAreaIds(IDS_temp);
  };

  //area handler
  const areaHandler = (event, subAreas) => {
    const areaChecked = event.target.checked;

    //get all subareas by className during event
    var temp = document.querySelectorAll(".getValueUsingClass");

    let IDS_temp = [];

    for (var i = 0; i < temp.length; i++) {
      for (var j = 0; j < subAreas.length; j++) {
        if (temp[i].value === subAreas[j].id) {
          if (!areaChecked) {
            //logic for unchecking Area checkbox
            if (temp[i].checked) {
              temp[i].checked = false;
              const index = subAreaIds.indexOf(temp[i].value);
              subAreaIds.splice(index, 1);
            }
          } else {
            if (!temp[i].checked) {
              //logic for checking Area checkbox
              temp[i].checked = true;
              IDS_temp.push(temp[i].value);
            }
          }
        }
      }
    }

    setSubAreaIds([...subAreaIds, ...IDS_temp]);
  };

  //Permissions handler
  const handleChange = (e) => {
    const { name, checked } = e.target;
    let temp = permissions.map((val) =>
      val.value === name ? { ...val, isChecked: checked } : val
    );

    setPermissions(temp);
  };

  //Check all permissions handler
  const checkAllPerms = (e) => {
    let temp = [];
    if (e.target.checked) {
      temp = permissions.map((val) => {
        val.isChecked = true;
        return val;
      });
    } else {
      temp = permissions.map((val) => {
        val.isChecked = false;
        return val;
      });
    }
    setPermissions(temp);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="managerAddModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
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
                editManagerHandle(values);
              }}
            >
              {(formik) => (
                <Form>
                  <Tabs
                    defaultActiveKey={"addManager"}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="addManager" title={t("details")}>
                      <div className="d-flex justify-content-center">
                        <div className="col-6">
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
                              id="addStaff"
                              type="checkBox"
                              checked={addStaffStatus}
                              onChange={(e) =>
                                setAddStaffStatus(e.target.checked)
                              }
                            />
                            <label className="ps-2" htmlFor="addStaff">
                              {" "}
                              {t("addStaff")}{" "}
                            </label>
                          </div>

                          {addStaffStatus && (
                            <FtextField
                              type="number"
                              label={t("salary")}
                              name="salary"
                            />
                          )}
                        </div>
                      </div>
                    </Tab>

                    <Tab eventKey="area" title={t("selectArea")}>
                      <div className="AllAreaClass">
                        {area?.map((val, key) => (
                          <div key={key}>
                            {/* <input
                              id={val.id + "Areas"}
                              type="checkbox"
                              className="me-2"
                              value={val.id}
                              onChange={(e) => areaHandler(e, val.subAreas)}
                            /> */}
                            <label htmlFor={val.id + "Areas"}>
                              <b>{val.name.toUpperCase()}</b>
                            </label>

                            {storeSubArea?.map(
                              (v, k) =>
                                v.area === val.id && (
                                  <div key={k} className="displayFlex">
                                    <input
                                      id={v.id + "subAreas"}
                                      type="checkbox"
                                      className="getValueUsingClass"
                                      value={v.id}
                                      onChange={setSubAreaHandler}
                                    />
                                    <label htmlFor={v.id + "subAreas"}>
                                      {v.name}
                                    </label>
                                  </div>
                                )
                            )}
                          </div>
                        ))}
                      </div>
                    </Tab>

                    <Tab eventKey="permission" title={t("changePermission")}>
                      <div className="displayGrid3">
                        <div className="CheckboxContainer">
                          <input
                            type="checkbox"
                            className="CheckBox"
                            name="allPermissions"
                            onChange={checkAllPerms}
                            id="selectAllPermissions"
                          />
                          <label
                            htmlFor="selectAllPermissions"
                            className="checkboxLabel text-info fw-bold"
                          >
                            {t("selectAll")}
                          </label>
                        </div>

                        {permissions.map((val, key) => (
                          <div className="CheckboxContainer" key={key}>
                            <>
                              <input
                                type="checkbox"
                                className="CheckBox"
                                name={val.value}
                                checked={val.isChecked}
                                onChange={handleChange}
                                id={val.value + key}
                              />
                              <label
                                htmlFor={val.value + key}
                                className="checkboxLabel"
                              >
                                {val.label}
                              </label>
                            </>
                          </div>
                        ))}
                      </div>
                    </Tab>
                  </Tabs>

                  {/* Button */}
                  <div className="modal-footer">
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
                      {isLoading ? <Loader /> : t("save")}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPost;
