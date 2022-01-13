import React from "react";
import { useSelector } from "react-redux";
export default function LinemanDetails() {
  const lineSingle = useSelector((state) => state.lineman.singleLineman);
  return (
    <div>
      <div
        className="modal fade"
        id="linemanDetails"
        tabIndex="-1"
        aria-labelledby="linemanDetailsModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="linemanDetailsModal"
              >
                কাস্টমার বিস্তারিত
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="thSt">
                      নাম:
                    </th>
                    <th scope="col">{lineSingle.name}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      মোবাইল:
                    </th>
                    <th scope="col">{lineSingle.mobile}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      এড্রেস:
                    </th>
                    <th scope="col">{lineSingle.address}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      ইমেইল:
                    </th>
                    <th scope="col">{lineSingle.email}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      NID নম্বর:
                    </th>
                    <th scope="col">{lineSingle.nid}</th>
                  </tr>
                  <tr>
                    <th scope="col" className="thSt">
                      স্ট্যাটাস:
                    </th>
                    <th scope="col">{lineSingle.status}</th>
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
