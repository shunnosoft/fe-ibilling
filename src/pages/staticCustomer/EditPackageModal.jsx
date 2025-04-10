import React, { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../Customer/customer.css";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import { updateWithoutMikrotikPackage } from "../../features/apiCalls";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";

const EditPackage = ({ show, setShow, singlePackage }) => {
  const { t } = useTranslation();

  // import dispatch
  const dispatch = useDispatch();

  // get isp owner id from state
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // form validator
  const collectorValidator = Yup.object({
    name: Yup.string().required(t("enterPackageName")),
    rate: Yup.number()
      .integer()
      .min(1, t("minimumPackageRate1"))
      .required(t("enterPackageRate")),
  });

  // handle edit function
  const packageEditHandler = (data) => {
    const sendingData = {
      ...data,
      id: singlePackage?.id,
      ispOwner: ispOwnerId,
    };

    // edit api call
    updateWithoutMikrotikPackage(sendingData, dispatch, setIsLoading);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={singlePackage?.name + " " + t("rateEdit")}
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
