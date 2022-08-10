import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loader from "../../../components/common/Loader";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import { collectorData } from "../CollectorInputs";
import "../../Customer/customer.css";
import { FtextField } from "../../../components/common/FtextField";
import { addCollector } from "../../../features/apiCallReseller";
// import { addCollector } from "../../../features/apiCalls";
// import { getArea, fetchArea } from "../../../features/areaSlice";
// import {
//   postCollector,
//   fetchCollector,
// } from "../../../features/collectorSlice";
import { useTranslation } from "react-i18next";

export default function CollectorPost() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const area = useSelector((state) => state.area.area);
  const [areaIds, setAreaIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  //validator
  const collectorValidator = Yup.object({
    name: Yup.string().required(`${t("name")} ***`),
    mobile: Yup.string()
      .min(11, `${t("write11DigitMobileNumber")}***`)
      .max(11, t("over11DigitMobileNumber"))
      .required(`${t("writeMobileNumber")} ***`),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    status: Yup.string(),

    // refName: Yup.string().required("রেফারেন্স নাম"),
    // refMobile: Yup.string()
    //   .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
    //   .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
    //   .required("মোবাইল নম্বর দিন "),
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
    // console.log(data);

    const sendingData = {
      ...data,
      areas: areaIds,
      reseller: auth.reseller.id,
      ispOwner: ispOwnerId,
    };
    addCollector(dispatch, sendingData, setIsLoading);
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
                  status: "active",
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
                        />
                      ))}

                      {/* status */}
                      <div className="form-check customerFormCheck">
                        <p>{t("status")}</p>
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
                    {/* area section*/}
                    <b className="mt-2">{t("selectArea")}</b>
                    <div className="AllAreaClass">
                      {area?.map((val, key) => (
                        <div key={key} className="displayFlex">
                          <input
                            type="checkbox"
                            className="getValueUsingClass"
                            value={val.id}
                            onChange={setAreaHandler}
                          />
                          <label>{val.name}</label>
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
