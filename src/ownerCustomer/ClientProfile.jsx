import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PaymentModal from "./paymentModal";
import bkashImg from "../assets/img/bkash.jpg";
import { getPackagesByIspOwer } from "../features/getIspOwnerUsersApi";
import { useDispatch } from "react-redux";

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
