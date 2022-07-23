import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import apiLink from "../api/apiLink";
import PaymentModal from "./paymentModal";

export default function ClientProfile() {
  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser.customer
  );

  // useEffect(() => {
  //   apiLink(`customer/mikrotik/currentSession `)
  //     .then((data) => console.log(data.data))
  //     .catch((e) => {
  //       console.log(e.response?.data?.message);
  //     });
  // }, []);

  return (
    <>
      <div className="client-info">
        <PaymentModal />
        <div class="jumbotron">
          <h1 class="display-4">Customer Information</h1>
          <table className="client_info_table">
            <tr>
              <td>Name</td>
              <td>{userData?.name}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{userData?.address}</td>
            </tr>
            <tr>
              <td>Package</td>
              {userData.userType === "pppoe" && (
                <td>{userData?.pppoe.profile}</td>
              )}
              {userData.userType === "simple-queue" && (
                <td>
                  {" "}
                  {parseInt(userData.queue.maxLimit.split("/")[1] / 1000000)}
                  MBps
                </td>
              )}
            </tr>
            <tr>
              <td>Balance</td>
              <td>{userData?.balance}</td>
            </tr>
            <tr>
              <td>Monthly fee</td>
              <td>{userData?.monthlyFee}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{userData?.status}</td>
            </tr>
          </table>
        </div>
        <div className="up_downLoad">
          <div className="up_down upload">
            <p>Upload</p>
            {userData.userType === "simple-queue" && (
              <h3>
                {parseInt(userData.queue.maxLimit.split("/")[0] / 1000000)}MBps
              </h3>
            )}
            {userData.userType === "pppoe" && <h3>{userData.pppoe.profile}</h3>}
          </div>
          <div className="up_down download">
            <p>Downlaod</p>
            {userData.userType === "pppoe" && <h3>{userData.pppoe.profile}</h3>}
            {userData.userType === "simple-queue" && (
              <h3>
                {parseInt(userData.queue.maxLimit.split("/")[1] / 1000000)}MBps
              </h3>
            )}
          </div>
          <div
            data-bs-toggle="modal"
            data-bs-target="#billPaymentModal"
            style={{ cursor: "pointer" }}
            className="up_down download"
          >
            <p>Payment</p>

            <h3>Bill Pay</h3>
          </div>
        </div>
      </div>
    </>
  );
}
