import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

// internal import
import "./expenditure.css";
import Loader from "../../components/common/Loader";
import { FtextField } from "../../components/common/FtextField";
import { addExpenditure } from "../../features/apiCalls";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";

const CreateExpenditure = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const desRef = useRef("");

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId, userData } = useISPowner();

  // get all expenditure purpose
  const expSectors = useSelector(
    (state) => state.expenditure.expenditurePourposes
  );

  // user collection balance
  const balance = useSelector(
    (state) => role === "collector" && state?.payment?.balance
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // set data for state
  const [pourpose, setPourpose] = useState("");

  // form validation
  const collectorValidator = Yup.object({
    amount: Yup.number().required("***"),
    newExp: Yup.string(),
    description: Yup.string(),
  });

  const handleSelect = (e) => {
    setPourpose(e.target.value);
  };

  // add expenditure handler
  const expenditureHandler = async (formdata, resetForm) => {
    if (role === "collector" && balance <= formdata.amount) {
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
      role === "ispOwner"
        ? (data.ispOwner = userData.id)
        : role === "reseller"
        ? (data.reseller = userData.id)
        : (data.staff = userData.id);

      addExpenditure(dispatch, data, setIsLoading, resetForm, setShow);
      setPourpose("");
      desRef.current.value = "";
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("newExpenseAdd")}
      >
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
              <div className="displayGrid">
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

                <FtextField type="number" label={t("amount")} name="amount" />

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

export default CreateExpenditure;
