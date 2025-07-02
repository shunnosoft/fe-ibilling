import React from "react";
import "./execute.css";
import { useEffect } from "react";
import apiLink, { publicRequest } from "../../api/apiLink";
import { useSelector } from "react-redux";
import Loader from "../../components/common/Loader";

export default function HotspotExecute() {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentID = urlParams.get("paymentID");
  const status = urlParams.get("status");

  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.customer
  );

  // reseller data
  const resellerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  const paymentExecute = async () => {
    let URL = {
      execute: "bkash/executePayment",
      baseURL: apiLink,
    };

    if (resellerData.id) {
      URL = {
        execute: "reseller/bkash-execute-recharge",
        baseURL: apiLink,
      };
    } else if (!userData) {
      URL = {
        execute: "/hotspot/bkash/payment-execute",
        baseURL: publicRequest,
      };
    }

    const ispOwnerId = userData
      ? userData.ispOwner.id
      : sessionStorage.getItem("qrispid");

    return await URL.baseURL.post(
      `${URL.execute}?paymentID=${paymentID}&status=${status}&reseller=${resellerData.id}`,
      {
        ispOwner: ispOwnerId,
      }
    );
  };

  useEffect(() => {
    paymentExecute()
      .then((response) => {
        if (response?.data?.bill?.paymentStatus === "paid") {
          sessionStorage.removeItem("qrispid");
          window.location.href = "/hotspot/payment/success";
        } else if (response?.data?.resellerRecharge?.paymentStatus === "paid") {
          sessionStorage.removeItem("qrispid");
          window.location.href = "/payment/success";
        } else {
          sessionStorage.removeItem("qrispid");
          window.location.href = "/payment/failed";
        }
      })
      .catch((err) => {
        sessionStorage.removeItem("qrispid");
        window.location.href = "/payment/failed";
      });
  }, []);

  return <Loader />;
}
