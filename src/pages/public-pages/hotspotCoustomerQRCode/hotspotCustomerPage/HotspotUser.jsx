import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import moment from "moment";

//internal import
import { badge } from "../../../../components/common/Utils";
import apiLink, { publicRequest } from "../../../../api/apiLink";
import { billPayment } from "../../../../features/getIspOwnerUsersApi";
import PackagePayment from "../../MobilePayment/PackagePayment";

const HotspotUser = ({ ispInfo }) => {
  let isPublic = true;

  // get customer package form store
  const hotspotUser = useSelector((state) => state.publicSlice?.hotspotUser);

  // loading state
  const [isLoading, setLoading] = useState(false);

  function generateNumericPassword(length = 6) {
    const digits = "0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += digits[Math.floor(Math.random() * digits.length)];
    }
    return password;
  }
  const userPassword = generateNumericPassword();

  const billPaymentController = async () => {
    const data = {
      amount: hotspotUser?.monthlyFee,
      name: hotspotUser?.name,
      billType: "bill",
      customer: hotspotUser?.id,
      ispOwner: hotspotUser?.ispOwner,
      user: hotspotUser?.user,
      userType: hotspotUser?.userType,
      medium: ispInfo?.bpSettings?.paymentGateway?.gatewayType,
      paymentStatus: "pending",
      mikrotikPackage: hotspotUser?.hotspotPackage,
    };

    billPayment(data, setLoading);
  };

  const bKash = window.bkash;
  let URL = {
    create: "hotspot/bkash/payment-create",
    execute: "hotspot/bkash/payment-execute",
    baseURL: publicRequest,
  };

  useEffect(() => {
    let paymentID = "";
    if (hotspotUser) {
      bKash.init({
        paymentMode: "checkout", //fixed value ‘checkout’
        paymentRequest: {
          amount: 1,
          merchantInvoiceNumber: Date.now(),
          intent: "sale",
          ispOwnerId: ispInfo.id,
          name: hotspotUser.name,
          mobile: hotspotUser.mobile,
          password: userPassword,
          billType: "bill",
          hotspotPackage: hotspotUser.hotspotPackage,
          customer: hotspotUser.id,
        },
        createRequest: async function (request) {
          try {
            const { data } = await URL.baseURL.post(URL.create, request);
            if (data?.statusCode === "0000") {
              localStorage.setItem("paymentAmount", hotspotUser?.monthlyFee);
              localStorage.setItem("username", hotspotUser.name);
              localStorage.setItem("password", userPassword);

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
            user: hotspotUser?.user,
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

            if (data.bill.paymentStatus === "paid") {
              window.location.href = "/payment/success";
            } else {
              window.location.href = "/payment/failed";
              bKash.execute().onError();
            }
          } catch (error) {
            bKash.execute().onError();
            window.location.href = "/payment/failed";
          }
        },
      });
    }
  }, [hotspotUser]);

  const gatewayType = ispInfo?.bpSettings?.paymentGateway?.gatewayType;

  return (
    <>
      <Card.Title className="clintTitle mb-0">
        <h5 className="profileInfo">{hotspotUser?.name}</h5>
      </Card.Title>

      <Card.Body>
        <div>
          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Status</p>
            <p>{badge(hotspotUser?.status)}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>User Name</p>
            <p>{hotspotUser.hotspot?.name}</p>
          </div>

          <div className="displayGridHorizontalFill5_5 profileDetails">
            <p>Mobile</p>
            <p>{hotspotUser?.mobile}</p>
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
            <p>Bill Date</p>
            <p>
              {moment(hotspotUser?.billingCycle).format("MMM DD YYYY hh:mm A")}
            </p>
          </div>

          {ispInfo?.bpSettings?.hasPG && hotspotUser.status !== "expired" && (
            <div className="d-flex justify-content-end mt-3">
              <button
                id={gatewayType === "bKashPG" ? "bKash_button" : ""}
                onClick={
                  gatewayType !== "bKashPG" ? billPaymentController : () => {}
                }
                type="button"
                className="btn btn-primary"
              >
                Payment
              </button>
            </div>
          )}
        </div>
      </Card.Body>

      {hotspotUser.status === "expired" && (
        <PackagePayment {...{ customer: hotspotUser, ispInfo }} />
      )}
    </>
  );
};

export default HotspotUser;
