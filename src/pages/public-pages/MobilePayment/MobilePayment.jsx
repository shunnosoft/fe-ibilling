import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { badge } from "../../../components/common/Utils";
import { getCustomerInfo, getIspOwner } from "../../../features/qrCodeApi";
import PayMobile from "./PayMobile";

const MobilePayment = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ispId = urlParams.get("ispId");
  const customerId = urlParams.get("customerId");

  const [ispInfo, setIspInfo] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (customerId) {
      getIspOwner(ispId, setIsLoading, setIspInfo);
    }
  }, [customerId]);

  useEffect(() => {
    if (ispId && ispInfo) {
      getCustomerInfo(ispInfo.id, setIsLoading, setCustomerInfo, customerId);
    }
  }, [ispInfo]);

  if (ispInfo && customerInfo) {
    return (
      <>
        <ToastContainer theme="colored" />
        <div className="ispOwner">
          <div className="w-100 mt-5">
            <div className="d-flex justify-content-center align-items-center">
              <div className="card mw-75 p-5">
                <div className="card-body">
                  {/* <h4 className=" p-3 text-center">ISP Owner Information</h4>

                  <table className="client_info">
                    <tr>
                      <td>Company</td>
                      <td>{ispInfo?.company}</td>
                    </tr>
                    <tr>
                      <td>Name</td>
                      <td>{ispInfo.name}</td>
                    </tr>
                    <tr>
                      <td>Mobile</td>
                      <td>{ispInfo.mobile}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{ispInfo.email}</td>
                    </tr>
                    <tr>
                      <td>Address</td>
                      <td>{ispInfo.address}</td>
                    </tr>
                  </table>
                  <hr /> */}
                  <h5 className="card-title text-center">Payment Info</h5>
                  <div className="card-text">
                    <table className="client_info mb-3">
                      <tr>
                        <td>Customer Name</td>

                        <td>: {customerInfo.name}</td>
                      </tr>
                      <tr>
                        <td>Customer ID</td>
                        <td>
                          <strong>: {customerInfo.customerId}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Mobile</td>
                        <td>: {customerInfo?.mobile}</td>
                      </tr>
                      <tr>
                        <td>Monthly Fee</td>
                        <td>
                          <strong>: {customerInfo.monthlyFee} TK</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Balalce</td>
                        <td>
                          <strong>: {customerInfo.balance} TK</strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Current Status</td>
                        <td>: {badge(customerInfo.status)}</td>
                      </tr>
                      <br />
                      <PayMobile customerData={customerInfo} isPublic />
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return "";
  }
};

export default MobilePayment;
