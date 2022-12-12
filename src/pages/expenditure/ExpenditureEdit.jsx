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
  // console.log(singleExp);
  const [isLoading, setIsLoading] = useState(false);
  const [pourpose, setPourpose] = useState("");
  const [des, setDes] = useState(singleExp.description);
  console.log(des);
  const expSectors = useSelector(
    (state) => state.expenditure.expenditurePourposes
  );
  const dispatch = useDispatch();

  const desRef = useRef();
  const collectorValidator = Yup.object({
    amount: Yup.number().required("***"),
    newExp: Yup.string(),
    description: Yup.string(),
  });

  useEffect(() => {
    setPourpose(singleExp.expenditurePurpose);
  }, [singleExp]);
  const handleSelect = (e) => {
    setPourpose(e.target.value);
  };
  const expenditureHandler = async (formdata, resetForm) => {
    if (pourpose !== "") {
      const data = {
        ...singleExp,
        amount: formdata.amount,
        description: desRef.current.value,
        expenditurePurpose: pourpose,
      };

      await editExpenditure(dispatch, data, setIsLoading, resetForm);
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
                          onChange={handleSelect}
                        >
                          <option value=""> {t("selectExpenseSector")} </option>
                          {expSectors?.map((exp, key) => {
                            return (
                              <option
                                selected={pourpose === exp.id}
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
                        ref={desRef}
                        value={des}
                        onChange={(e) => setDes(e.target.value)}
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
