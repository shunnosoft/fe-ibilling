import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Tab,
  Tabs,
} from "react-bootstrap";

// internal import
import { FtextField } from "../../../components/common/FtextField";
import { editManager } from "../../../features/apiCalls";
import { managerPermission } from "../managerData";
import Loader from "../../../components/common/Loader";
import useISPowner from "../../../hooks/useISPOwner";
import { toast } from "react-toastify";
import InformationTooltip from "../../../components/common/tooltipInformation/InformationTooltip";
import { areasSubareasChecked } from "../../staff/staffCustomFucn";

const ManagerEdit = ({ show, setShow, managerId }) => {
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
  const { ispOwnerId, bpSettings } = useISPowner();

  //get ispOwner all manager form redux store
  const manager = useSelector((state) => state?.manager?.manager);

  //get all area form redux sotre
  const area = useSelector((state) => state?.area?.area);

  // get all subAreas form redux store
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // ispOwner all areas state
  const [areaSubareas, setAreaSubareas] = useState();

  // manager permissions state
  const [managerPermissions, setManagerPermissions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  //get single manager by id
  const single = manager?.find((val) => val.id === managerId);

  //get manager permissions
  useEffect(() => {
    if (single) {
      language === "en"
        ? setManagerPermissions(
            managerPermission(single.permissions, bpSettings, "en")
          )
        : setManagerPermissions(
            managerPermission(single.permissions, bpSettings, "bn")
          );
    }
  }, [single, manager, language]);

  // ispOwner all areas subarea handle
  useEffect(() => {
    let temp = [];

    storeSubArea?.map((sub) => {
      if (single.areas?.includes(sub?.id)) {
        let subarea = {
          ...sub,
          isChecked: true,
        };
        temp.push(subarea);
      } else {
        let subarea = {
          ...sub,
          isChecked: false,
        };
        temp.push(subarea);
      }
    });

    // set ispOwner subAreas checked key include
    setAreaSubareas(temp);
  }, [single, storeSubArea]);

  //modal close handler
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
    let temp = [...managerPermissions];

    if (name === "allPermissions") {
      temp = temp.map((val) => ({ ...val, isChecked: checked }));
    } else {
      temp = temp.map((val) =>
        val.value === name ? { ...val, isChecked: checked } : val
      );
    }

    // set manager permissions state
    setManagerPermissions(temp);
  };

  //manager update function handler
  const managerUpdateHandler = (data) => {
    if (areaSubareas.filter((val) => val.isChecked).length === 0) {
      setIsLoading(false);
      toast.warn(t("selectArea"));
      return;
    }

    let temp = {};
    managerPermissions.forEach((val) => {
      temp[val.value] = val.isChecked;
    });

    const sendingData = {
      ...data,
      permissions: temp,
      areas: areaSubareas.filter((val) => val.isChecked).map((val) => val.id),
      ispOwner: ispOwnerId,
    };

    editManager(dispatch, sendingData, single?.id, setIsLoading, setShow);
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
              {t("edit")} {single?.name} {t("manager")}
            </h4>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
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
              managerUpdateHandler(values);
            }}
            enableReinitialize
          >
            {() => (
              <Form id="managerEdit">
                <Tabs
                  defaultActiveKey={"editManager"}
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  {/* manager profile information tab start */}
                  <Tab eventKey="editManager" title={t("details")}>
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
                      </div>
                    </div>
                  </Tab>
                  {/* manager profile information tab end */}

                  {/* manager areas tab start */}
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
                              checked={
                                areaSubareas &&
                                areasSubareasChecked(val.id, areaSubareas)
                              }
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
                  {/* manager areas tab end */}

                  {/* manager permissions tab start */}
                  <Tab eventKey="permission" title={t("changePermission")}>
                    <div className="displayGrid3">
                      <div className="CheckboxContainer">
                        <input
                          type="checkbox"
                          className="CheckBox"
                          name="allPermissions"
                          onChange={managerPermissionHandler}
                          id="editAllPermissions"
                          checked={managerPermissions.every(
                            (item) => item.isChecked
                          )}
                        />
                        <label
                          htmlFor="editAllPermissions"
                          className="checkboxLabel text-info fw-bold"
                        >
                          {t("allPermission")}
                        </label>
                      </div>
                      {managerPermissions.map(
                        (val, key) =>
                          !val.disabled && (
                            <div
                              className={
                                !val?.disabled &&
                                "CheckboxContainer d-flex justify-content-between"
                              }
                              key={key}
                            >
                              <div>
                                <input
                                  type="checkbox"
                                  className="CheckBox"
                                  name={val.value}
                                  checked={val.isChecked}
                                  onChange={managerPermissionHandler}
                                  id={val.value + key + "edit"}
                                />

                                <label
                                  htmlFor={val.value + key + "edit"}
                                  className="checkboxLabel"
                                >
                                  {val.label}
                                </label>
                              </div>

                              {/* there is information to grant permission tooltip */}
                              {val?.info && <InformationTooltip data={val} />}
                            </div>
                          )
                      )}
                    </div>
                  </Tab>
                  {/* manager permissions tab end */}
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
              disabled={isLoading}
              onClick={closeHandler}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              form="managerEdit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("save")}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ManagerEdit;
