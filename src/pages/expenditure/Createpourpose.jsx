import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
// import "../../collector/collector.css";
import "../collector/collector.css";

import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import { addExpenditurePourpose } from "../../features/apiCalls";
import { useTranslation } from "react-i18next";

export default function CreatePourpose() {
  const { t } = useTranslation();
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  // POST
  const purposeHandler = async (data, resetForm) => {
    if (userRole === "ispOwner") {
      const sendingData = {
        name: data.name,

        ispOwner: userData.id,
      };

      addExpenditurePourpose(dispatch, sendingData, setIsLoading, resetForm);
    }
    if (userRole === "reseller") {
      const sendingData = {
        name: data.name,
        reseller: userData.id,
      };

      addExpenditurePourpose(dispatch, sendingData, setIsLoading, resetForm);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="createPourpose"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addNewExpenditureSector")}
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
                  // ispOwner:
                }}
                validationSchema={linemanValidator}
                onSubmit={(values, { resetForm }) => {
                  purposeHandler(values, resetForm);
                }}
              >
                {(formik) => (
                  <Form>
                    <FtextField
                      type="text"
                      label={t("expenditureSectorsName")}
                      name="name"
                    />

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
    </div>
  );
}
