import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import { editCustomer } from "../../../features/customerSlice";
import { fetchCustomer } from "../../../features/customerSlice";
import Loader from "../../../components/common/Loader";

export default function CustomerEdit() {
  const auth = useSelector((state) => state.auth);
  const CUSTOMER = useSelector((state) => state.customer.singleCustomer);
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  // customer validator
  const customerEditValidator = Yup.object({
    name: Yup.string().required("নাম দিন"),
    mobile: Yup.string()
      .min(11, "এগারো  ডিজিট এর সঠিক নম্বর দিন ")
      .max(11, "এগারো  ডিজিট এর বেশি হয়ে গেছে ")
      .required("মোবাইল নম্বর দিন "),
    address: Yup.string().required("নাম দিন"),
    email: Yup.string()
      .email("ইমেইল সঠিক নয় ")
      .required("ম্যানেজার এর ইমেইল দিতে হবে"),
    nid: Yup.string().required("NID দিন"),
    status: Yup.string().required("Choose one"),
    balance: Yup.string().required("Balance দিন"),
    monthlyFee: Yup.string().required("Montly Fee দিন"),
  });

  const customerEditHandler = async (data) => {
    setIsloading(true);
    const { ispOwner } = auth;
    const mainData = {
      customerId: "randon123",
      singleCustomerID: CUSTOMER.id,
      ispID: ispOwner.id,
      ispOwner: ispOwner.id,
      ...data,
    };
    const respnse = await dispatch(editCustomer(mainData));
    if (respnse) {
      setIsloading(false);
      dispatch(fetchCustomer(ispOwner.id));
      document.querySelector("#customerEditModal").click();
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="customerEditModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {`${CUSTOMER.name}`} এর তথ্য এডিট করুন
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
                  name: CUSTOMER.name,
                  mobile: CUSTOMER.mobile,
                  address: CUSTOMER.address,
                  email: CUSTOMER.email,
                  nid: CUSTOMER.nid,
                  status: CUSTOMER.status,
                  balance: CUSTOMER.balance,
                  monthlyFee: CUSTOMER.monthlyFee,
                  billPayType: CUSTOMER.billPayType,
                }}
                validationSchema={customerEditValidator}
                onSubmit={(values) => {
                  customerEditHandler(values);
                }}
                enableReinitialize
              >
                {(formik) => (
                  <Form>
                    <FtextField type="text" label={`নাম`} name="name" />
                    <FtextField type="text" label={`মোবাইল`} name="mobile" />
                    <FtextField type="text" label={`এড্রেস`} name="address" />
                    <FtextField type="text" label={`ইমেইল`} name="email" />
                    <FtextField type="text" label={`NID নম্বর`} name="nid" />
                    <div className="form-check customerFormCheck">
                      <p>স্টেটাস </p>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Paid"
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="status1"
                          value="paid"
                        />
                      </div>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Unpaid"
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="status2"
                          value="unpaid"
                        />
                      </div>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Overdue"
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="status3"
                          value="overdue"
                        />
                      </div>
                    </div>

                    <div className="form-check customerFormCheck">
                      <p>বিল পরিশোধের ধরণ</p>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Prepaid"
                          className="form-check-input"
                          type="radio"
                          name="billPayType"
                          id="billPayType1"
                          value="prepaid"
                        />
                      </div>
                      <div className="form-check form-check-inline">
                        <FtextField
                          label="Postpaid"
                          className="form-check-input"
                          type="radio"
                          name="billPayType"
                          id="billPayType2"
                          value="postpaid"
                        />
                      </div>
                    </div>
                    <FtextField
                      type="text"
                      label={`ব্যালান্স`}
                      name="balance"
                    />
                    <FtextField
                      type="text"
                      label={`মাসিক ফি`}
                      name="monthlyFee"
                    />
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        বাতিল করুন
                      </button>
                      <button type="submit" className="btn btn-success">
                        {isLoading ? <Loader /> : "সেভ করুন"}
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
