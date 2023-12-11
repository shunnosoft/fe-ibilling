import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Tab,
  Tabs,
} from "react-bootstrap";

//internal import
import { managerPermission } from "../managerData";
import Loader from "../../../components/common/Loader";
import { FtextField } from "../../../components/common/FtextField";
import useISPowner from "../../../hooks/useISPOwner";
import { addManager } from "../../../features/apiCalls";
import InformationTooltip from "../../../components/common/InformationTooltip";

const ManagerPost = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  //get current language
  const language = localStorage.getItem("netFee:lang");

  // get user & current user data form useISPOwner
  const { ispOwnerId } = useISPowner();

  //get area
  const area = useSelector((state) => state?.area?.area);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [addStaffStatus, setAddStaffStatus] = useState(false);

  // manager permissions state
  const [permissions, setPermissions] = useState([]);

  // ispOwner all areas state
  const [areaSubareas, setAreaSubareas] = useState();

  //get manager permissions
  useEffect(() => {
    language === "en"
      ? setPermissions(managerPermission(null, null, "en"))
      : setPermissions(managerPermission(null, null, "bn"));
  }, [language]);

  // ispOwner all areas subarea handle
  useEffect(() => {
    let temp = [];

    area?.map((val) =>
      storeSubArea?.map((sub) => {
        if (val.id === sub.area) {
          let subarea = {
            ...sub,
            isChecked: false,
          };
          temp.push(subarea);
        }
      })
    );

    // set ispOwner subAreas checked key include
    setAreaSubareas(temp);
  }, [area, storeSubArea]);

  // modal close handler
  const closeHandler = () => setShow(false);

  // select area handle for the collector
  const areaSubareaSelectHandler = ({ target }) => {
    const { name, checked, id } = target;

    let subAreas = [...areaSubareas];

    if (name === "area") {
      subAreas = subAreas.map((val) =>
        val.area === id ? { ...val, isChecked: checked } : val
      );
    } else {
      subAreas = subAreas.map((val) =>
        val.id === id ? { ...val, isChecked: checked } : val
      );
    }

    // set collector areas
    setAreaSubareas(subAreas);
  };

  // select permission handle for the manager
  const managerPermissionHandler = (e) => {
    const { name, checked } = e.target;

    //  temporary state set collector single & multiple permission
    let temp = [...permissions];

    if (name === "allPermissions") {
      temp = temp.map((val) => ({ ...val, isChecked: checked }));
    } else {
      temp = temp.map((val) =>
        val.value === name ? { ...val, isChecked: checked } : val
      );
    }

    // set manager permissions state
    setPermissions(temp);
  };

  //added manager function handler
  const managerCreateHandler = (data) => {
    if (areaSubareas.filter((val) => val.isChecked).length === 0) {
      setIsLoading(false);
      toast.warn(t("selectArea"));
      return;
    }

    let temp = {};
    permissions.forEach((val) => {
      temp[val.value] = val.isChecked;
    });

    data.permissions = temp;

    data.areas = areaSubareas
      .filter((val) => val.isChecked)
      .map((val) => val.id);

    data.ispOwner = ispOwnerId;

    if (addStaffStatus) {
      if (!data.salary) {
        alert(t("incorrectSalary"));
      }
    }

    if (!addStaffStatus) {
      delete data.salary;
    }

    addManager(dispatch, addStaffStatus, data, setIsLoading, setShow);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={closeHandler}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <h4 className="modal-title" id="exampleModalLabel">
              {t("addManager")}
            </h4>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              mobile: "",
              address: "",
              email: "",
              nid: "",
              salary: "",
            }}
            validationSchema={managerValidate}
            onSubmit={(values) => {
              managerCreateHandler(values);
            }}
          >
            {() => (
              <Form id="managerPost">
                <Tabs
                  defaultActiveKey={"addManager"}
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  {/* manager profile information tab start */}
                  <Tab eventKey="addManager" title={t("profile")}>
                    <div className="d-flex justify-content-center">
                      <div className="displayGrid col-6">
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

                        <div className="autoDisable">
                          <input
                            id="addStaff"
                            type="checkBox"
                            checked={addStaffStatus}
                            onChange={(e) =>
                              setAddStaffStatus(e.target.checked)
                            }
                          />
                          <label className="ps-2" htmlFor="addStaff">
                            {t("addStaff")}
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
                  {/* manager profile information tab end */}

                  {/* manager area select tab start */}
                  <Tab eventKey="area" title={t("area")}>
                    <div className="AllAreaClass">
                      {area?.map((val, key) => (
                        <div key={key}>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              name="area"
                              id={val.id}
                              onChange={areaSubareaSelectHandler}
                              checked={areaSubareas
                                ?.filter((item) => item.area === val.id)
                                ?.every((value) => value.isChecked)}
                            />

                            <label htmlFor={val.id} className="areaParent ms-1">
                              {val.name}
                            </label>
                          </div>

                          {areaSubareas?.map(
                            (subarea, k) =>
                              subarea.area === val.id && (
                                <div key={k} className="displayFlex">
                                  <input
                                    type="checkbox"
                                    id={subarea.id}
                                    onChange={areaSubareaSelectHandler}
                                    checked={subarea.isChecked}
                                  />

                                  <label
                                    htmlFor={subarea.id}
                                    className="text-secondary"
                                  >
                                    {subarea.name}
                                  </label>
                                </div>
                              )
                          )}
                        </div>
                      ))}
                    </div>
                  </Tab>
                  {/* manager area select tab end */}

                  {/* manager permission select tab start */}
                  <Tab eventKey="permission" title={t("permissions")}>
                    <div className="displayGrid3">
                      <div className="CheckboxContainer">
                        <input
                          type="checkbox"
                          className="CheckBox"
                          name="allPermissions"
                          onChange={managerPermissionHandler}
                          id="selectAllPermissions"
                          checked={permissions.every((item) => item.isChecked)}
                        />
                        <label
                          htmlFor="selectAllPermissions"
                          className="checkboxLabel text-info fw-bold"
                        >
                          {t("allPermission")}
                        </label>
                      </div>

                      {permissions.map((val, key) => (
                        <div
                          className="CheckboxContainer d-flex justify-content-between"
                          key={key}
                        >
                          <div>
                            <input
                              type="checkbox"
                              className="CheckBox"
                              name={val.value}
                              checked={val.isChecked}
                              onChange={managerPermissionHandler}
                              id={val.value + key}
                            />
                            <label
                              htmlFor={val.value + key}
                              className="checkboxLabel"
                            >
                              {val.label}
                            </label>
                          </div>

                          {/* there is information to grant permission tooltip */}
                          {val?.info && <InformationTooltip data={val} />}
                        </div>
                      ))}
                    </div>
                  </Tab>
                  {/* manager permission select tab start */}
                </Tabs>
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <div className="displayGrid1">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeHandler}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              form="managerPost"
              className="btn btn-primary"
            >
              {isLoading ? <Loader /> : t("submit")}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ManagerPost;
