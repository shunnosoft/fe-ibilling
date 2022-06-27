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
import DatePicker from "react-datepicker";

export default function CustomerBillCollect({ single }) {
  // get all customer
  const customer = useSelector(
    (state) => state?.persistedReducer?.customer?.staticCustomer
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  // find editable data
  const data = customer.find((item) => item.id === single);

  const [billType, setBillType] = useState("bill");

  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  const currentUserId = useSelector(
    (state) => state.persistedReducer.auth.userData.id
  );
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  //billing date
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [agent, setAgent] = useState("");
  const [noteCheck, setNoteCheck] = useState(false);

  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(10, "দশ টাকার নিচে বিল গ্রহন যোগ্য নয়")
      .integer("দশামিক গ্রহনযোগ্য নয়"),
  });

  // bill amount
  const customerBillHandler = (formValue) => {
    const sendingData = {
      amount: formValue.amount,
      collectedBy: currentUser?.user.role,
      billType: billType,
      name: userData.name,
      customer: data?.id,
      ispOwner: ispOwner,
      user: currentUser?.user.id,
      collectorId: currentUserId, //when collector is logged in
      userType: data?.userType,
      // note:note
    };
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
                  রিচার্জ করুন
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
                      data?.balance < data?.monthlyFee
                        ? data?.monthlyFee - data?.balance
                        : data?.monthlyFee,
                  }}
                  validationSchema={BillValidatoin}
                  onSubmit={(values) => {
                    customerBillHandler(values);
                  }}
                  enableReinitialize
                >
                  {() => (
                    <Form>
                      <h4>Name:{data?.name}</h4>
                      <h4>ID:{data?.customerId}</h4>

                      <FtextField type="number" name="amount" label="পরিমান" />
                      {/* <div className="d-inline w-100 mb-3">
                        <label
                          htmlFor="receiver_type"
                          className="form-control-label changeLabelFontColor"
                        >
                          মাধ্যম
                        </label>

                        <select
                          as="select"
                          id="receiver_type"
                          className="form-select mt-0 mw-100"
                          aria-label="Default select example"
                          onChange={(e) => setAgent(e.target.value)}
                        >
                          <option selected>হ্যান্ড ক্যাশ</option>
                          <option>বিকাশ</option>
                          <option>রকেট</option>
                          <option>নগদ</option>
                          <option>ব্যাংক একাউন্ট</option>
                        </select>
                      </div> */}
                      <label>ধরণ</label>
                      <select
                        className="form-select"
                        onChange={(e) => setBillType(e.target.value)}
                      >
                        <option value="bill">বিল</option>
                        <option value="connectionFee">কানেকশন ফি</option>
                      </select>
                      {/* <div className="mb-2 mt-3">
                        <input
                          type="checkbox"
                          className="form-check-input me-1"
                          id="addNOte"
                          onChange={(e) => setNoteCheck(e.target.checked)}
                        />
                        <label
                          className="form-check-label changeLabelFontColor"
                          htmlFor="addNOte"
                        >
                          নোট এবং তারিখ
                        </label>
                      </div> */}
                      {/* {noteCheck && (
                        <div className="bill_collect_form mb-1">
                          <div class="form-floating me-3">
                            <FtextField
                              type="text"
                              name="text"
                              label="নোট এড করুন"
                            />
                          </div>
                          <div className="me-3" style={{ width: "100%" }}>
                            <label className="form-control-label changeLabelFontColor">
                              শুরুর তারিখ
                            </label>
                            <DatePicker
                              className="form-control mw-100"
                              onChange={(date) => setStartDate(date)}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="তারিখ সিলেক্ট করুন"
                            />
                          </div>
                          <div cla style={{ width: "100%" }}>
                            <label className="form-control-label changeLabelFontColor">
                              শেষ তারিখ
                            </label>

                            <DatePicker
                              className="form-control mw-100"
                              onChange={(date) => setEndDate(date)}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="তারিখ সিলেক্ট করুন"
                            />
                          </div>
                        </div>
                      )} */}
                      <div className="mt-4">
                        <button type="submit" className="btn btn-success">
                          {isLoading ? <Loader /> : "সাবমিট"}
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
