import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

// internal imports
import "../collector/collector.css";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import { addExpenditurePourpose } from "../../features/apiCalls";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";

const CreatePourpose = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, userData } = useISPowner();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  // add new purpose handler
  const purposeHandler = async (data, resetForm) => {
    if (role === "ispOwner") {
      const sendingData = {
        name: data.name,

        ispOwner: userData.id,
      };

      addExpenditurePourpose(
        dispatch,
        sendingData,
        setIsLoading,
        resetForm,
        setShow
      );
    }

    if (role === "reseller") {
      const sendingData = {
        name: data.name,
        reseller: userData.id,
      };

      addExpenditurePourpose(
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
        header={t("addNewExpenditureSector")}
      >
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={linemanValidator}
          onSubmit={(values, { resetForm }) => {
            purposeHandler(values, resetForm);
          }}
        >
          {() => (
            <Form>
              <FtextField
                type="text"
                label={t("expenditureSectorsName")}
                name="name"
              />

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

export default CreatePourpose;
