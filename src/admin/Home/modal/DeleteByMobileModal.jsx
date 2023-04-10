import React from "react";
import {
  DeleteByNumber,
  SearchByNumber,
} from "../../../features/modifyNumberApi";
import { useState } from "react";

const DeleteByMobileModal = () => {
  const [customer, setCustomer] = useState("");

  const [mobile, setMobile] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const SearchHandler = () => {
    SearchByNumber(mobile, setCustomer, setIsLoading);
  };

  const deleteHandler = () => {
    DeleteByNumber(mobile, setIsLoading);
  };
  return (
    <div
      class="modal fade"
      id="numberDeleteModal"
      tabindex="-1"
      aria-labelledby="numberDeleteModal"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="numberDeleteModal">
              Enter Number to Delete
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <input
              onChange={(e) => setMobile(e.target.value)}
              type="number"
              className="me-3"
            />
            <span
              type="button"
              onClick={SearchHandler}
              className="btn btn-primary btn-sm"
            >
              Search
            </span>

            <br />
            <br />

            {customer?.profile?.id && (
              <>
                <h5>Customer Found</h5>
                <h5>Name: {customer?.profile?.name}</h5>
                <h5>Mobile: {customer?.profile?.mobile}</h5>
                <button
                  type="button"
                  onClick={deleteHandler}
                  className="btn btn-danger btn-sm py-0"
                >
                  Delete
                </button>
              </>
            )}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteByMobileModal;
