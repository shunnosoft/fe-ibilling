import React from "react";

const MessageDetails = () => {
  return (
    <>
      <div
        className="modal fade"
        id="messageDetailsModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageDetails;
