import { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
//internal imports
import { FtextField } from "../../../components/common/FtextField";
import "../../Customer/customer.css";
import { useTranslation } from "react-i18next";
export default function CustomerBillCollect({ singleCustomer }) {
  const { t } = useTranslation();
  const [billType, setBillType] = useState("bill");
  const ispOwner = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  const currentUser = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser
  );

  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(0, t("billNotAcceptable"))
      .integer(t("decimalNumberNotAcceptable")),
  });
  // bill amount
  const customerBillHandler = (data) => {
    const sendingData = {
      amount: data.amount,
      collectedBy: "",
      billType: billType,
      customer: singleCustomer.id,
      ispOwner: ispOwner,
      collectorId: currentUser?.collector?.id, //when collector is logged in
    };
  };

  return (
    <div>
      <div>
        <div
          className="modal fade"
          id="collectBillModal"
          tabIndex="-1"
          aria-labelledby="customerModalDetails"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  style={{ color: "#0abb7a" }}
                  className="modal-title"
                  id="customerModalDetails"
                >
                  {t("collectBill")}
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
                    amount: "",
                    // collectorId,customer,ispOwner
                  }}
                  validationSchema={BillValidatoin}
                  onSubmit={(values) => {
                    customerBillHandler(values);
                  }}
                >
                  {() => (
                    <Form>
                      <FtextField
                        type="number"
                        name="amount"
                        label={t("amount")}
                      />

                      <label className="mt-3">{t("type")}</label>
                      <select
                        className="form-select"
                        onChange={(e) => setBillType(e.target.value)}
                      >
                        <option value="bill">{t("bill")}</option>
                        <option value="connectionFee">
                          {t("connectionFee")}
                        </option>
                      </select>

                      <div className="mt-3">
                        <button type="submit" className="btn btn-success">
                          {t("submit")}
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
    </div>
  );
}
