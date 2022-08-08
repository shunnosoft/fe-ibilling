import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
// import { collectorData } from "../CollectorInputs";
import "../Customer/customer.css";
// import { FtextField } from "../../../components/common/FtextField";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import { addPackagewithoutmikrotik } from "../../features/apiCalls";
import { useTranslation } from "react-i18next";

export default function CreatePackage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const area = useSelector((state) => state.persistedReducer.area.area);
  const [areaIds, setAreaIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //validator
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

  const packageAddHandler = (data) => {
    const sendingData = {
      ...data,
      ispOwner: ispOwnerId,
    };

    addPackagewithoutmikrotik(sendingData, dispatch, setIsLoading);
  };

  return (
    <div>
      {/* Model start */}
      <div
        className="modal fade modal-dialog-scrollable "
        id="createPackage"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addNewPackage")}
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
                  rate: 1,
                }}
                validationSchema={collectorValidator}
                onSubmit={(values) => {
                  packageAddHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <div className="collectorInputs">
                      <div className="newDisplayforpackage">
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
