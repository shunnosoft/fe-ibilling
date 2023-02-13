import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PaymentModal from "./paymentModal";
import bkashImg from "../assets/img/bkash.jpg";
import { getPackagesByIspOwer } from "../features/getIspOwnerUsersApi";
import { useDispatch } from "react-redux";
import moment from "moment";

export default function ClientProfile() {
  const dispatch = useDispatch();

  // get own data
  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser.customer
  );

  // get payment get way status
  const hasPG = userData.ispOwner.bpSettings.hasPG;

  // get all packages
  const packages = useSelector((state) => state.package.packages);

  // find alias name method
  const findAliasName = (ownPackage) => {
    const findItem = packages.find((item) => item.name.includes(ownPackage));
    return findItem;
  };

  // get package api call
  useEffect(() => {
    getPackagesByIspOwer(dispatch);
  }, []);

  return (
    <div className="container">
      <div className="client-info">
        <PaymentModal />
        <div className="jumbotron">
          <h3>Customer Information</h3>
          <div className="d-flex justify-content-between">
            <table className="client_info_table">
              <tr>
                <td>ID</td>
                <td>{userData?.customerId}</td>
              </tr>
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
                  <td>
                    {findAliasName(userData?.pppoe.profile)?.aliasName ||
                      findAliasName(userData?.pppoe.profile)?.name}
                  </td>
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

            <table className="client_info_table">
              <tr>
                <td>User Name</td>
                <td>
                  {userData.userType === "pppoe"
                    ? userData?.pppoe?.name
                    : userData?.queue?.name}
                </td>
              </tr>
              {userData.userType === "pppoe" ? (
                <tr>
                  <td>Password</td>
                  <td>{userData?.pppoe?.password}</td>
                </tr>
              ) : (
                <tr>
                  <td>Target</td>
                  <td>{userData?.queue?.target}</td>
                </tr>
              )}
              <tr>
                <td>Email</td>
                <td>{userData?.email}</td>
              </tr>
              <tr>
                <td>Service</td>
                <td>{userData.userType === "pppoe" ? "PPPoE" : "Static"}</td>
              </tr>
              <tr>
                <td>Create </td>
                <td>{moment(userData?.createdAt).format("MMM DD YYY")}</td>
              </tr>
              <tr>
                <td>Billing Cycle </td>
                <td>{moment(userData?.billingCycle).format("MMM DD YYY")}</td>
              </tr>
              <tr>
                <td>Promise Date </td>
                <td>{moment(userData?.promiseDate).format("MMM DD YYY")}</td>
              </tr>
            </table>
          </div>
        </div>
        <div className="up_downLoad">
          <div className="up_down upload">
            <p className="text-white">Upload</p>
            {userData.userType === "simple-queue" && (
              <h3>
                {parseInt(userData.queue.maxLimit.split("/")[0] / 1000000)}MBps
              </h3>
            )}
            {userData.userType === "pppoe" && (
              <h3>
                {findAliasName(userData?.pppoe.profile)?.aliasName ||
                  findAliasName(userData?.pppoe.profile)?.name}
              </h3>
            )}
          </div>
          <div className="up_down download">
            <p className="text-white">Downlaod</p>
            {userData.userType === "pppoe" && (
              <h3>
                {findAliasName(userData?.pppoe.profile)?.aliasName ||
                  findAliasName(userData?.pppoe.profile)?.name}
              </h3>
            )}
            {userData.userType === "simple-queue" && (
              <h3>
                {parseInt(userData.queue.maxLimit.split("/")[1] / 1000000)}MBps
              </h3>
            )}
          </div>
          {hasPG && (
            <div
              data-bs-toggle="modal"
              data-bs-target="#billPaymentModal"
              style={{ cursor: "pointer" }}
              className="up_down payment"
            >
              {/* <p className="text-white">Payment</p> */}
              <div className="text-center">
                <img className="w-50" src={bkashImg} alt="" />
                <h3>Payment</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
