import React from "react";

export default function ReadModals(props) {
  const manager = props.managerDetails;
  return (
    <div>
      {/* <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"></div> */}
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Manager Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name:</th>
                    <th scope="col">{manager.name}</th>
                  </tr>
                  <tr>
                    <th scope="col">Mobile:</th>
                    <th scope="col">{manager.mobile}</th>
                  </tr>
                  <tr>
                    <th scope="col">Address:</th>
                    <th scope="col">{manager.address}</th>
                  </tr>
                  <tr>
                    <th scope="col">Email:</th>
                    <th scope="col">{manager.email}</th>
                  </tr>
                  <tr>
                    <th scope="col">NID:</th>
                    <th scope="col">{manager.nid}</th>
                  </tr>
                </thead>
              </table>
            </div>
            {/* <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
