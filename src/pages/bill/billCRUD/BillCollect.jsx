import { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
//internal imports
import { FtextField } from "../../../components/common/FtextField";
import "../../Customer/customer.css";

export default function CustomerBillCollect({ singleCustomer }) {
  const [collectedBy, setCollectedBy] = useState("manager");
  const [billType, setBillType] = useState("bill");
  const ispOwner = useSelector((state) => state.auth?.ispOwnerId);
  const currentUser = useSelector((state) => state.auth?.currentUser);

  const BillValidatoin = Yup.object({
    amount: Yup.string().required("Please insert amount."),
  });
  // bill amount
  const customerBillHandler = (data) => {
    const sendingData = {
      amount: data.amount,
      collectedBy: collectedBy,
      billType: billType,
      customer: singleCustomer.id,
      ispOwner: ispOwner,
      collectorId: currentUser?.collector?.id, //when collector is logged in
    };

    console.log("Colelcted Bill: ", sendingData);
  };

  return (
    <div>
      <div>
        <div
          className="modal fade"
          id="collectCustomerBillModal"
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
                  বিল গ্রহণ
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
                      <FtextField type="text" name="amount" label="পরিমান" />

                      <label>কে কালেক্ট করছে </label>
                      <select
                        class="form-select"
                        onChange={(e) => setCollectedBy(e.target.value)}
                      >
                        <option value="manager">ম্যানেজার</option>
                        <option value="collector">কালেক্টর</option>
                      </select>

                      <label className="mt-3">ধরণ</label>
                      <select
                        class="form-select"
                        onChange={(e) => setBillType(e.target.value)}
                      >
                        <option value="bill">বিল</option>
                        <option value="connectionFee">কানেকশন ফি</option>
                      </select>

                      <div className="mt-3">
                        <button type="submit" className="btn btn-success">
                          সাবমিট
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
