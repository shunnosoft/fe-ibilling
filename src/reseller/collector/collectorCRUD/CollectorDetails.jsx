import React from "react";
import "../../Customer/customer.css";
import "../collector.css";

export default function CollectorDetails({ single }) {
  return (
    <div>
      <div
        className="modal fade"
        id="showCollectorDetails"
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
                {single.name} এর প্রোফাইল
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="profileImage">
                <img
                  src="https://roottogether.net/wp-content/uploads/2020/04/img-avatar-blank.jpg"
                  alt=""
                />
              </div>
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
                      স্ট্যাটাস:
                    </th>
                    <th scope="col">{single.status}</th>
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
