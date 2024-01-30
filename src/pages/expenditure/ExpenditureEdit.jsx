import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// internal import
import "./expenditure.css";
import Loader from "../../components/common/Loader";
import { FtextField } from "../../components/common/FtextField";
import { editExpenditure } from "../../features/apiCalls";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";

const EditExpenditure = ({ show, setShow, singleExp }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get expenditure purpose
  const expSectors = useSelector(
    (state) => state.expenditure.expenditurePourposes
  );

  // form validation
  const collectorValidator = Yup.object({
    amount: Yup.number().required("***"),
    newExp: Yup.string(),
    description: Yup.string(),
  });

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // purpose state
  const [purpose, setPurpose] = useState("");

  // description state
  const [description, setDescription] = useState(singleExp.description);

  // set data for state
  useEffect(() => {
    setPurpose(singleExp.expenditurePurpose);
    setDescription(singleExp?.description);
  }, [singleExp]);

  const expenditureHandler = (formdata, resetForm) => {
    if (purpose) {
      const data = {
        amount: formdata.amount,
        description,
        expenditurePurpose: purpose,
      };
      editExpenditure(
        dispatch,
        data,
        singleExp?.id,
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
        header={t("editExpenditure")}
      >
        <Formik
          initialValues={{
            newExp: "",
            amount: singleExp.amount,
            description: "",
          }}
          validationSchema={collectorValidator}
          onSubmit={(values, { resetForm }) => {
            expenditureHandler(values, resetForm);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <div className="displayGrid">
                <div>
                  <label className="form-control-label changeLabelFontColor">
                    {t("expenditureSectorsName")}
                  </label>
                  <select
                    className="form-select mw-100 mt-0"
                    name=""
                    id=""
                    onChange={(e) => setPurpose(e.target.value)}
                  >
                    <option value=""> {t("selectExpenseSector")} </option>
                    {expSectors?.map((exp, key) => {
                      return (
                        <option
                          selected={purpose === exp.id}
                          key={key}
                          value={exp.id}
                        >
                          {exp.name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <FtextField
                  type="number"
                  label={t("amount")}
                  name="amount"
                ></FtextField>

                <div>
                  <label className="form-control-label changeLabelFontColor">
                    {t("expenseDetails")}
                  </label>
                  <textarea
                    className="form-control shadow-none"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
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

export default EditExpenditure;
