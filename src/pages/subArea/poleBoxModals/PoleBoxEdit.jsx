import { Field, Form, Formik } from "formik";
import { t } from "i18next";
import React from "react";
import * as Yup from "yup";
import { FtextField } from "../../../components/common/FtextField";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editPoleBox } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";

const PoleBoxEdit = ({ poleId, subAreaId }) => {
  const dispatch = useDispatch();

  // get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //get specific pole
  const singlePole = useSelector((state) => state.area?.poleBox).find(
    (val) => val.id === poleId
  );

  const [isLoading, setIsLoading] = useState(false);

  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  // Edit subarea
  const poleBoxEdit = async (data) => {
    const sendingData = {
      name: data.name,
      description: data.description,
      // subArea: subAreaId,
      // ispOwner: ispOwnerId,
    };
    editPoleBox(dispatch, sendingData, ispOwnerId, poleId, setIsLoading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="poleBoxEditModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("editPoleBox")}
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
                name: singlePole?.name || "",
                description: singlePole?.description || "",
              }}
              validationSchema={linemanValidator}
              onSubmit={(values) => {
                poleBoxEdit(values);
              }}
              enableReinitialize
            >
              {() => (
                <Form>
                  <div>
                    <div>
                      <FtextField type="text" label={t("name")} name="name" />

                      <label
                        className="changeLabelFontColor"
                        htmlFor="description"
                      >
                        {t("description")}
                      </label>
                      <Field
                        style={{
                          height: "100px",
                          width: "100%",
                          padding: "10px",
                        }}
                        className="form-control shadow-none"
                        component="textarea"
                        name="description"
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
  );
};

export default PoleBoxEdit;
