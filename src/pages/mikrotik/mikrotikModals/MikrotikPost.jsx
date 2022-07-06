import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { postMikrotik } from "../../../features/apiCalls";
// import { postMikrotik } from "../../../features/mikrotikSlice";
// import { fetchMikrotik } from "../../../features/mikrotikSlice";
import { useTranslation } from "react-i18next";

export default function MikrotikPost() {
  const { t } = useTranslation();
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  //validator
  const mikrotikValidator = Yup.object({
    name: Yup.string().required("নাম দিতে হবে"),
    username: Yup.string().required("ইউজারনেম দিতে হবে "),
    host: Yup.string().required("মাইক্রোটিক আইপি দিতে হবে"),
    port: Yup.string().required("পোর্ট দিতে হবে"),
    password: Yup.string().required("পাসওয়ার্ড দিতে হবে"),
  });

  // mikrotik handler
  const mikrotikHandler = (data) => {
    if (auth.ispOwner) {
      const sendingData = {
        ...data,
        ispOwner: auth.ispOwner.id,
      };
      postMikrotik(dispatch, sendingData, setIsLoading);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="MikrotikModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addNewMikrotik")}
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
                  name: "",
                  username: "",
                  host: "",
                  port: "",
                  password: "",
                }}
                validationSchema={mikrotikValidator}
                onSubmit={(values) => {
                  mikrotikHandler(values);
                }}
              >
                {() => (
                  <Form>
                    <FtextField type="text" label={t("name")} name="name" />
                    <FtextField
                      type="text"
                      label={t("userName")}
                      name="username"
                    />
                    <FtextField
                      type="text"
                      label={t("mikrotikIP")}
                      name="host"
                    />
                    <FtextField type="text" label={t("port")} name="port" />
                    <FtextField
                      type="password"
                      label={t("password")}
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
