import React from "react";

export default function RootBulkModal(props) {
  return (
    <div>
      <div
        className="modal fade "
        id={props.modalId}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {props.header}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
