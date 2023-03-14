import React from "react";
import "./execute.css";
import { useEffect } from "react";
import apiLink from "../../api/apiLink";
import { useSelector } from "react-redux";
import Loader from "../../components/common/Loader";

export default function Execute() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentID = urlParams.get("paymentID");
  const status = urlParams.get("status");

  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser.customer
  );

  const paymentExecute = async () => {
    return await apiLink.post(
      `bkash/executePayment?paymentID=${paymentID}&status=${status}`,
      {
        ispOwner: userData.ispOwner.id,
      }
    );
  };

  useEffect(() => {
    paymentExecute()
      .then((response) => {
        if (response.data.bill.paymentStatus === "paid") {
          window.location.href = "/payment/success";
        } else {
          window.location.href = "/payment/failed";
        }
      })
      .catch((err) => (window.location.href = "/payment/failed"));
  }, []);

  return <Loader />;
}
