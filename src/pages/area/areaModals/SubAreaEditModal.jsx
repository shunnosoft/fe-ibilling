import { Formik, Form } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { editSubArea } from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";

const SubAreaEditModal = ({ subAreaName, subAreaID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwner Id
  const ownerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const subAreaValidation = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  // Edit subarea
  const subAreaEditHandler = (values) => {
    const IDs = {
      ispOwnerID: ownerId,
      id: subAreaID,
      name: values.name,
    };
    editSubArea(dispatch, IDs, setIsLoading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="areaSubAreaEdit"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("editSubArea")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div>
              <Formik
                initialValues={{
                  name: subAreaName || "",
                }}
                validationSchema={subAreaValidation}
                onSubmit={(values) => {
                  subAreaEditHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form id="subArea">
                    <FtextField
                      type="text"
                      label={t("subAreaName")}
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
                        form="subArea"
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
};

export default SubAreaEditModal;
