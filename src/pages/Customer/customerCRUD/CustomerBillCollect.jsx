import { useState } from "react";
import "../customer.css";

export default function CustomerBillCollect() {
  const [billAmount, setBillAmount] = useState("");

  // bill amount
  const customerBillHandler = () => {
    const selector = document.querySelector(".ifCannotSelectBill");
    if (billAmount === "") {
      selector.style.display = "block";
      return;
    }
    selector.style.display = "none";

    // console.log("Amount: ", billAmount);
  };

  return (
    <div>
      <div>
        <div
          className="modal fade"
          id="collectCustomerBillModal"
          tabIndex="-1"
          aria-labelledby="customerModalDetails"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  style={{ color: "#0abb7a" }}
                  className="modal-title"
                  id="customerModalDetails"
                >
                  বিল গ্রহণ
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* inpurts */}
                <div className="input-group mb-3">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    পরিমান
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    onChange={(e) => setBillAmount(e.target.value)}
                  />
                </div>
                <p className="ifCannotSelectBill">ফিল্ড ফাঁকা রাখা যাবে না</p>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-success"
                  onClick={customerBillHandler}
                >
                  আপডেট
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
