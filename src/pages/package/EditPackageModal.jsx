import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// internal imports
import "../Customer/customer.css";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import { editPackagewithoutmikrotik } from "../../features/apiCalls";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";

const EditPackage = ({ show, setShow, singlePackage }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id from redux store
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  //validator
  const collectorValidator = Yup.object({
    name: Yup.string().required(t("enterPackageName")),
    rate: Yup.number()
      .integer()
      .min(1, t("minimumPackageRate1"))
      .required(t("enterPackageRate")),
  });

  // package edit handler
  const packageEditHandler = (data) => {
    const sendingData = {
      ...data,
      id: singlePackage?.id,
      ispOwner: ispOwnerId,
    };

    editPackagewithoutmikrotik(sendingData, dispatch, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("editPackage")}
      >
        <Formik
          initialValues={{
            name: singlePackage?.name,
            rate: singlePackage?.rate,
          }}
          validationSchema={collectorValidator}
          onSubmit={(values) => {
            packageEditHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <div className="displayGrid">
                <FtextField type="text" label={t("packageName")} name="name" />

                <FtextField
                  min={0}
                  type="number"
                  label={t("packageRate")}
                  name="rate"
                />
              </div>

              <div className="displayGrid1 float-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={isLoading}
                  onClick={() => setShow(false)}
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
      </ComponentCustomModal>
    </>
  );
};

export default EditPackage;
