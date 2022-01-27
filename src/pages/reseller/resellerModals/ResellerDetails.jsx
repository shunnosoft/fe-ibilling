import React from "react";
import "../reseller.css";

export default function ResellerDetails({ reseller }) {
  return (
    <div>
      <div>
        <div
          className="modal fade modal-dialog-scrollable "
          id="resellerDetailsModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  প্রোফাইল
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="Profile">
                  <img
                    src="https://www.kindpng.com/picc/m/207-2074624_white-gray-circle-avatar-png-transparent-png.png"
                    alt=""
                  />
                  <h5>{reseller.name || "N/A"}</h5>
                  <p>Website: {reseller.website || "N/A"}</p>
                </div>
                <div className="ResellerDetails">
                  <h4>Status: {reseller.status || "N/A"}</h4>
                  <h4>Email: {reseller.email || "N/A"}</h4>
                  <h4>Mobile: {reseller.mobile || "N/A"}</h4>
                  <h4>Addres: {reseller.address || "N/A"}</h4>
                  <h4>Nid: {reseller.nid || "N/A"}</h4>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
