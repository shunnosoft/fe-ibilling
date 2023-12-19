import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiLink, { publicRequest } from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { billPayment } from "../../../features/getIspOwnerUsersApi";

const PayMobile = (props) => {
  const customerData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.customer
  );
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!props.customerData && customerData) {
      setPaymentAmount(customerData.monthlyFee);
      setUserData(customerData);
    }
    //for handling qr payment
    if (props.customerData) {
      setPaymentAmount(props.customerData.monthlyFee); //handle qr payment
      setUserData(props.customerData);
    }
  }, [customerData, props.customerData]);

  useEffect(() => {
    //window.location.reload();
  }, []);

  const billPaymentController = async () => {
    const data = {
      amount: paymentAmount,
      name: userData.name,
      billType: "bill",
      customer: userData.id,
      ispOwner: userData.ispOwner.id,
      user: userData.id,
      userType: userData.userType,
      medium: userData.ispOwner.bpSettings?.paymentGateway?.gatewayType,
      paymentStatus: "pending",
      mikrotikPackage: userData.mikrotikPackage,
    };

    if (paymentAmount < userData.monthlyFee) {
      return alert("You can't pay less than your monthly fee");
    }
    billPayment(data, setLoading);
  };

  const bKash = window.bkash;

  let URL = {
    create: "bkash/createPayment",
    execute: "bkash/executePayment",
    baseURL: apiLink,
  };
  if (props.isPublic) {
    URL = {
      create: "bkash/createPublicPayment",
      execute: "bkash/executePublicPayment",
      baseURL: publicRequest,
    };
  }

  useEffect(() => {
    let paymentID = "";
    if (userData) {
      bKash.init({
        paymentMode: "checkout", //fixed value ‘checkout’
        paymentRequest: {
          amount: paymentAmount, //paymentAmount
          merchantInvoiceNumber: Date.now(),
          intent: "sale",
          ispOwnerId: userData.ispOwner.id,
          name: userData.name,
          billType: "bill",
          customer: userData.id,
          user: userData.id,
          userType: userData.userType,
          medium: userData.ispOwner.bpSettings?.paymentGateway?.gatewayType,
          paymentStatus: "pending",
          collectedBy: "customer",
        },
        createRequest: async function (request) {
          try {
            const { data } = await URL.baseURL.post(URL.create, request);
            if (data?.statusCode === "0000") {
              localStorage.setItem("paymentAmount", paymentAmount);
              sessionStorage.setItem("qrispid", userData.ispOwner.id);
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
            amount: paymentAmount,
            name: userData.name,
            billType: "bill",
            customer: userData.id,
            ispOwner: userData.ispOwner.id,
            user: userData.id,
            userType: userData.userType,
            medium: userData.ispOwner.bpSettings?.paymentGateway?.gatewayType,
            paymentStatus: "pending",
            mikrotikPackage: userData.mikrotikPackage,
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
  }, [userData, paymentAmount]);

  const gatewayType =
    userData?.ispOwner?.bpSettings?.paymentGateway?.gatewayType;

  return (
    <button
      id={gatewayType === "bKashPG" ? "bKash_button" : ""}
      onClick={gatewayType !== "bKashPG" ? billPaymentController : () => {}}
      type="button"
      className="btn btn-sm btn-success  shadow-none"
    >
      {loading ? <Loader /> : "Pay"}
    </button>
  );
};

export default PayMobile;
