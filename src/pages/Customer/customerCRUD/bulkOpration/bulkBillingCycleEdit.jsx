import React, { useState } from "react";
import RootBulkModal from "./bulkModal";
import moment from "moment";
import Loader from "../../../../components/common/Loader";
import DatePicker from "react-datepicker";

const BulkBillingCycleEdit = ({ bulkCustomer, modalId }) => {
  const [isLoading, setIsLoading] = useState();
  const [billDate, setBillDate] = useState(new Date());
  //   const [billTime, setBilltime] = useState(new Date());

  const billingCycleHandler = (e) => {
    e.preventDefault();
    if (billDate) {
      const data = {
        ids: bulkCustomer.map((item) => item.original.id),
        billingCycle: billDate.toISOString(),
      };
      console.log(data);
    }
  };

  return (
    <RootBulkModal modalId={modalId} header="আপডেট বিলিং সাইকেল">
      <form onSubmit={billingCycleHandler}>
        <p className="customerFieldsTitle">সিলেক্ট ডেট</p>
        <div className="mb-3">
          <DatePicker
            className="form-control"
            selected={billDate}
            onChange={(date) => setBillDate(date)}
            dateFormat="dd/MM/yyyy h:mm a"
            showTimeSelect
            timeIntervals={1}
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
export default BulkBillingCycleEdit;
