import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { postMikrotik } from "../../../features/apiCalls";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const MikrotikPost = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwner id from redux
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  //validator
  const mikrotikValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
    username: Yup.string().required(t("enterUserName")),
    host: Yup.string().required(t("enterMikrotikIP")),
    port: Yup.string().required(t("enterPort")),
    password: Yup.string().required(t("enterPassword")),
  });

  // mikrotik handler
  const mikrotikHandler = (data) => {
    if (ispOwnerId) {
      const sendingData = {
        ...data,
        ispOwner: ispOwnerId,
      };
      postMikrotik(dispatch, sendingData, setIsLoading, setShow);
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("addNewMikrotik")}
      >
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
              <div className="displayGrid">
                <FtextField type="text" label={t("mikrotikName")} name="name" />

                <FtextField
                  type="text"
                  label={t("mikrotikUserName")}
                  name="username"
                />

                <FtextField type="text" label={t("mikrotikIP")} name="host" />

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
              </div>
              <div className="displayGrid1 float-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}
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
      </ComponentCustomModal>
    </>
  );
};

export default MikrotikPost;
