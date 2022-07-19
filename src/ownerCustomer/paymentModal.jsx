import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import { billPayment } from "../features/getIspOwnerUsersApi";

const PaymentModal = () => {
  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser.customer
  );
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPaymentAmount(userData?.monthlyFee);
  }, [userData]);

  const billPaymentController = async () => {
    const data = {
      amount: paymentAmount,
      name: userData.name,
      billType: "bill",
      customer: userData.id,
      ispOwner: userData.ispOwner.id,
      user: userData.id,
      userType: userData.userType,
      medium: "sslcommerz",
      paymentStatus: "pending",
      package: userData.pppoe.profile,
    };

    if (paymentAmount < userData.monthlyFee) {
      return alert("You can't pay less than your monthly fee");
    }
    billPayment(data, setLoading);
  };

  return (
    <div className="modal fade" id="billPaymentModal" tabindex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-black">Payment Amount</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <input
              onChange={(e) => setPaymentAmount(e.target.value)}
              min={userData.monthlyFee}
              className="form-control "
              type="number"
              value={paymentAmount}
            />
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              onClick={billPaymentController}
              type="button"
              className="btn btn-primary"
            >
              {loading ? <Loader /> : "Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
