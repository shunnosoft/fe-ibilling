import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

//internal import
import Loader from "../components/common/Loader";
import { billPayment } from "../features/getIspOwnerUsersApi";
import apiLink from "../api/apiLink";
import { publicRequest } from "../api/apiLink";
import { toast } from "react-toastify";

const PaymentModal = (props) => {
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

  // customer monthly fee
  const [paymentAmount, setPaymentAmount] = useState();

  const [loading, setLoading] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [userData, setUserData] = useState(null);

  // customer biill date month set is requerd
  const [selectedMonth, setSelectedMonth] = useState([]);

  useEffect(() => {
    if (!props.customerData && customerData) {
      setPaymentAmount(
        customerData?.balance > 0 &&
          customerData?.balance <= customerData?.monthlyFee
          ? customerData?.monthlyFee - customerData?.balance
          : customerData?.balance < 0
          ? customerData?.monthlyFee + Math.abs(customerData?.balance)
          : customerData?.balance > customerData?.monthlyFee
          ? 0
          : customerData?.monthlyFee
      );

      setUserData(customerData);
    }

    //for handling qr payment
    if (props.customerData) {
      //handle qr payment
      setPaymentAmount(
        props.customerData?.balance > 0 &&
          props.customerData?.balance <= props.customerData?.monthlyFee
          ? props.customerData?.monthlyFee - props.customerData?.balance
          : props.customerData?.balance < 0
          ? props.customerData?.monthlyFee +
            Math.abs(props.customerData?.balance)
          : props.customerData?.balance > props.customerData?.monthlyFee
          ? 0
          : props.customerData?.monthlyFee
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
          amount: paymentAmount,
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
  }, [userData, paymentAmount, selectedMonth]);

  const gatewayType =
    userData?.ispOwner?.bpSettings?.paymentGateway?.gatewayType;

  return (
    <div className="modal fade" id="billPaymentModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-black">Payment Amount</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body displayGrid">
            <div>
              <label className="form-check-label changeLabelFontColor">
                Total Bill Amount <span className="text-danger">*</span>
              </label>

              <input
                onChange={(e) => setPaymentAmount(e.target.value)}
                min={userData?.monthlyFee}
                className="form-control "
                type="number"
                value={paymentAmount}
              />
            </div>

            <div>
              <label className="form-check-label changeLabelFontColor">
                Select Bill Month <span className="text-danger">*</span>
              </label>

              <Select
                className="mt-0 text-dark"
                value={selectedMonth}
                onChange={(data) => setSelectedMonth(data)}
                options={options}
                isMulti={true}
                placeholder={"Select Bill Month"}
                isSearchable
              />
            </div>

            <div class="form-check mt-2">
              <input
                onChange={(e) => setAgreement(e.target.checked)}
                min={userData?.monthlyFee}
                className="form-check-input "
                type="checkbox"
                id="agreement"
              />
              <label htmlFor="agreement">
                Do you agree our terms and conditions?
              </label>
            </div>
          </div>
          <div className="modal-footer displayGrid1">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              id={gatewayType === "bKashPG" ? "bKash_button" : ""}
              onClick={
                gatewayType !== "bKashPG" ? billPaymentController : () => {}
              }
              type="button"
              className="btn btn-primary"
              disabled={!agreement}
            >
              {loading ? <Loader /> : "Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
