import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import Loader from "../../components/common/Loader";
import * as Yup from "yup";
import "./expenditure.css";
import { FtextField } from "../../components/common/FtextField";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { editExpenditure } from "../../features/apiCalls";
export default function EditExpenditure({ singleExp }) {
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
      editExpenditure(dispatch, data, singleExp?.id, setIsLoading, resetForm);
    }
  };
  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="editExpenditure"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("editExpenditure")}
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
                    <div className="d-flex">
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
                      <div className="newexp ms-2">
                        <FtextField
                          type="number"
                          label={t("amount")}
                          name="amount"
                        ></FtextField>
                      </div>
                    </div>

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
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
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
