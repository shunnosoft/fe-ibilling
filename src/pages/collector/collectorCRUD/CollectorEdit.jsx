import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../components/common/Loader";
import { useSelector, useDispatch } from "react-redux";

// internal importsp
import { collectorData } from "../CollectorInputs";
import { FtextField } from "../../../components/common/FtextField";
import { editCollector, getManger } from "../../../features/apiCalls";
import { collectorPermission } from "./collectorPermission";
import { useTranslation } from "react-i18next";

// import { getArea } from "../../../features/areaSlice";
// import {
//   editCollector,
//   fetchCollector,
// } from "../../../features/collectorSlice";

export default function CollectorEdit({ collectorId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const collector = useSelector((state) => state?.collector?.collector);

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get permission
  const managerPermission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get bp settings
  const ispOwnerPermission = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get ispOwner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.ispOwner?.id
  );

  const single = collector.find((val) => val.id === collectorId);

  const area = useSelector((state) => state?.area?.area);
  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  const [allowedAreas, setAllowedAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (single) {
      setAllowedAreas(single?.areas);
      setPermissions(
        collectorPermission(
          single.permissions,
          role,
          ispOwnerPermission,
          managerPermission
        )
      );
    }
  }, [single, collector]);

  //validator
  const collectorValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
    mobile: Yup.string()
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber"))
      .required(t("writeMobileNumber")),
    address: Yup.string().required(t("enterAddress")),
    email: Yup.string().email(t("incorrectEmail")).required(t("enterEmail")),
    nid: Yup.string().required(t("enterNID")),
    status: Yup.string().required(t("enterStatus")),
  });

  const setAreaHandler = () => {
    const temp = document.querySelectorAll(".getValueUsingClass_Edit");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    setAllowedAreas(IDS_temp);
  };

  const collectorEditHandler = async (data) => {
    let temp = {};
    permissions.forEach((val) => {
      temp[val.value] = val.isChecked;
    });
    const newP = {
      ...single.permissions,
      ...temp,
    };
    if (single.ispOwner) {
      const sendingData = {
        ...data,
        areas: allowedAreas,
        ispOwner: single.ispOwner,
        ispOwnerId: single.ispOwner,
        collectorId: single.id,
        permissions: newP,
      };
      editCollector(dispatch, sendingData, setIsLoading);
    }
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    let temp = permissions.map((val) =>
      val.value === name ? { ...val, isChecked: checked } : val
    );

    setPermissions(temp);
  };
  return (
    <div>
      {/* Model start */}
      <div
        className="modal fade modal-dialog-scrollable "
        id="collectorEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {single?.name} {t("editProfile")}
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
                  name: single?.name || "",
                  mobile: single?.mobile || "",
                  address: single?.address || "",
                  email: single?.email || "",
                  nid: single?.nid || "",
                  status: single?.status || "",
                  //   refName: "N/A" || "",
                  //   refMobile: "N/A" || "",
                  // areas: single?.areas || [],
                }}
                validationSchema={collectorValidator}
                onSubmit={(values) => {
                  collectorEditHandler(values);
                }}
                enableReinitialize
              >
                {(formik) => (
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
                      <div className="form-check customerFormCheck">
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
                      {/* status */}
                    </div>

                    {/* area */}
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
                                    id={v.id}
                                    type="checkbox"
                                    className="getValueUsingClass_Edit"
                                    value={v.id}
                                    checked={
                                      allowedAreas?.includes(v.id)
                                        ? true
                                        : false
                                    }
                                    onChange={setAreaHandler}
                                  />
                                  <label htmlFor={v.id}>{v.name}</label>
                                </div>
                              )
                          )}
                        </div>
                      ))}
                    </div>

                    <b className="mt-2"> {t("changePermission")} </b>
                    <div className="AllAreaClass">
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
