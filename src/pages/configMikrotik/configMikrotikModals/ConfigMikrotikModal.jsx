import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { editSingleMikrotik } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
// import {
//   fetchSingleMikrotik,
//   editSingleMikrotik,
// } from "../../../features/mikrotikSlice";

export default function ConfigMikrotikModal(props) {
  const { t } = useTranslation();
  // const auth = useSelector(state => state.persistedReducer.auth.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { mik } = props;

  //validator
  const mikrotikValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
    username: Yup.string().required(t("enterUserName")),
    host: Yup.string().required(t("enterMikrotikIP")),
    port: Yup.string().required(t("enterPort")),
    password: Yup.string().required(t("enterPassword")),
  });

  const mikrotikHandler = async (data) => {
    setIsLoading(true);
    if (mik) {
      const sendingData = {
        ...data,
        id: mik.id,
        ispOwner: mik.ispOwner,
        ispId: mik.ispOwner,
      };

      editSingleMikrotik(dispatch, sendingData);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="configMikrotikModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("editMkrotik")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* model body here */}
              <Formik
                initialValues={{
                  name: mik?.name || "",
                  username: mik?.username || "",
                  host: mik?.host || "",
                  port: mik?.port || "",
                  password: "",
                }}
                validationSchema={mikrotikValidator}
                onSubmit={(values) => {
                  mikrotikHandler(values);
                }}
                enableReinitialize
              >
                {() => (
                  <Form>
                    <FtextField
                      type="text"
                      label={t("mikrotikName")}
                      name="name"
                      disabled
                    />
                    <FtextField
                      type="text"
                      label={t("mikrotikUserName")}
                      name="username"
                    />
                    <FtextField
                      type="text"
                      label={t("mikrotikIP")}
                      name="host"
                    />
                    <FtextField
                      type="text"
                      label={t("mikrotikApiPort")}
                      name="port"
                    />
                    <FtextField
                      type="password"
                      label={t("mikrotikUserPassword")}
                      name="password"
                    />

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        {t("cancel")}
                      </button>
                      <button type="submit" className="btn btn-success">
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
