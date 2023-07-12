import PaymentModal from "./paymentModal";
import bkashImg from "../assets/img/bkash.jpg";
import { useSelector } from "react-redux";
import QrCode from "../pages/profile/QrCode";

const Payment = () => {
  const ispOwnerInfo = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.customer?.ispOwner
  );

  return (
    <div className="container">
      <div className="d-flex justify-content-center">
        <div
          className="paymentMethod m-5"
          data-bs-toggle="modal"
          data-bs-target="#billPaymentModal"
        >
          <h3 style={{ color: "#3eff00" }} className="text-center">
            Payment with
          </h3>
          <img
            style={{
              width: "18rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}
            src={bkashImg}
            alt=""
          />
          <h2>Payment</h2>
        </div>
        <div className="m-5">
          <h3 style={{ color: "#3eff00" }} className="text-center">
            Scan QR Code
          </h3>
          <QrCode
            size={174}
            ispInfo={{
              company: ispOwnerInfo?.company,
              mobile: ispOwnerInfo?.mobile,
              netFeeId: ispOwnerInfo?.netFeeId,
              address: ispOwnerInfo?.address,
            }}
          />
        </div>
      </div>
      <PaymentModal />
    </div>
  );
};

export default Payment;
