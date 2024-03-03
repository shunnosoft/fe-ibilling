import React, { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { addSalaryApi, getStaffs } from "../../../features/apiCallStaff";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import moment from "moment";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const StaffSalaryPostModal = ({ show, setShow, staffId }) => {
  const { t } = useTranslation();

  const staff = useSelector((state) =>
    state.staff.staff.find((item) => item.id == staffId)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [newDate, setNewDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );

  const currentUser = useSelector(
    (state) => state.persistedReducer.auth.currentUser
  );

  const dispatch = useDispatch();
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  useEffect(() => {
    getStaffs(dispatch, ispOwner, setIsLoading);
  }, []);

  // validator
  const salaryValidaiton = Yup.object({
    amount: Yup.string().required(t("enterAmount")),
    remarks: Yup.string(),
  });

  // add salary handler function
  const staffSalaryHandler = (data, resetForm) => {
    const { remarks, amount } = data;
    const date = newDate.split("-");
    const year = date[0];
    const month = date[1];

    const sendingData = {
      amount,
      remarks,
      year,
      month,
      ispOwner,
      staff: staffId,
      user: currentUser.user.id,
    };

    addSalaryApi(dispatch, sendingData, resetForm, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="md"
        header={t("addSalary")}
      >
        <Formik
          initialValues={{
            amount: staff?.salary,
            remarks: "",
          }}
          validationSchema={salaryValidaiton}
          onSubmit={(values, { resetForm }) => {
            staffSalaryHandler(values, resetForm);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <div className="displayGrid">
                <div>
                  <label class="form-control-label changeLabelFontColor">
                    {t("salary")}
                  </label>
                  <input
                    className="form-control"
                    disabled
                    type="number"
                    value={staff?.salary}
                  />
                </div>

                <FtextField
                  label={t("amount")}
                  type="number"
                  name="amount"
                  validation={true}
                />

                <div>
                  <label className="form-control-label changeLabelFontColor">
                    {t("selectMonthAndYear")}
                  </label>

                  <input
                    className="form-control"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>

                <FtextField type="text" label={t("comment")} name="remarks" />
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
                  className="btn btn-success"
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

export default StaffSalaryPostModal;
