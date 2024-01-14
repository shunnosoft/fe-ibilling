import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import Loader from "../../components/common/Loader";
import * as Yup from "yup";
import "./expenditure.css";
import { FtextField } from "../../components/common/FtextField";
import { Plus } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { addExpenditure } from "../../features/apiCalls";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
export default function CreateExpenditure() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [pourpose, setPourpose] = useState("");
  const expSectors = useSelector(
    (state) => state.expenditure.expenditurePourposes
  );
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  // user collection balance
  const balance = useSelector((state) =>
    userRole === "ispOwner"
      ? state.chart.customerStat.ispOwner?.ownBalance
      : state?.payment?.balance
  );

  const desRef = useRef("");
  const collectorValidator = Yup.object({
    amount: Yup.number().required("***"),
    newExp: Yup.string(),
    description: Yup.string(),
  });

  // useEffect(() => {
  // }, [ispOwnerId, dispatch]);
  const handleSelect = (e) => {
    // console.log(e.target.value);
    setPourpose(e.target.value);
  };
  const expenditureHandler = async (formdata, resetForm) => {
    if (balance <= formdata.amount) {
      setIsLoading(false);
      return toast.error(t("youDoNotHaveEnoughCollectionBalance"));
    }

    if (pourpose !== "") {
      const data = {
        amount: formdata.amount,
        description: desRef.current.value,
        expenditurePurpose: pourpose,
        ispOwner: ispOwnerId,
      };
      userRole === "ispOwner"
        ? (data.ispOwner = userData.id)
        : userRole === "reseller"
        ? (data.reseller = userData.id)
        : (data.staff = userData.id);

      addExpenditure(dispatch, data, setIsLoading, resetForm);
      setPourpose("");
      desRef.current.value = "";
    }
  };
  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="createExpenditure"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("newExpenseAdd")}
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
                  amount: 0,
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
                        />
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
