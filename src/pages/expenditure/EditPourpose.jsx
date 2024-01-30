import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// internal imports
import "../collector/collector.css";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import { editExpenditurePourpose } from "../../features/apiCalls";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";

const EditPourpose = ({ show, setShow, singlePurpose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  // POST
  const purposeHandler = async (data, resetForm) => {
    const sendingData = {
      ...singlePurpose,
      name: data.name,
    };

    editExpenditurePourpose(
      dispatch,
      sendingData,
      setIsLoading,
      resetForm,
      setShow
    );
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("editExpenditureSector")}
      >
        <Formik
          initialValues={{
            name: singlePurpose.name,
          }}
          validationSchema={linemanValidator}
          onSubmit={(values, { resetForm }) => {
            purposeHandler(values, resetForm);
          }}
          enableReinitialize
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

export default EditPourpose;
