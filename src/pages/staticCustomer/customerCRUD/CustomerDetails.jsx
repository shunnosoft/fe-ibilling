import React from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";

export default function CustomerDetails({ single }) {
  // const single = useSelector(state => state.customer.singleCustomer);
  console.log("Single: ", single);
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth.userData?.bpSettings
  );
  return (
    <div>
      <div
        className="modal fade"
        id="showCustomerDetails"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                {single?.name} - প্রোফাইল
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h2 className="ProfileName">{single?.name}</h2>
              <div className="profileMain">
                <div>
                  <h5>গ্রাহক</h5>
                  <hr />
                  <h6>
                    গ্রাহক আইডি: <b>{single?.customerId}</b>
                  </h6>
                  <h6>
                    নাম: <b>{single?.name}</b>
                  </h6>
                  <h6>
                    মোবাইল: <b>{single?.mobile}</b>
                  </h6>
                  <h6>
                    ঠিকানা: <b>{single?.address}</b>
                  </h6>
                  <h6>
                    ইমেইল: <b> {single?.email}</b>
                  </h6>
                  <h6>
                    জাতীয় পরিচয়পত্র: <b>{single?.nid}</b>
                  </h6>
                  <h6>
                    স্ট্যাটাস: <b>{badge(single?.status)}</b>
                  </h6>
                  <h6>
                    পেমেন্ট: <b>{badge(single?.paymentStatus)}</b>
                  </h6>
                  <h6>
                    মাসিক ফি:<b> {FormatNumber(single?.monthlyFee)}</b>
                  </h6>
                  <h6>
                    ব্যাল্যান্স:<b> {FormatNumber(single?.balance)}</b>
                  </h6>
                  <h6>
                    বিলিং সাইকেল:{" "}
                    <b>
                      {moment(single?.billingCycle).format(
                        "DD-MM-YYYY hh:mm A"
                      )}
                    </b>
                  </h6>
                  {bpSettings.hasMikrotik && (
                    <h6>
                      অটোমেটিক সংযোগ বন্ধ:{" "}
                      <b>{single?.autoDisable ? "YES" : "NO"}</b>
                    </h6>
                  )}
                </div>
                <div>
                  <h5>PPPoE</h5>
                  <hr />
                  <h6>
                    ইউজারনেম: <b>{single?.pppoe?.name}</b>
                  </h6>
                  <h6>
                    <h6>
                      পাসওয়ার্ড: <b>{single?.password}</b>
                    </h6>
                    প্রোফাইল: <b> {single?.pppoe?.profile}</b>
                  </h6>
                  <h6>
                    সার্ভিস: <b>{single?.pppoe?.service}</b>
                  </h6>
                  <h6>
                    কমেন্ট: <b>{single?.pppoe?.comment}</b>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
