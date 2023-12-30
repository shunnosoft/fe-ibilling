import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiLink, { publicRequest } from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { billPayment } from "../../../features/getIspOwnerUsersApi";
import { toast } from "react-toastify";

const PayMobile = (props) => {
  // current month date
  const date = new Date();
  const monthDate = date.getMonth();

  // twelve month options
  const options = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const customerData = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.customer
  );

  const [paymentAmount, setPaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // customer monthly fee due balance
  const [balanceDue, setBalanceDue] = useState();

  // customer biill date month set is requerd
  const [selectedMonth, setSelectedMonth] = useState([]);

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

  //select bill month name
  useEffect(() => {
    let temp = [];

    // customer billing date
    const dataMonth = new Date(userData?.billingCycle).getMonth();

    if (userData?.balance === 0 && userData?.paymentStatus === "unpaid") {
      // month to monthly bill
      temp.push(options[dataMonth]);
    } else if (userData?.balance === 0 && userData?.paymentStatus === "paid") {
      // month to monthly bill
      temp.push(options[dataMonth]);
    } else if (
      userData?.balance >= userData?.monthlyFee &&
      userData?.paymentStatus === "paid"
    ) {
      // customer advance monthly bill
      const modVal = Math.floor(userData?.balance / userData?.monthlyFee);
      temp.push(options[dataMonth + modVal]);

      if (dataMonth + modVal > 11) {
        const totalMonth = dataMonth + modVal - 12;
        temp.push(options[totalMonth]);
      }
    } else if (
      userData?.balance < 0 &&
      userData?.paymentStatus === "unpaid" &&
      (userData?.status === "active" || userData?.status === "expired")
    ) {
      // customer privous monthly bill
      const modVal = Math.floor(
        Math.abs(userData?.balance / userData?.monthlyFee)
      );

      // customer privous years total due month
      const dueMonth = dataMonth - modVal;

      //find customer privous years dou month
      if (dueMonth < 0) {
        const totalMonth = 12 - Math.abs(dueMonth);

        for (let i = totalMonth; i <= 11; i++) {
          temp.push(options[i]);
        }
      }

      //find customer current years dou month
      if (modVal < 11) {
        for (let i = dueMonth; i <= dataMonth; i++) {
          if (!(i < 0)) {
            temp.push(options[i]);
          }
        }
      }
    } else if (
      userData?.balance < 0 &&
      userData?.paymentStatus === "unpaid" &&
      userData?.status === "inactive"
    ) {
      // customer privous monthly bill
      const modVal = Math.floor(
        Math.abs(userData?.balance / userData?.monthlyFee)
      );

      // customer total due month
      const dueMonth = dataMonth - modVal;

      //find customer privous years dou month
      if (dueMonth < 0) {
        const totalMonth = 12 - Math.abs(dueMonth);

        for (let i = totalMonth; i <= 11; i++) {
          temp.push(options[i]);
        }
      }

      //find customer current years dou month
      if (modVal < 11) {
        for (let i = dueMonth; i <= monthDate; i++) {
          if (!(i < 0)) {
            temp.push(options[i]);
          }
        }
      }
    }

    setSelectedMonth(temp);
  }, [userData]);

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

    //customer bill month select
    if (selectedMonth?.length === 0) {
      setLoading(false);
      return toast.warn("Select Bill Month");
    } else {
      const monthValues = selectedMonth.map((item) => {
        return item.value;
      });
      data.month = monthValues.join(",");
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
      // customer bill month select
      let selectDate = "";

      if (selectedMonth.length) {
        const monthValues = selectedMonth?.map((item) => {
          return item?.value;
        });
        selectDate = monthValues.join(",");
      }

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
          month: selectDate,
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
            month: selectDate,
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
  }, [userData, totalAmount, selectedMonth]);

  const gatewayType =
    userData?.ispOwner?.bpSettings?.paymentGateway?.gatewayType;

  return (
    <>
      <tr>
        <td>Month</td>
        <td>
          : {selectedMonth && selectedMonth?.map((val) => val.value).join(",")}
        </td>
      </tr>

      <button
        id={gatewayType === "bKashPG" ? "bKash_button" : ""}
        onClick={gatewayType !== "bKashPG" ? billPaymentController : () => {}}
        type="button"
        className="btn btn-sm btn-success shadow-none mt-3"
      >
        {loading ? <Loader /> : "Pay"}
      </button>
    </>
  );
};

export default PayMobile;
