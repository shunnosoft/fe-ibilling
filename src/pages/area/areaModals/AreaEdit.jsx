import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { editArea } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";

export default function AreaEdit({ oneArea }) {
  const { t } = useTranslation();
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  // const area = useSelector(state => state.area.area);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //validator
  const areaEditValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  const areaEditHandler = async (data) => {
    setIsLoading(true);
    if (ispOwnerId) {
      const sendingData = {
        name: data.name,
        ispOwner: ispOwnerId,
        id: oneArea ? oneArea.id : "",
      };
      editArea(dispatch, sendingData, setIsLoading);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="areaEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("editArea")}
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
                  name: oneArea.name || "",
                }}
                validationSchema={areaEditValidator}
                onSubmit={(values) => {
                  areaEditHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <FtextField
                      type="text"
                      label={t("editAreaName")}
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
