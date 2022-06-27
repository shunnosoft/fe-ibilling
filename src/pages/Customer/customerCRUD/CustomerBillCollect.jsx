import { useRef, useState } from "react";
import { Field, Form, Formik } from "formik";
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
  const billRef = useRef();
  // get all customer
  const customer = useSelector(
    (state) => state?.persistedReducer?.customer?.customer
  );

  // find editable data
  const data = customer.find((item) => item.id === single);

  const [billType, setBillType] = useState("bill");
  const [amount, setAmount] = useState(null);
  // const [defaultAmount, setDefault] = useState(single.monthlyFee);

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

  //billing date
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [agent, setAgent] = useState("");

  const BillValidatoin = Yup.object({
    amount: Yup.number()
      .min(10, "দশ টাকার নিচে বিল গ্রহন যোগ্য নয়")
      .integer("দশামিক গ্রহনযোগ্য নয়"),
  });

  // bill amount
  const customerBillHandler = (formValue) => {
    const sendingData = {
      amount: formValue.amount,
      name: userData.name,
      collectedBy: currentUser?.user.role,
      billType: billType,
      customer: data?.id,
      ispOwner: ispOwner,
      user: currentUser?.user.id,
      collectorId: currentUserId, //when collector is logged in
      userType: data?.userType,
    };
    billCollect(dispatch, sendingData, setLoading);
    setAmount(data.amount);
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
            <div className="modal-content p-3">
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
                      <div className="bill_collect_form">
                        <div className="w-100 me-3">
                          <FtextField
                            type="number"
                            name="amount"
                            label="পরিমান"
                          />
                        </div>

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
                            onChange={(e) => setAgent(e.target.value)}
                          >
                            <option selected defaultValue={"select one"}>
                              মাধ্যম সিলেক্ট করুন
                            </option>
                            <option>হ্যান্ড ক্যাশ</option>
                            <option>বিকাশ</option>
                            <option>রকেট</option>
                            <option>নগদ</option>
                            <option>ব্যাংক একাউন্ট</option>
                            {/* <option>বিকাশ</option>
                          <option>বিকাশ</option> */}
                          </select>
                        </div>
                      </div>
                      <div className="bill_collect_form mb-1">
                        <div className="me-3" style={{ width: "100%" }}>
                          <label className="form-control-label changeLabelFontColor">
                            শুরুর তারিখ
                          </label>
                          <DatePicker
                            className="form-control mw-100"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                        <div cla style={{ width: "100%" }}>
                          <label className="form-control-label changeLabelFontColor">
                            শেষ তারিখ
                          </label>

                          <DatePicker
                            className="form-control mw-100"
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd/MM/yyyy"
                          />
                        </div>
                      </div>
                      <label className="form-control-label changeLabelFontColor">
                        ধরণ
                      </label>
                      <select
                        className="form-select mt-0 mw-100"
                        onChange={(e) => setBillType(e.target.value)}
                      >
                        <option value="bill">বিল</option>
                        <option value="connectionFee">কানেকশন ফি</option>
                      </select>

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
