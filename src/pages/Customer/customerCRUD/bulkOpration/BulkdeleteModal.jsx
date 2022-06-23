import React, { useState } from "react";
import Loader from "../../../../components/common/Loader";
import RootBulkModal from "./bulkModal";

const BulkCustomerDelete = ({ bulkCustomer, modalId }) => {
  // loading state
  const [isLoading, setIsloading] = useState(false);
  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  // DELETE handler
  const bulkDeleteHandler = () => {
    let checkCondition = true;

    if (mikrotikCheck) {
      checkCondition = window.confirm("মাইক্রোটিক থেকে ডিলিট করতে চান?");
    }

    // send data for api
    const data = {
      ids: bulkCustomer.map((item) => {
        return item.original.id;
      }),
      mikrotik: mikrotikCheck,
    };

    // api call
    if (checkCondition) {
    }
  };

  return (
    <RootBulkModal
      modalId={modalId}
      header={`${bulkCustomer.length} টি গ্রাহক ডিলিট করুন`}
    >
      <div class="form-check mt-4">
        <input
          class="form-check-input"
          type="checkbox"
          checked={mikrotikCheck}
          id="flexCheckDefault"
          onChange={(event) => setMikrotikCheck(event.target.checked)}
        />
        <label class="form-check-label" for="flexCheckDefault">
          <small className="text-secondary">
            মাইক্রোটিক থেকে ডিলিট করতে চান ?
          </small>
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
          onClick={bulkDeleteHandler}
          className="btn btn-success"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : "ডিলিট"}
        </button>
      </div>
    </RootBulkModal>
  );
};

export default BulkCustomerDelete;
