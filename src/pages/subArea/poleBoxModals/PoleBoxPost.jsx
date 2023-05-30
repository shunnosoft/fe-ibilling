import { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { addPoleBox } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";

export default function PoleBoxPost({ subAreaId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get current user(ispOwner)
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);

  const [isLoading, setIsLoading] = useState(false);

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  //pole box post handler
  const poleBoxPost = async (data) => {
    if (auth.ispOwner) {
      const sendingData = {
        name: data.name,
        description: data.description,
        subArea: subAreaId,
        ispOwner: auth.ispOwner.id,
      };
      addPoleBox(dispatch, sendingData, setIsLoading);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="poleBoxPostModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addPoleBox")}
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
                  description: "",
                }}
                validationSchema={linemanValidator}
                onSubmit={(values) => {
                  poleBoxPost(values);
                }}
              >
                {() => (
                  <Form>
                    <div>
                      <div>
                        <FtextField type="text" label={t("name")} name="name" />
                        <Field
                          style={{
                            height: "100px",
                            width: "100%",
                            padding: "10px",
                          }}
                          className="form-control shadow-none"
                          component="textarea"
                          name="description"
                          placeholder={t("description")}
                        />
                      </div>
                    </div>

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
