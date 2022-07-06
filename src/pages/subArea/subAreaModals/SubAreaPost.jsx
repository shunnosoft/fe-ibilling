import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";

import { addSubArea } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";

export default function SubAreaPost({ name, id }) {
  const { t } = useTranslation();
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const [isLoading, setIsLoading] = useState(false);

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
  });

  const dispatch = useDispatch();

  const subAreaHandler = async (data) => {
    setIsLoading(true);

    if (auth.ispOwner) {
      const sendingData = {
        name: data.name,
        area: id,
        ispOwner: auth.ispOwner.id,
      };
      addSubArea(dispatch, sendingData, setIsLoading);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="subAreaModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {name || ""} - {t("addSubArea")}
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
                }}
                validationSchema={linemanValidator}
                onSubmit={(values) => {
                  subAreaHandler(values);
                }}
              >
                {() => (
                  <Form>
                    <FtextField
                      type="text"
                      label={t("nameSubArea")}
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
