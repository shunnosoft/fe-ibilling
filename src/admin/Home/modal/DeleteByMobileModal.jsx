import React from "react";
import {
  DeleteByNumber,
  SearchByNumber,
} from "../../../features/modifyNumberApi";
import { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";

const DeleteByMobileModal = () => {
  //get current use Role
  const currentUserRole = useSelector(
    (state) => state.persistedReducer.auth.role
  );

  const [customer, setCustomer] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //search api call function
  const SearchHandler = () => {
    SearchByNumber(mobile, setCustomer, setIsLoading);
  };

  //delete api call function
  const deleteHandler = () => {
    const confirm = window.confirm("Are you sure to Delete");
    if (confirm) DeleteByNumber(mobile, setIsLoading);
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
              Enter Number
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div className="form-group d-flex">
              <input
                onChange={(e) => setMobile(e.target.value)}
                type="number"
                className="form-control me-3"
              />
              <button
                type="button"
                onClick={SearchHandler}
                className="btn btn-primary btn-sm float-end"
              >
                {isLoading ? <Loader /> : "Search"}
              </button>
            </div>

            {customer?.profile?.id && (
              <>
                <h5>Customer Found</h5>
                <h5>Name : {customer?.profile?.name}</h5>
                <h5>Mobile : {customer?.profile?.mobile}</h5>
                {(currentUserRole === "superAdmin" ||
                  (currentUserRole === "admin" &&
                    customer?.user?.role === "customer")) && (
                  <button
                    type="button"
                    onClick={deleteHandler}
                    className="btn btn-danger btn-sm py-1"
                  >
                    Delete
                  </button>
                )}
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
