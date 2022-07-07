import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { updateSalary } from "../../../features/apiCallStaff";
import { useTranslation } from "react-i18next";

export default function StaffSalaryEditModal({ salaryId }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const salaryInfo = useSelector((state) =>
    state.persistedReducer.staff.salary.find((item) => item.id === salaryId)
  );

  //validator
  const salaryValidaiton = Yup.object({
    amount: Yup.string().required("এমাউন্ট দিন"),
  });

  const staffSalaryEditHandler = (data, resetForm) => {
    const { amount, due, remarks } = data;
    const date = data.date.split("-");
    const year = date[0];
    const month = date[1];
    const sendingData = {
      amount,
      due,
      remarks,
      year,
      month,
    };
    // console.log(sendingData);
    updateSalary(dispatch, salaryId, sendingData, setIsLoading);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="editSalaryPostModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("updateSalary")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* model body here */}
              <Formik
                initialValues={{
                  amount: salaryInfo?.amount || "",
                  due: salaryInfo?.due || "",
                  date: salaryInfo?.year + "-0" + salaryInfo?.month || "",
                  remarks: salaryInfo?.remarks || "",
                }}
                validationSchema={salaryValidaiton}
                onSubmit={(values, { resetForm }) => {
                  staffSalaryEditHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form className="p-5">
                    {/* first part */}

                    <div className="displayGrid3">
                      <FtextField
                        type="text"
                        label={t("amount")}
                        name="amount"
                      />
                      <FtextField type="text" label={t("due")} name="due" />
                      <FtextField
                        type="month"
                        label={t("selectMonthAndYear")}
                        name="date"
                      />
                    </div>

                    <FtextField
                      type="text"
                      label={t("comment")}
                      name="remarks"
                    />

                    <div className="modal-footer modalFooterEdit">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isLoading}
                      >
                        {isLoading ? <Loader /> : t("save")}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        disabled={isLoading}
                      >
                        {t("cancel")}
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
