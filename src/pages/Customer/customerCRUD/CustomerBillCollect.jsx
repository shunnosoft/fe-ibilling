import { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
//internal imports
import { FtextField } from "../../../components/common/FtextField";
import "../../Customer/customer.css";
import { useDispatch } from "react-redux";
import { billCollect } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";

export default function CustomerBillCollect({ single }) {
  const [billType, setBillType] = useState("bill");
  const ispOwner = useSelector((state) => state.auth?.ispOwnerId);
  const currentUser = useSelector((state) => state.auth?.currentUser);
const dispatch = useDispatch()
const [isLoading,setLoading] =useState(false)
  const BillValidatoin = Yup.object({
    amount: Yup.string().required("Please insert amount."),
  });
  // bill amount
  const customerBillHandler = (data) => {
    const sendingData = {
      amount: parseInt(data.amount),
      collectedBy: currentUser?.user.role,
      billType: billType,
      customer: single.id,
      ispOwner: ispOwner,
      user:currentUser?.user.id,
      collectorId: currentUser?.collector?.id, //when collector is logged in
    };

    console.log("Colelcted Bill form custoerrrrrrr: ", sendingData);
    billCollect(dispatch,sendingData,setLoading)
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
                         {isLoading? <Loader/>: "সাবমিট"} 
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
