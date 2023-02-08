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
        amount: localStorage.getItem("paymentAmount"),
        name: userData.name,
        billType: "bill",
        customer: userData.id,
        ispOwner: userData.ispOwner.id,
        user: userData.id,
        userType: userData.userType,
        medium: userData.ispOwner.bpSettings?.paymentGateway?.gatewayType,
        paymentStatus: "pending",
        package: userData.pppoe.profile,
      }
    );
  };

  useEffect(() => {
    paymentExecute()
      .then((response) => (window.location.href = "/payment/success"))
      .catch((err) => (window.location.href = "/payment/failed"));
  }, []);

  return <Loader />;
}
