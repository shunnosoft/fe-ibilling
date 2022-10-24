import moment from "moment";
import React from "react";
const ViewPaymentHistoryModal = ({ payment }) => {
  return (
    <div className="modal fade" id="viewPaymentModal" tabindex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-black">
              Payment Date:{" "}
              <span className="badge bg-secondary">
                {moment(payment.createdAt).format("MMM-DD-YYYY")}
              </span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <table className="text-black payment_history-table">
              <tr>
                <td>Name: </td>
                <td>{payment.name}</td>
              </tr>
              <tr>
                <td>Package: </td>
                <td>{payment.package}</td>
              </tr>
              <tr>
                <td>Amount: </td>
                <td>{payment.amount}</td>
              </tr>
              <tr>
                <td>Paid through: </td>
                <td>{payment.medium}</td>
              </tr>
              <tr>
                <td>Bill Type: </td>
                <td>{payment.billType}</td>
              </tr>
            </table>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            {/* <button type="button" className="btn btn-primary"></button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPaymentHistoryModal;
