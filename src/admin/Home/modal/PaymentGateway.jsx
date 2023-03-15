import React, { useEffect, useState } from "react";
import BkashForm from "./netFeePaymentGateway/BkashForm";
import SSLCommerz from "./netFeePaymentGateway/SSLCommerz";
import UddoktaPayForm from "./netFeePaymentGateway/UddoktaPayForm";

const PaymentGateway = ({ ispOwner }) => {
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
            value={"bKash"}
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
            id="uddokta-payment"
            name="uddoktaPay"
            value={"uddoktaPay"}
            checked={paymentGatewayName === "uddoktaPay"}
            onChange={(e) => setPaymentGatewayName(e.target.value)}
          />
          <label className="form-check-label" for="uddokta-payment">
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
          <BkashForm ispOwner={ispOwner} />
        ) : (
          ""
        )}

        {/* uddoktaPays payment page */}
        {paymentGatewayName === "uddoktaPay" ? (
          <UddoktaPayForm ispOwner={ispOwner} />
        ) : (
          ""
        )}

        {/* SSLCommerz payment page */}
        {paymentGatewayName === "sslCommerz" ? (
          <SSLCommerz ispOwner={ispOwner} />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default PaymentGateway;
