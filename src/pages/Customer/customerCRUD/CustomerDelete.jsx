import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { deleteACustomer } from "../../../features/apiCalls";

const CustomerDelete = ({ single, mikrotikCheck, setMikrotikCheck }) => {
  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  // DELETE handler
  const deleteCustomer = (customerId) => {
    let con = true;

    if (mikrotikCheck) {
      con = window.confirm("মাইক্রোটিক থেকে ডিলিট করতে চান?");
    }

    // send data for api
    const data = {
      ispID: ispOwnerId,
      customerID: customerId,
      mikrotik: mikrotikCheck,
    };

    // api call
    if (con) {
      deleteACustomer(dispatch, data, setIsloading);
    }
  };

  return (
    <div
      className="modal fade"
      id="customerDelete"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog ">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              গ্রাহক ডিলিট
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <h5>{single?.name} গ্রাহক কে ডিলিট করুন</h5>

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
                onClick={() => {
                  deleteCustomer(single?.id);
                }}
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? <Loader /> : "ডিলিট"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDelete;
