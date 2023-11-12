import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import moment from "moment";

//internal import
import { badge } from "../../../../components/common/Utils";
import { getCustomerDayLeft } from "../../../Customer/customerCRUD/customerBillDayPromiseDate";
import bkashImg from "../../../../assets/img/bkash.jpg";
import apiLink, { publicRequest } from "../../../../api/apiLink";
import { billPayment } from "../../../../features/getIspOwnerUsersApi";

const HotspotUser = ({ ispInfo }) => {
  let isPublic = true;

  // get customer package form store
  const hotspotUser = useSelector((state) => state.publicSlice?.hotspotUser);

  // loading state
  const [isLoading, setLoading] = useState(false);

  const billPaymentController = async () => {
    const data = {
      amount: hotspotUser?.monthlyFee,
      name: hotspotUser?.name,
      billType: "bill",
      customer: hotspotUser?.id,
      ispOwner: hotspotUser?.ispOwner,
      user: hotspotUser?.id,
      userType: hotspotUser?.userType,
      medium: ispInfo?.bpSettings?.paymentGateway?.gatewayType,
      paymentStatus: "pending",
      mikrotikPackage: hotspotUser?.hotspotPackage,
    };

    billPayment(data, setLoading);
  };

  const bKash = window.bkash;

  let URL = {
    create: "bkash/createPayment",
    execute: "bkash/executePayment",
    baseURL: apiLink,
  };
  if (isPublic) {
    URL = {
      create: "bkash/createPublicPayment",
      execute: "bkash/executePublicPayment",
      baseURL: publicRequest,
    };
  }

  useEffect(() => {
    let paymentID = "";
    if (hotspotUser) {
      bKash.init({
        paymentMode: "checkout", //fixed value ‘checkout’
        paymentRequest: {
          amount: hotspotUser?.monthlyFee,
          merchantInvoiceNumber: Date.now(),
          intent: "sale",
          ispOwnerId: hotspotUser?.ispOwner,
          name: hotspotUser?.name,
          billType: "bill",
          customer: hotspotUser?.id,
          user: hotspotUser?.id,
          userType: hotspotUser?.userType,
          medium: ispInfo?.bpSettings?.paymentGateway?.gatewayType,
          paymentStatus: "pending",
          collectedBy: "customer",
        },
        createRequest: async function (request) {
          try {
            const { data } = await URL.baseURL.post(URL.create, request);
            if (data?.statusCode === "0000") {
              localStorage.setItem("paymentAmount", hotspotUser?.monthlyFee);
              sessionStorage.setItem("qrispid", hotspotUser?.ispOwner);
              window.location.href = data?.bkashURL;
            }

            if (data?.paymentID) {
              paymentID = data.paymentID;
              bKash.create().onSuccess(data);
            } else {
              bKash.create().onError();
              window.location.href = "/payment/failed";
            }
          } catch (error) {
            bKash.create().onError();
            window.location.href = "/payment/failed";
            console.log(error);
          }
        },
        executeRequestOnAuthorization: async function () {
          const billData = {
            amount: hotspotUser?.monthlyFee,
            name: hotspotUser?.name,
            billType: "bill",
            customer: hotspotUser?.id,
            ispOwner: hotspotUser?.ispOwner,
            user: hotspotUser?.id,
            userType: hotspotUser?.userType,
            medium: ispInfo?.bpSettings?.paymentGateway?.gatewayType,
            paymentStatus: "pending",
            mikrotikPackage: hotspotUser?.hotspotPackage,
          };
          try {
            const { data } = await URL.baseURL.post(
              `${URL.execute}?paymentID=${paymentID}`,
              billData
            );
            console.log(data);
            if (data.bill.paymentStatus === "paid") {
              window.location.href = "/payment/success";
            } else {
              window.location.href = "/payment/failed";
              bKash.execute().onError();
            }
          } catch (error) {
            bKash.execute().onError();
            window.location.href = "/payment/failed";
            console.log(error);
          }
        },
      });
    }
  }, [hotspotUser]);

  return (
    <>
      <Card.Title className="clintTitle mb-0">
        <h5 className="profileInfo">{hotspotUser?.name}</h5>
      </Card.Title>
      <Card.Body>
        <div>
          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>User Id</p>
            <p>{hotspotUser?.customerId}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Day Left</p>
            <p
              className={`text-center ${
                getCustomerDayLeft(hotspotUser?.billingCycle) >= 20
                  ? "border border-2 border-success"
                  : getCustomerDayLeft(hotspotUser?.billingCycle) >= 10
                  ? "border border-2 border-primary"
                  : getCustomerDayLeft(hotspotUser?.billingCycle) >= 0
                  ? "magantaColor"
                  : "bg-danger text-white"
              }`}
              style={{ width: "2rem", height: "auto" }}
            >
              {getCustomerDayLeft(hotspotUser?.billingCycle)}
            </p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Hotspot Name</p>
            <p>{hotspotUser.hotspot?.name}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Mobile</p>
            <p>{hotspotUser?.mobile}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Password</p>
            <p>{hotspotUser.hotspot?.password}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Package</p>
            <p>{hotspotUser.hotspot?.profile}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Package Rate</p>
            <p>৳{hotspotUser?.monthlyFee}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Balance</p>
            <p>৳{hotspotUser?.balance}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Status</p>
            <p>{badge(hotspotUser?.status)}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Payment Status</p>
            <p>{badge(hotspotUser?.paymentStatus)}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>BillDate</p>
            <p>
              {moment(hotspotUser?.billingCycle).format("MMM DD YYYY hh:mm A")}
            </p>
          </div>

          {hotspotUser?.address && (
            <div className="displayGridHorizontalFill5_5 profileDetails">
              <p>Address</p>
              <p>{hotspotUser?.address}</p>
            </div>
          )}

          <div className="paymentOption" title="Payment">
            <img
              className="bkashPg"
              src={bkashImg}
              onClick={billPaymentController}
            />
          </div>
        </div>
      </Card.Body>
    </>
  );
};

export default HotspotUser;
