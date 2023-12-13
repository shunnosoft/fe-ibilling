import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../components/common/Loader";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import { RADIO, collectorData } from "../CollectorInputs";
import "../../Customer/customer.css";
import { FtextField } from "../../../components/common/FtextField";
import { addCollector } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Tab,
  Tabs,
} from "react-bootstrap";
import { areasSubareasChecked } from "../../staff/staffCustomFucn";
import { toast } from "react-toastify";

const CollectorPost = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //validator
  const collectorValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
    mobile: Yup.string()
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("enterMobile")),
    address: Yup.string().required(t("enterAddress")),
    email: Yup.string().email(t("incorrectEmail")).required(t("enterEmail")),
    nid: Yup.string().required(t("enterNID")),
    status: Yup.string().required(t("enterStatus")),
  });

  const area = useSelector((state) => state?.area?.area);
  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  const auth = useSelector((state) => state.persistedReducer.auth?.currentUser);

  const role = useSelector((state) => state.persistedReducer.auth?.role);

  const [areaIds, setAreaIds] = useState([]);

  const [addStaffStatus, setAddStaffStatus] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // ispOwner all areas state
  const [areaSubareas, setAreaSubareas] = useState();

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

  // modal close hadler
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

  // collector create function handler
  const collectorPostHandler = async (data) => {
    if (areaSubareas.filter((val) => val.isChecked).length === 0) {
      setIsLoading(false);
      toast.warn(t("selectArea"));
      return;
    }

    if (addStaffStatus) {
      if (!data.salary) {
        alert(t("incorrectSalary"));
      }
    }
    setIsLoading(true);
    if (auth.ispOwner) {
      const sendingData = {
        ...data,
        areas: areaSubareas.filter((val) => val.isChecked).map((val) => val.id),
        ispOwner: auth.ispOwner.id,
      };
      if (!addStaffStatus) {
        delete sendingData.salary;
      }

      addCollector(dispatch, sendingData, setIsLoading, addStaffStatus);
    }
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
            <h5 className="modal-title" id="exampleModalLabel">
              {t("addNewCollector")}
            </h5>
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
              status: "",
              salary: "",
            }}
            validationSchema={collectorValidator}
            onSubmit={(values) => {
              collectorPostHandler(values);
            }}
            enableReinitialize
          >
            {() => (
              <Form>
                <Tabs
                  defaultActiveKey="details"
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  {/* collector profile informataion start */}
                  <Tab eventKey="details" title={t("profile")}>
                    <div className="d-flex justify-content-center">
                      <div className="displayGrid col-6">
                        {collectorData.map((val, key) => (
                          <FtextField
                            key={key}
                            type={val.type}
                            label={val.label}
                            name={val.name}
                            validation={"true"}
                          />
                        ))}

                        <div>
                          <label className="form-control-label changeLabelFontColor">
                            {t("status")}
                            <span className="text-danger">*</span>
                          </label>

                          <div className="d-flex">
                            {RADIO?.map((val, key) => (
                              <div key={key} className="form-check">
                                <FtextField
                                  label={val.label}
                                  className="form-check-input"
                                  type="radio"
                                  name="status"
                                  value={val.value}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {role === "ispOwner" && (
                          <div className="autoDisable">
                            <input
                              id="addStaffStatus"
                              type="checkBox"
                              checked={addStaffStatus}
                              onChange={(e) =>
                                setAddStaffStatus(e.target.checked)
                              }
                            />
                            <label htmlFor="addStaffStatus" className="ps-2">
                              {t("addStaff")}
                            </label>
                          </div>
                        )}

                        {role === "ispOwner" && addStaffStatus && (
                          <FtextField
                            type="number"
                            label={t("salary")}
                            name="salary"
                          />
                        )}
                      </div>
                    </div>
                  </Tab>
                  {/* collector profile informataion end */}

                  {/* collector areas tab start */}
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
                            (subArea, k) =>
                              subArea.area === val.id && (
                                <div key={k} className="displayFlex">
                                  <input
                                    type="checkbox"
                                    id={subArea.id}
                                    checked={subArea.isChecked}
                                    onChange={areaSubareaSelectHandler}
                                  />
                                  <label
                                    htmlFor={subArea.id}
                                    className="text-secondary"
                                  >
                                    {subArea.name}
                                  </label>
                                </div>
                              )
                          )}
                        </div>
                      ))}
                    </div>
                  </Tab>
                  {/* collector areas tab end */}
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
              className="btn btn-success customBtn"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("submit")}
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default CollectorPost;
