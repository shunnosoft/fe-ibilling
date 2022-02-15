import React from "react";
import "../customer.css";

export default function CustomerDetails({ single }) {
  // const single = useSelector((state) => state.customer.singleCustomer);

  return (
    <div>
      <div
        className="modal fade"
        id="showCustomerDetails"
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
                গ্রাহক প্রোফাইল
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
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="thSt">
                      মোবাইল:
                    </th>
                    <th scope="col">{single.mobile}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      এড্রেস:
                    </th>
                    <th scope="col">{single.address}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      ইমেইল:
                    </th>
                    <th scope="col">{single.email}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      NID নম্বর:
                    </th>
                    <th scope="col">{single.nid}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      ব্যালান্স:
                    </th>
                    <th scope="col">{single.balance}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      মাসিক বেতন:
                    </th>
                    <th scope="col">{single.monthlyFee}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      স্ট্যাটাস:
                    </th>
                    <th scope="col">{single.status}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      ইউজারের ধরণ:
                    </th>
                    <th scope="col">{single.userType}</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
