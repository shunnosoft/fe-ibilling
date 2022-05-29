import { useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
//internal imports
import { FtextField } from "../../../components/common/FtextField";
import "../../Customer/customer.css";
import { useDispatch } from "react-redux";
import { billCollect } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";
import ReactToPrint from "react-to-print";
import BillCollectInvoice from "./customerBillCollectInvoicePDF";

export default function CustomerBillCollect({ single }) {
  const billRef = useRef();
  const [billType, setBillType] = useState("bill");
  const [amount, setAmount] = useState(null);
  // const [defaultAmount, setDefault] = useState(single.monthlyFee);

  // const [defaultAmount, setDefault] = useState(single?.monthlyFee);
  const ispOwner = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  const currentUser = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser
  );

  const currentUserId = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.id
  );
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const BillValidatoin = Yup.object({
    amount: Yup.number().required("Please insert amount."),
  });
  // bill amount
  const customerBillHandler = (data) => {
    const sendingData = {
      amount: data.amount,
      collectedBy: currentUser?.user.role,
      billType: billType,
      customer: single?.id,
      ispOwner: ispOwner,
      user: currentUser?.user.id,
      collectorId: currentUserId, //when collector is logged in
      userType: single?.userType,
    };
    setAmount(data.amount);
    billCollect(dispatch, sendingData, setLoading);
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
                    amount:
                      single?.balance < single?.monthlyFee
                        ? single?.monthlyFee - single?.balance
                        : single?.monthlyFee,
                    // collectorId,customer,ispOwner
                  }}
                  validationSchema={BillValidatoin}
                  onSubmit={(values) => {
                    customerBillHandler(values);
                  }}
                  enableReinitialize
                >
                  {() => (
                    <Form>
                      <h4>Name:{single?.name}</h4>
                      <h4>ID:{single?.customerId}</h4>

                      <FtextField type="number" name="amount" label="পরিমান" />
                      <label>ধরণ</label>
                      <select
                        className="form-select"
                        onChange={(e) => setBillType(e.target.value)}
                      >
                        <option value="bill">বিল</option>
                        <option value="connectionFee">কানেকশন ফি</option>
                      </select>

                      <div className="mt-4">
                        <button type="submit" className="btn btn-success">
                          {isLoading ? <Loader /> : "সাবমিট"}
                        </button>
                        {/* for invoice print  */}
                        <ReactToPrint
                          documentTitle="বিল ইনভয়েস"
                          trigger={() => (
                            <button
                              style={{ display: "none" }}
                              id="billing_invoice_print"
                            ></button>
                          )}
                          content={() => billRef.current}
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
              {/* invoice print  */}
              <div style={{ display: "none" }}>
                <BillCollectInvoice
                  ref={billRef}
                  customerData={single}
                  billingData={{ amount, billType }}
                  ispOwnerData={ispOwnerData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
