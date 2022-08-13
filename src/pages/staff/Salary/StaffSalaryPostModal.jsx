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
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function StaffSalaryPostModal({ staffId }) {
  const { t } = useTranslation();

  const staff = useSelector((state) =>
    state.staff.staff.find((item) => item.id == staffId)
  );

  console.log(staff);

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState();
  console.log(amount);

  const restSalary = staff?.salary - amount;

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

  //validator
  // const salaryValidaiton = Yup.object({
  //   amount: Yup.string().required(t("enterAmount")),
  //   due: Yup.string().required(t("mentionDue")),
  // });

  const staffSalaryHandler = (data, resetForm) => {
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
      ispOwner,
      staff: staffId,
      user: currentUser.user.id,
    };
    // console.log(sendingData);
    addSalaryApi(dispatch, sendingData, resetForm, setIsLoading);
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="addSalaryPostModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addSalary")}
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
                  date: "",
                  remarks: "",
                }}
                // validationSchema={salaryValidaiton}
                onSubmit={(values, { resetForm }) => {
                  staffSalaryHandler(values, resetForm);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <div className="px-3">
                      <h6 class="form-label">{t("salary")}</h6>
                      <input
                        className="form-control mb-3"
                        disabled
                        type="number"
                        value={staff?.salary}
                      />

                      <h6 class="form-label">{t("amount")}</h6>
                      <input
                        className="form-control mb-3"
                        type="number"
                        onChange={(event) => setAmount(event.target.value)}
                      />

                      <h6 class="form-label">{t("due")}</h6>
                      <input
                        className="form-control mb-3"
                        type="number"
                        value={restSalary}
                        disabled
                      />

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
                    </div>

                    <div className="modal-footer border-none">
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
                        className="btn btn-success"
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
