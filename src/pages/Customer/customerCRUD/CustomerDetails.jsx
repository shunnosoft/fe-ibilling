import React from "react";
import "../customer.css";

export default function CustomerDetails({ single }) {
  // const single = useSelector((state) => state.customer.singleCustomer);
  console.log("Single: ", single);
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
              <h2 className="ProfileName">{single.name}</h2>
              <div className="profileMain">
                <div>
                  <h5>User Details</h5>
                  <hr />
                  <h6>
                    Name: <b>{single?.name}</b>
                  </h6>
                  <h6>
                    email: <b> {single?.email}</b>
                  </h6>
                  <h6>
                    mobile: <b>{single?.mobile}</b>
                  </h6>
                  <h6>
                    NID: <b>{single?.nid}</b>
                  </h6>
                  <h6>
                    billPayType: <b>{single?.billPayType}</b>
                  </h6>
                  <h6>
                    monthlyFee:<b> {single?.monthlyFee}</b>
                  </h6>
                  <h6>
                    customerId: <b>{single?.customerId}</b>
                  </h6>
                  <h6>
                    password: <b>{single?.password}</b>
                  </h6>
                  <h6>
                    paymentStatus: <b>{single?.paymentStatus}</b>
                  </h6>
                </div>
                <div>
                  <h5>PPPoE Details</h5>
                  <hr />
                  <h6>
                    name: <b>{single?.pppoe.name}</b>
                  </h6>
                  <h6>
                    Profile: <b> {single?.pppoe.profile}</b>
                  </h6>
                  <h6>
                    service: <b>{single?.pppoe.service}</b>
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
