import React from "react";

const EditModal = () => {
  return (
    <div
      className="modal fade"
      id="editComment"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              {/* {company[data?.ispOwner]} */}
            </h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">Edit</div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
