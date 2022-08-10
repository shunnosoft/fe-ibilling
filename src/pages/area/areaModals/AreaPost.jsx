import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";

import { addArea } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";

export default function AreaPost() {
  const { t } = useTranslation();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  // POST
  const areaHandler = async (data) => {
    setIsLoading(true);
    if (ispOwnerId) {
      const sendingData = {
        name: data.name,
        ispOwner: ispOwnerId,
      };
      addArea(dispatch, sendingData, setIsLoading);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="areaModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addNewArea")}
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
                onSubmit={(values) => {
                  areaHandler(values);
                }}
              >
                {(formik) => (
                  <Form>
                    <FtextField type="text" label={t("areaName")} name="name" />

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
