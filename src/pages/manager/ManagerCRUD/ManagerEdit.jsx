import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FtextField } from "../../../components/common/FtextField";
import * as Yup from "yup";
import { useState } from "react";
import { editManager } from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { Tab, Tabs } from "react-bootstrap";
import { managerPermission } from "../managerData";
import Loader from "../../../components/common/Loader";

const ManagerEdit = ({ managerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [subAreaIds, setSubAreaIds] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //get current language
  const language = localStorage.getItem("netFee:lang");

  //get all manager
  const manager = useSelector((state) => state?.manager?.manager);

  //get single manager by id
  const single = manager?.find((val) => val.id === managerId);

  //fetching ispOwner ID
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.ispOwner?.id
  );

  //get area
  const area = useSelector((state) => state?.area?.area);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  //get manager permissions
  useEffect(() => {
    if (single) {
      setSubAreaIds(single.areas);
      language === "en"
        ? setPermissions(
            managerPermission(single.permissions, bpSettings, "en")
          )
        : setPermissions(
            managerPermission(single.permissions, bpSettings, "bn")
          );
    }
  }, [single, manager, language]);

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

  //add manager function handler
  const editManagerHandle = (data) => {
    if (subAreaIds.length === 0) {
      alert(t("selectArea"));
      return;
    }

    let temp = {};
    permissions.forEach((val) => {
      temp[val.value] = val.isChecked;
    });

    const sendingData = {
      ...data,
      permissions: temp,
      areas: subAreaIds,
      ispOwner: ispOwnerId,
    };

    editManager(dispatch, sendingData, single?.id, setIsLoading);
  };

  //sub area handler
  const subAreaHandler = () => {
    const temp = document.querySelectorAll(".getEditValueUsingClass");
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
    var temp = document.querySelectorAll(".getEditValueUsingClass");

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
  const PermissionHandler = (e) => {
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
      id="managerEditModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="exampleModalLabel">
              {t("edit")} {single?.name} {t("manager")}
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
                name: single?.name || "",
                mobile: single?.mobile || "",
                address: single?.address || "",
                email: single?.email || "",
                nid: single?.nid || "",
              }}
              validationSchema={managerValidate}
              onSubmit={(values) => {
                editManagerHandle(values);
              }}
              enableReinitialize
            >
              {(formik) => (
                <Form>
                  <Tabs
                    defaultActiveKey={"editManager"}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab eventKey="editManager" title={t("details")}>
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
                        </div>
                      </div>
                    </Tab>

                    <Tab eventKey="area" title={t("selectArea")}>
                      <div className="AllAreaClass">
                        {area?.map((val, key) => (
                          <div key={key}>
                            {/* <input
                              id={val.id + "AreasEdit"}
                              type="checkbox"
                              className="me-2"
                              value={val.id}
                              onChange={(e) => areaHandler(e, val.subAreas)}
                            /> */}
                            <label htmlFor={val.id + "AreasEdit"}>
                              <b>{val.name.toUpperCase()}</b>
                            </label>
                            {storeSubArea?.map(
                              (v, k) =>
                                v.area === val.id && (
                                  <div key={k} className="displayFlex">
                                    <input
                                      id={v.id + "subAreasEdit"}
                                      type="checkbox"
                                      className="getEditValueUsingClass"
                                      value={v.id}
                                      onChange={subAreaHandler}
                                      checked={
                                        subAreaIds?.includes(v.id)
                                          ? true
                                          : false
                                      }
                                    />
                                    <label htmlFor={v.id + "subAreasEdit"}>
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
                            id="editAllPermissions"
                          />
                          <label
                            htmlFor="editAllPermissions"
                            className="checkboxLabel text-info fw-bold"
                          >
                            {t("selectAll")}
                          </label>
                        </div>
                        {permissions.map((val, key) => (
                          <div
                            className={!val?.disabled && "CheckboxContainer"}
                            key={key}
                          >
                            {!val.disabled && (
                              <>
                                <input
                                  type="checkbox"
                                  className="CheckBox"
                                  name={val.value}
                                  checked={val.isChecked}
                                  onChange={PermissionHandler}
                                  id={val.value + key + "edit"}
                                />
                                <label
                                  htmlFor={val.value + key + "edit"}
                                  className="checkboxLabel"
                                >
                                  {val.label}
                                </label>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </Tab>
                  </Tabs>

                  {/* Button */}
                  {/* <div className="submitSection">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      {t("cancel")}
                    </button>
                    <button type="submit" className="btn btn-success">
                      {t("save")}
                    </button>
                  </div> */}

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      disabled={isLoading}
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success customBtn"
                      disabled={isLoading}
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

export default ManagerEdit;
