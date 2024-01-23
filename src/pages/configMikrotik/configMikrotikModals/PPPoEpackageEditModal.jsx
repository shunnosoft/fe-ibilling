import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { editPPPoEpackageRate } from "../../../features/apiCalls";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const PPPoEpackageEditModal = ({ show, setShow, singlePackage }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get pppoe package from redux store
  const pppoePackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  // find single pppoe package
  const data = pppoePackage.find((item) => item.id === singlePackage);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  //validator
  const pppoeValidator = Yup.object({
    rate: Yup.number(),
  });

  // edit pppoe package handler
  const pppoeEditHandler = async (formValue, resetForm) => {
    if (formValue) {
      const sendingData = {
        rate: formValue.rate.toString(),
        mikrotikId: data?.mikrotik,
        pppPackageId: data?.id,
        aliasName: formValue.aliasName,
      };
      editPPPoEpackageRate(
        dispatch,
        sendingData,
        setIsLoading,
        resetForm,
        setShow
      );
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={data?.name + " " + t("rateEdit")}
      >
        <Formik
          initialValues={{
            rate: data?.rate || "",
            aliasName: data?.aliasName || "",
          }}
          validationSchema={pppoeValidator}
          onSubmit={(values, { resetForm }) => {
            pppoeEditHandler(values, resetForm);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <div className="displayGrid">
                <FtextField
                  min={0}
                  type="number"
                  label={t("packageRate")}
                  name="rate"
                />

                <FtextField
                  min={0}
                  type="text"
                  label={t("packageAliasName")}
                  name="aliasName"
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

export default PPPoEpackageEditModal;
