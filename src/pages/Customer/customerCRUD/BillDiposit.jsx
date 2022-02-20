// import { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
//internal imports
import { FtextField } from "../../../components/common/FtextField";
import "../../Customer/customer.css";

export default function BillDiposit({ singleCustomer }) {
  const ispOwner = useSelector((state) => state.auth?.ispOwnerId);
  const currentUser = useSelector((state) => state.auth?.currentUser);

  const BillValidatoin = Yup.object({
    amount: Yup.string().required("Please insert amount."),
  });

  // bill amount
  const billDipositHandler = (data) => {
    const sendingData = {
      depositBy: currentUser?.user.role,
      amount: data.amount,
      balance: data.balance,
      user: currentUser?.user.id,
      ispOwner: ispOwner,
    };

    console.log("Diposit Bill: ", sendingData);
  };

  return (
    <div>
      <div>
        <div
          className="modal fade"
          id="billDipositeModal"
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
                  ডিপোজিট
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
                    balance: "xyz", //put the value from api
                  }}
                  validationSchema={BillValidatoin}
                  onSubmit={(values) => {
                    billDipositHandler(values);
                  }}
                >
                  {() => (
                    <Form>
                      <FtextField
                        type="text"
                        name="balance"
                        label="মোট ব্যালান্স"
                        disabled
                      />
                      <FtextField
                        type="text"
                        name="amount"
                        label="ডিপোজিট পরিমান"
                      />

                      <div className="mt-4">
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
