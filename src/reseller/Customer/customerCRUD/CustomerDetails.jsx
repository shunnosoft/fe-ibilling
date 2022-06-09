import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";

export default function CustomerDetails({ single }) {
  const customer = useSelector(
    (state) => state?.persistedReducer?.customer?.customer
  );

  const data = customer.find((item) => item.id === single);

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
                {data?.name} - প্রোফাইল
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h2 className="ProfileName">{data?.name}</h2>
              <div className="profileMain">
                <div>
                  <h5>গ্রাহক</h5>
                  <hr />
                  <h6>
                    গ্রাহক আইডি: <b>{data?.customerId}</b>
                  </h6>
                  <h6>
                    নাম: <b>{data?.name}</b>
                  </h6>
                  <h6>
                    মোবাইল: <b>{data?.mobile}</b>
                  </h6>
                  <h6>
                    ঠিকানা: <b>{data?.address}</b>
                  </h6>
                  <h6>
                    ইমেইল: <b> {data?.email}</b>
                  </h6>
                  <h6>
                    জাতীয় পরিচয়পত্র: <b>{data?.nid}</b>
                  </h6>
                  <h6>
                    স্ট্যাটাস: <b>{badge(data?.status)}</b>
                  </h6>
                  <h6>
                    পেমেন্ট: <b>{badge(data?.paymentStatus)}</b>
                  </h6>
                  <h6>
                    মাসিক ফি:<b> {FormatNumber(data?.monthlyFee)}</b>
                  </h6>
                  <h6>
                    ব্যাল্যান্স:<b> {FormatNumber(data?.balance)}</b>
                  </h6>
                  <h6>
                    বিলিং সাইকেল:{" "}
                    <b>
                      {moment(data?.billingCycle).format("DD-MM-YYYY hh:mm A")}
                    </b>
                  </h6>
                  <h6>
                    অটোমেটিক সংযোগ বন্ধ:{" "}
                    <b>{single?.autoDisable ? "YES" : "NO"}</b>
                  </h6>
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
