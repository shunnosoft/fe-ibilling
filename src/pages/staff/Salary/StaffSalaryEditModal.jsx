import React, { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import * as Yup from "yup";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { updateSalary } from "../../../features/apiCallStaff";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function StaffSalaryEditModal({ salaryId }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const dispatch = useDispatch();
  const salaryInfo = useSelector((state) =>
    state.staff.salary.find((item) => item.id === salaryId)
  );

  let restSalary = Number(salaryInfo?.due) - amount;

  //validator
  // const salaryValidaiton = Yup.object({
  //   amount: Yup.string().required(t("enterAmount")),
  // });

  const staffSalaryEditHandler = (data, resetForm) => {
    if (!amount) {
      toast.warning("Salary Field is required");
    }
    const { remarks } = data;
    const date = data.date.split("-");
    const year = date[0];
    const month = date[1];
    const sendingData = {
      amount,
      due: restSalary,
      remarks,
      year,
      month,
    };
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
        <div className="modal-dialog">
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
                  date: salaryInfo?.year + "-0" + salaryInfo?.month || "",
                  remarks: salaryInfo?.remarks || "",
                }}
                // validationSchema={salaryValidaiton}
                onSubmit={(values, { resetForm }) => {
                  staffSalaryEditHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form className="p-5">
                    {/* first part */}

                    <div>
                      <h6 class="form-label">{t("amount")}</h6>
                      <input
                        className="form-control mb-3"
                        type="number"
                        onChange={(event) => setAmount(event.target.value)}
                      />
                    </div>
                    <div>
                      <h6 class="form-label">{t("due")}</h6>
                      <input
                        className="form-control mb-3"
                        type="number"
                        disabled
                        value={restSalary}
                      />
                    </div>

                    <FtextField
                      type="date"
                      label={t("selectMonthAndYear")}
                      name="date"
                    />

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
