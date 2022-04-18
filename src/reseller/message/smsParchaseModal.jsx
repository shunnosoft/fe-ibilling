import React from "react";

import "./message.css";

function SmsParchase() {
  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="smsparchase"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                এসএমএস পার্চেজ বোর্ড
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="smsPerchase">
                <div className="smsbuy">
                  <div className="amountsms">
                    <span className="kroymullo">ক্রয়মূল্যঃ </span>
                    <span className="price">
                      <strong> {`250৳`}</strong>
                    </span>
                  </div>

                  <div className="numsms">
                    <span className="smsspan">এসএমএস সংখ্যাঃ </span>
                    <input className="smsinput" type="number" min={0} />
                  </div>
                </div>
                <div className="smsbutton">
                  <button
                    data-bs-dismiss="modal"
                    className="smsparchasebtn button2"
                  >
                    বাতিল করুন
                  </button>
                  <button className="smsparchasebtn button1">কিনুন</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SmsParchase;
