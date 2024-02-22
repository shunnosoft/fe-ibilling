import React, { useEffect, useState } from "react";
import BkashForm from "./netFeePaymentGateway/BkashForm";
import SSLCommerz from "./netFeePaymentGateway/SSLCommerz";
import UddoktaPayForm from "./netFeePaymentGateway/UddoktaPayForm";

const PaymentGateway = ({ setShow, ispOwner }) => {
  //payment gateway state
  const [paymentGatewayName, setPaymentGatewayName] = useState("bKashPG");

  useEffect(() => {
    setPaymentGatewayName(ispOwner?.bpSettings?.paymentGateway?.gatewayType);
  }, [ispOwner]);

  return (
    <>
      <div className="paymentGateway fw-normal">
        <div className="form-check ">
          <input
            className="form-check-input"
            type="radio"
            id="bKash-payment"
            name="bKash"
            value={"bKashPG"}
            checked={paymentGatewayName === "bKashPG"}
            onChange={(e) => setPaymentGatewayName(e.target.value)}
          />
          <label className="form-check-label" for="bKash-payment">
            bKash
          </label>
        </div>
        <div className="form-check ms-4">
          <input
            className="form-check-input"
            type="radio"
            id="uddoktapay-payment"
            name="uddoktapay"
            value={"uddoktapay"}
            checked={paymentGatewayName === "uddoktapay"}
            onChange={(e) => setPaymentGatewayName(e.target.value)}
          />
          <label className="form-check-label" for="uddoktapay-payment">
            UddoktaPay
          </label>
        </div>
        <div className="form-check ms-4">
          <input
            className="form-check-input"
            type="radio"
            id="sslCommerz-payment"
            name="sslCommerz"
            value={"sslCommerz"}
            checked={paymentGatewayName === "sslCommerz"}
            onChange={(e) => setPaymentGatewayName(e.target.value)}
          />
          <label className="form-check-label" for="sslCommerz-payment">
            SSLCOMMERZ
          </label>
        </div>
      </div>

      <div>
        {/* bkash payment page */}
        {paymentGatewayName === "bKashPG" ? (
          <BkashForm setShow={setShow} ispOwner={ispOwner} />
        ) : (
          ""
        )}

        {/* uddoktaPays payment page */}
        {paymentGatewayName === "uddoktapay" ? (
          <UddoktaPayForm setShow={setShow} ispOwner={ispOwner} />
        ) : (
          ""
        )}

        {/* SSLCommerz payment page */}
        {paymentGatewayName === "sslCommerz" ? (
          <SSLCommerz setShow={setShow} ispOwner={ispOwner} />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default PaymentGateway;
