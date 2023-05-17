import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../components/common/Loader";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import { collectorData } from "../CollectorInputs";
import "../../Customer/customer.css";
import { FtextField } from "../../../components/common/FtextField";
import { addCollector } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";

export default function CollectorPost() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const area = useSelector((state) => state?.area?.area);
  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);
  const auth = useSelector((state) => state.persistedReducer.auth?.currentUser);
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  const [areaIds, setAreaIds] = useState([]);
  const [addStaffStatus, setAddStaffStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const setAreaHandler = () => {
    const temp = document.querySelectorAll(".getValueUsingClass");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    // console.log("IDS: ", IDS_temp);
    setAreaIds(IDS_temp);
  };

  const collectorPostHandler = async (data) => {
    if (addStaffStatus) {
      if (!data.salary) {
        alert(t("incorrectSalary"));
      }
    }
    setIsLoading(true);
    if (auth.ispOwner) {
      const sendingData = {
        ...data,
        areas: areaIds,
        ispOwner: auth.ispOwner.id,
      };
      if (!addStaffStatus) {
        delete sendingData.salary;
      }
      addCollector(dispatch, sendingData, setIsLoading, addStaffStatus);
    }
  };

  return (
    <div>
      {/* Model start */}
      <div
        className="modal fade modal-dialog-scrollable "
        id="collectorModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addNewCollector")}
              </h5>
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
                    <div className="collectorInputs">
                      {collectorData.map((val, key) => (
                        <FtextField
                          key={key}
                          type={val.type}
                          label={val.label}
                          name={val.name}
                          validation={"true"}
                        />
                      ))}

                      {/* status */}
                      <div className="form-check customerFormCheck d-flex justify-content-around">
                        <div className="collectorStatus mt-2">
                          <div className="label">
                            <label className="form-control-label changeLabelFontColor">
                              {t("status")}
                              <span className="text-danger">*</span>
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <FtextField
                              label="Active"
                              className="form-check-input"
                              type="radio"
                              name="status"
                              value="active"
                            />
                          </div>
                          <div className="form-check form-check-inline">
                            <FtextField
                              label="Inactive"
                              className="form-check-input"
                              type="radio"
                              name="status"
                              value="inactive"
                            />
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
                              {" "}
                              {t("addStaff")}{" "}
                            </label>
                          </div>
                        )}
                      </div>
                      {/* status */}

                      {role === "ispOwner" && addStaffStatus && (
                        <FtextField
                          type="number"
                          label={t("salary")}
                          name="salary"
                        />
                      )}
                    </div>

                    {/* area */}
                    {/* area section*/}
                    <b className="mt-2"> {t("selectArea")} </b>
                    <div className="AllAreaClass">
                      {area?.map((val, key) => (
                        <div key={key}>
                          <h6 className="areaParent">{val.name}</h6>
                          {storeSubArea?.map(
                            (v, k) =>
                              v.area === val.id && (
                                <div key={k} className="displayFlex">
                                  <input
                                    id={v.id + "subAreas"}
                                    type="checkbox"
                                    className="getValueUsingClass"
                                    value={v.id}
                                    onChange={setAreaHandler}
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
                    {/* area */}
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

      {/* Model finish */}
    </div>
  );
}
