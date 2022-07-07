import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiLink from "../api/apiLink";
import { fetchpppoePackage } from "../features/apiCalls";

export default function ClientProfile() {
  const userData = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser.customer
  );

  useEffect(() => {
    apiLink(`customer/mikrotik/routerConnectivity/`).then((data) =>
      console.log(data.data)
    );
  });

  return (
    <>
      <div className="client-info">
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
              <td>{userData?.pppoe.profile}</td>
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
            <h3>18MBPS</h3>
          </div>
          <div className="up_down download">
            <p>Downlaod</p>
            <h3>18MBPS</h3>
          </div>
        </div>
      </div>
    </>
  );
}
