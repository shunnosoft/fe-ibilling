import PaymentModal from "./paymentModal";
import bkashImg from "../assets/img/bkash.jpg";

const Payment = () => {
  return (
    <div className="container">
      <h3 style={{ color: "#3eff00" }} className="text-center">
        Payment with
      </h3>
      <div className="d-flex justify-content-center align-items-center flex-column ">
        <div
          className="paymentMethod m-2 "
          data-bs-toggle="modal"
          data-bs-target="#billPaymentModal"
        >
          <img
            style={{
              width: "20rem",
              textAlign: "center",
              marginBottom: "1rem",
            }}
            src={bkashImg}
            alt=""
          />
          <h2>Payment</h2>
        </div>
      </div>
      <PaymentModal />
    </div>
  );
};

export default Payment;
