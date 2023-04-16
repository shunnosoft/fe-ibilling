import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCustomerInfo, getIspOwner } from "../../features/qrCodeApi";
import { badge } from "../../components/common/Utils";
import { ToastContainer } from "react-toastify";
import PaymentModal from "../../ownerCustomer/paymentModal";

const QRCodePay = () => {
  const [ispInfo, setIspInfo] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [input, setInput] = useState("");

  const { ispId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getIspOwner(ispId, setIsLoading, setIspInfo);
  }, [ispId]);

  const getCustomerHandler = () => {
    getCustomerInfo(ispInfo.id, setIsLoading, setCustomerInfo, input);
  };

  return (
    <>
      <ToastContainer theme="colored" />

      <div className="ispOwner">
        <div className="w-100 mt-5">
          <div className="d-flex justify-content-center align-items-center">
            <div className="card mw-75 p-5">
              <div className="card-body">
                <h4 className=" p-3 text-center">ISP Owner Information</h4>
                <table className="client_info">
                  {ispInfo && (
                    <>
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
                    </>
                  )}
                </table>

                <hr />
                <h5 className="card-title text-center">Payment Info</h5>
                <div className="card-text">
                  {customerInfo ? (
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
                          <strong>: {customerInfo.monthlyFee} TK</strong>{" "}
                        </td>
                      </tr>
                      <tr>
                        <td>Current Status</td>
                        <td>: {badge(customerInfo.status)}</td>
                      </tr>
                    </table>
                  ) : (
                    <div className="mb-3">
                      <label
                        htmlFor="customerInfo"
                        className="form-label text-mute  mb-0"
                      >
                        Customer ID
                      </label>
                      <input
                        className="form-control shadow-none "
                        type="text"
                        id="customerInfo"
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Input your customer ID"
                      />
                    </div>
                  )}
                  {!customerInfo ? (
                    <button
                      onClick={getCustomerHandler}
                      className="btn btn-sm btn-success  shadow-none"
                    >
                      {isLoading ? "Loading" : "Search"}
                    </button>
                  ) : (
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#billPaymentModal"
                      className="btn btn-sm btn-success  shadow-none"
                    >
                      {isLoading ? "Loading" : "Pay"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {customerInfo && <PaymentModal customerData={customerInfo} isPublic />}
    </>
  );
};

export default QRCodePay;
