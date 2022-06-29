import { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
//internal imports
import { FtextField } from "../../../components/common/FtextField";
import "../../Customer/customer.css";
import { useDispatch } from "react-redux";
import { billCollect } from "../../../features/apiCallReseller";
import Loader from "../../../components/common/Loader";
import DatePicker from "react-datepicker";

export default function CustomerBillCollect({ single }) {
  const customer = useSelector(
    (state) => state?.persistedReducer?.customer?.staticCustomer
  );

  const data = customer.find((item) => item.id === single);

  const [billType, setBillType] = useState("bill");

  const ispOwner = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const currentUser = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser
  );

  const currentUserId = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.id
  );
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  console.log(data);
  //billing date
  const [startDate, setStartDate] = useState(false);
  const [endDate, setEndDate] = useState(false);
  const [medium, setMedium] = useState("cash");
  const [noteCheck, setNoteCheck] = useState(false);
  const [note, setNote] = useState("");

  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(0, "বিল গ্রহন যোগ্য নয়")
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
      medium,
      package: data.queue.package,
    };
    if (note) sendingData.note = note;
    if (startDate && endDate) {
      sendingData.start = startDate.toISOString();
      sendingData.end = endDate.toISOString();
    }
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
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
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
                      <div className="d-inline w-100 mb-3">
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
                          onChange={(e) => setMedium(e.target.value)}
                        >
                          <option value="cash" selected>
                            হ্যান্ড ক্যাশ
                          </option>
                          <option value="bKash">বিকাশ</option>
                          <option value="rocket">রকেট</option>
                          <option value="nagod">নগদ</option>
                          <option value="others">অন্য</option>
                        </select>
                      </div>
                      <label>ধরণ</label>
                      <select
                        className="form-select"
                        onChange={(e) => setBillType(e.target.value)}
                      >
                        <option value="bill">বিল</option>
                        <option value="connectionFee">কানেকশন ফি</option>
                      </select>
                      <div className="mb-2 mt-3">
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
                      </div>
                      {noteCheck && (
                        <div className="bill_collect_form mb-1">
                          <div class="form-floating me-3">
                            <textarea
                              cols={200}
                              class="form-control shadow-none"
                              placeholder="নোট লিখুন"
                              id="noteField"
                              onChange={(e) => setNote(e.target.value)}
                            ></textarea>
                            <label for="noteField">নোট এড করুন</label>
                          </div>
                          <div className="me-3" style={{ width: "100%" }}>
                            <label className="form-control-label changeLabelFontColor">
                              শুরুর তারিখ
                            </label>
                            <DatePicker
                              selected={startDate}
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
                              selected={endDate}
                              className="form-control mw-100"
                              onChange={(date) => setEndDate(date)}
                              dateFormat="dd/MM/yyyy"
                              placeholderText="তারিখ সিলেক্ট করুন"
                            />
                          </div>
                        </div>
                      )}
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
