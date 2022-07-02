import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../../../components/common/Loader";
import {
  bulkAutoConnectionEdit,
  bulkStatusEdit,
} from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";

const BulkAutoConnectionEdit = ({ bulkCustomer, modalId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [autoDisable, setAutoDisable] = useState(false);
  const dispatch = useDispatch();

  const changeStatus = (e) => {
    e.preventDefault();

    const data = {
      customerIds: bulkCustomer.map((item) => item.original.id),
      autoDisable: autoDisable,
    };
    let confirm;
    if (autoDisable) {
      confirm = window.confirm(
        "আপনি কি " + bulkCustomer.length + "টি গ্রাহকের আটো ডিজেবল অন করতে চান?"
      );
    }
    if (!autoDisable) {
      confirm = window.confirm(
        "আপনি কি " + bulkCustomer.length + "টি গ্রাহকের আটো ডিজেবল অফ করতে চান?"
      );
    }
    if (confirm) {
      bulkAutoConnectionEdit(dispatch, data, setIsLoading);
    }
  };

  return (
    <RootBulkModal modalId={modalId} header="আপডেট স্টাটাস">
      <form onSubmit={changeStatus}>
        <div className="autoDisable">
          <label>অটোমেটিক সংযোগ বন্ধ</label>
          <input
            type="checkBox"
            checked={autoDisable}
            onChange={(e) => setAutoDisable(e.target.checked)}
          />
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

export default BulkAutoConnectionEdit;
