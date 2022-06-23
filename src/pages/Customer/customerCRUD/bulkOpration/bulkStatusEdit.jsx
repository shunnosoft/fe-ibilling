import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { bulkStatusEdit } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";

const BulkStatusEdit = ({ bulkCustomer, modalId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();

  const changeStatus = (e) => {
    e.preventDefault();
    if (status) {
      const data = {
        customerIds: bulkCustomer.map((item) => item.original.id),
        status: status,
      };
      const confirm = window.confirm(
        "আপনি কি " + bulkCustomer.length + "টি গ্রাহকের স্টাটাস আপডেট করতে চান?"
      );
      if (confirm) {
        bulkStatusEdit(dispatch, data, setIsLoading);
      }
    }
  };

  return (
    <RootBulkModal modalId={modalId} header="আপডেট স্টাটাস">
      <form onSubmit={changeStatus}>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="status"
            value={"active"}
            onChange={(e) => setStatus(e.target.value)}
            id="activeCustomer"
          />
          <label className="form-check-label" htmlFor="activeCustomer">
            এক্টিভ
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="status"
            id="inactive"
            value={"inactive"}
            onChange={(e) => setStatus(e.target.value)}
          />
          <label className="form-check-label" htmlFor="inactive">
            ইন-এক্টিভ
          </label>
        </div>

        <div className="modal-footer" style={{ border: "none" }}>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            disabled={isLoading}
          >
            বাতিল করুন
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "সেভ করুন"}
          </button>
        </div>
      </form>
    </RootBulkModal>
  );
};

export default BulkStatusEdit;
