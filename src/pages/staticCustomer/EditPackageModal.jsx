import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
// import { collectorData } from "../CollectorInputs";
import "../Customer/customer.css";
// import { FtextField } from "../../../components/common/FtextField";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import { editPackagewithoutmikrotik } from "../../features/apiCalls";
import { useTranslation } from "react-i18next";

export default function EditPackage(props) {
  const { t } = useTranslation();

  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // get isp owner id from state
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // form validator
  const collectorValidator = Yup.object({
    name: Yup.string().required(t("enterPackageName")),

    rate: Yup.number()
      .integer()
      .min(1, t("minimumPackageRate1"))
      .required(t("enterPackageRate")),

    // refName: Yup.string().required("রেফারেন্স নাম"),
    // refMobile: Yup.string()
    //   .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
    //   .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
    //   .required("মোবাইল নম্বর দিন "),
  });

  // get mikrotik
  const mikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );

  // handle edit function
  const packageEditHandler = (data) => {
    // console.log(data);
    const sendingData = {
      ...data,
      id: props.package?.id,
      ispOwner: ispOwnerId,
    };

    // edit api call
    editPackagewithoutmikrotik(sendingData, dispatch, setIsLoading);
  };

  return (
    <div>
      {/* Model start */}
      <div
        className="modal fade modal-dialog-scrollable "
        id="editPackage"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("editPackage")}
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
                  mikrotik: props.package?.mikrotik,
                  name: props.package?.name,
                  rate: props.package?.rate,
                }}
                validationSchema={collectorValidator}
                onSubmit={(values) => {
                  packageEditHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <div className="collectorInputs">
                      <div
                        className="newDisplayforpackage"
                        style={{ alignItems: "start" }}
                      >
                        <label
                          htmlFor="mikrotik"
                          className="changeLabelFontColor"
                        >
                          Disabled input
                        </label>
                        <Field
                          as="select"
                          name="mikrotik"
                          className="form-select mt-1 mb-4 select-box"
                          aria-label="Default select example"
                        >
                          {mikrotik.map((item) => (
                            <option
                              value={item.id}
                              selected={item?.id === props.package?.mikrotik}
                            >
                              {item?.name}
                            </option>
                          ))}
                        </Field>

                        <FtextField
                          type="text"
                          label={t("packageName")}
                          name="name"
                        />
                        <FtextField
                          min={0}
                          type="number"
                          label={t("packageRate")}
                          name="rate"
                        />
                      </div>
                    </div>

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
