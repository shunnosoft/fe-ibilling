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
  const [userData, setUserData] = useState(null);

  // customer monthly fee due balance
  const [balanceDue, setBalanceDue] = useState();

  // customer total monthly fee
  const totalAmount = Number(paymentAmount) + Number(balanceDue);

  useEffect(() => {
    if (!props.customerData && customerData) {
      setPaymentAmount(
        customerData?.balance > 0 &&
          customerData?.balance <= customerData?.monthlyFee
          ? customerData?.monthlyFee - customerData?.balance
          : customerData?.balance > customerData?.monthlyFee
          ? 0
          : customerData?.monthlyFee
      );

      setBalanceDue(
        customerData?.balance < 0 ? Math.abs(customerData?.balance) : 0
      );

      setUserData(customerData);
    }
    //for handling qr payment
    if (props.customerData) {
      setPaymentAmount(
        props.customerData?.balance > 0 &&
          props.customerData?.balance <= props.customerData?.monthlyFee
          ? props.customerData?.monthlyFee - props.customerData?.balance
          : props.customerData?.balance > props.customerData?.monthlyFee
          ? 0
          : props.customerData?.monthlyFee
      ); //handle qr payment

      setBalanceDue(
        props.customerData?.balance < 0
          ? Math.abs(props.customerData?.balance)
          : 0
      );

      setUserData(props.customerData);
    }
  }, [customerData, props.customerData]);

  useEffect(() => {
    //window.location.reload();
  }, []);

  const billPaymentController = async () => {
    const data = {
      amount: totalAmount,
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

    if (totalAmount < userData.monthlyFee) {
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
          amount: totalAmount, //paymentAmount
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
              localStorage.setItem("paymentAmount", totalAmount);
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
            amount: totalAmount,
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
  }, [userData, totalAmount]);

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
