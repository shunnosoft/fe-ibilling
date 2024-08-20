import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PaymentModal from "./paymentModal";
import bkashImg from "../assets/img/bkash.jpg";
import {
  getPackagesByIspOwer,
  hotspotCustomerPackage,
} from "../features/getIspOwnerUsersApi";
import { useDispatch } from "react-redux";
import moment from "moment";

export default function ClientProfile() {
  const dispatch = useDispatch();

  // get own data
  const userData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser.customer
  );

  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get all packages
  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  const hotspotpPackage = useSelector(
    (state) => userData.userType === "hotspot" && state?.package?.hotspotPackage
  );

  // ispOwner permission
  const permission = userData?.ispOwner.bpSettings;

  // get payment get way status
  const hasPG = userData.ispOwner.bpSettings.hasPG;

  // modal handler state
  const [show, setShow] = useState(false);

  // find alias name method
  const findAliasName = (ownPackage) => {
    const findItem = ppPackage.find((item) => item.name.includes(ownPackage));
    return findItem;
  };

  const staticMikrotikPackage = (value) => {
    const temp = ppPackage.find((val) => val.id === value);
    return temp;
  };

  const hotspotPackageFind = (value) => {
    const temp = hotspotpPackage.find((val) => val.id === value);
    return temp;
  };

  // get package api call
  useEffect(() => {
    if (userData.userType === "hotspot") {
      hotspotCustomerPackage(dispatch, userData?.ispOwner.id);
    } else {
      getPackagesByIspOwer(dispatch);
    }
  }, []);

  return (
    <>
      <div className="container">
        <h4 className="pt-2">Customer Information</h4>
        <div className="customer_information_table">
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
              <td>Mobile</td>
              <td>{userData?.mobile}</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>{userData?.address}</td>
            </tr>
            {permission?.showCustomerPanelPackage && (
              <tr>
                <td>Package</td>
                {userData.userType === "pppoe" && (
                  <td>
                    {!userData?.reseller &&
                      (findAliasName(userData?.pppoe.profile)?.aliasName ||
                        findAliasName(userData?.pppoe.profile)?.name)}
                    {userData?.reseller &&
                      findAliasName(userData?.pppoe.profile)?.name}
                  </td>
                )}
                {userData.userType === "simple-queue" && (
                  <td>
                    {parseInt(userData.queue.maxLimit.split("/")[1] / 1000000)}
                    MBps
                  </td>
                )}
                {userData.userType === "firewall-queue" && (
                  <td>
                    {staticMikrotikPackage(userData?.mikrotikPackage)?.name}
                  </td>
                )}
                {userData.userType === "hotspot" && (
                  <td>{hotspotPackageFind(userData?.hotspotPackage)?.name}</td>
                )}
              </tr>
            )}
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

        <div className="up_downLoad">
          {permission?.showCustomerPanelPackage ? (
            <>
              <div className="up_down upload">
                <p className="text-white">Upload</p>
                {userData.userType === "simple-queue" && (
                  <h3>
                    {parseInt(userData.queue.maxLimit.split("/")[0] / 1000000)}
                    MBps
                  </h3>
                )}
                {userData.userType === "pppoe" && (
                  <h3>
                    {!userData?.reseller &&
                      (findAliasName(userData?.pppoe.profile)?.aliasName ||
                        findAliasName(userData?.pppoe.profile)?.name)}
                    {userData?.reseller &&
                      findAliasName(userData?.pppoe.profile)?.name}
                  </h3>
                )}

                {userData.userType === "hotspot" && (
                  <h3>
                    {hotspotPackageFind(userData?.hotspotPackage)?.name}
                    {/* {parseInt(userData.queue.maxLimit.split("/")[0] / 1000000)} */}
                  </h3>
                )}
              </div>
              <div className="up_down download">
                <p className="text-white">Downlaod</p>
                {userData.userType === "pppoe" && (
                  <h3>
                    {!userData?.reseller &&
                      (findAliasName(userData?.pppoe.profile)?.aliasName ||
                        findAliasName(userData?.pppoe.profile)?.name)}
                    {userData?.reseller &&
                      findAliasName(userData?.pppoe.profile)?.name}
                  </h3>
                )}
                {userData.userType === "simple-queue" && (
                  <h3>
                    {parseInt(userData.queue.maxLimit.split("/")[1] / 1000000)}
                    MBps
                  </h3>
                )}
                {userData.userType === "hotspot" && (
                  <h3>
                    {hotspotPackageFind(userData?.hotspotPackage)?.name}
                    {/* {parseInt(userData.queue.maxLimit.split("/")[0] / 1000000)} */}
                  </h3>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {hasPG && (
            <div
              className="up_down payment"
              data-bs-toggle="modal"
              data-bs-target="#billPaymentModal"
              style={{ cursor: "pointer" }}
            >
              <div className="text-center">
                <img className="w-50" src={bkashImg} alt="" />
                <h3>Payment</h3>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* component modal */}

      {/* payment modal */}
      <PaymentModal />
    </>
  );
}
