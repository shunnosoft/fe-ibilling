import React, { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../common/Loader";
import { smsCount } from "../common/UtilityMethods";
import apiLink from "../../api/apiLink";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const SingleMessage = ({ single, sendCustomer }) => {
  const { t } = useTranslation();
  //get role from redux
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  let cureentAuth;
  if (currentUser?.user?.role === "ispOwner") {
    cureentAuth = currentUser?.ispOwner;
  } else if (currentUser?.user?.role === "reseller") {
    cureentAuth = currentUser?.reseller;
  }

  // get all customer from redux
  const customer = useSelector((state) => state?.customer?.customer);

  // get all satic customer from redux
  const staticCustomer = useSelector(
    (state) => state?.customer?.staticCustomer
  );

  // get all collector from redux
  const collector = useSelector((state) => state?.collector?.collector);

  // get all reseller from redux
  const allReseller = useSelector((state) => state?.reseller?.reseller);

  // get all staff from redux
  const getAllStaffs = useSelector((state) => state?.staff?.staff);

  //initial data variable
  let data;

  if (sendCustomer === "customer") {
    // find single customer
    data = customer.find((item) => item.id === single);
  }

  if (sendCustomer === "staticCustomer") {
    // find single static customer
    data = staticCustomer.find((item) => item.id === single);
  }

  if (sendCustomer === "collector") {
    // find single collector
    data = collector.find((item) => item.id === single);
  }

  if (sendCustomer === "reseller") {
    // find single reseller
    data = allReseller.find((item) => item.id === single);
  }

  if (sendCustomer === "staff") {
    // find single reseller
    data = getAllStaffs.find((item) => item.id === single);
  }

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // get message form textare field
  const [messageLength, setMessageLength] = useState("");

  // set error value
  const [errMsg, setErrMsg] = useState("");

  // handle change
  const handleChange = (event) => {
    setMessageLength(event.target.value);

    if (event.target.value) {
      setErrMsg("");
    }
  };

  // Message counting from text
  let smsAmount = smsCount(messageLength);

  // validation check
  const hadleRequired = () => {
    if (!messageLength) {
      setErrMsg(t("smsAmount"));
    }
  };

  // handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (messageLength) {
      // send data for api body
      const sendingData = {
        items: {
          app: "netfee",
          type: "other",
          senderId: cureentAuth?.id,
          message: messageLength,
          mobile: data?.mobile,
          count: smsCount(messageLength),
        },
        totalSmsCount: smsCount(messageLength),
      };

      try {
        let owner;
        if (currentUser?.user?.role === "ispOwner") {
          owner = await apiLink.get(`/ispOwner/${cureentAuth?.id}`);
        } else if (currentUser?.user?.role === "manager") {
          owner = await apiLink.get(
            `/ispOwner/${currentUser?.manager?.ispOwner}`
          );
        } else if (currentUser?.user?.role === "reseller") {
          owner = await apiLink.get(
            `/reseller/recharge/balance/${cureentAuth?.id}`
          );
        }

        alert(`${t("sampleSMS")} :\n\n${messageLength}`);
        if (owner.data.smsBalance >= smsAmount) {
          // message confirm alert
          let condition = window.confirm(
            `${data.name}  ${t("getSMS")} ${smsAmount} ${t("expenseSMS")} `
          );
          if (condition) {
            setIsloading(true);

            let res;
            if (currentUser?.user?.role === "ispOwner") {
              res = await apiLink.post(
                `sms/bulk/${cureentAuth.id}`,
                sendingData
              );
            } else if (currentUser?.user?.role === "manager") {
              res = await apiLink.post(
                `sms/bulk/${currentUser?.manager?.ispOwner}`,
                sendingData
              );
            } else if (currentUser?.user?.role === "reseller") {
              res = await apiLink.post(
                `sms/reseller/bulk/${cureentAuth.id}`,
                sendingData
              );
            }

            setIsloading(false);
            if (res.data.status) {
              document.querySelector("#customerMessageModal").click();
              toast.success(t("successAlertSMS"));
            } else {
              toast.error(t("sendingProblem"));
            }
          }
        }
      } catch (error) {
        toast.error(error);
      }
    } else {
      setErrMsg(t("smsAmount"));
    }
  };
  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="customerMessageModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {data?.name} {t("sendingMessage")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {/* model body here */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label fw-bold mb-0"
                  >
                    {t("message")}
                  </label>
                  <div className="smsCount mt-0">
                    <span className="smsLength">
                      {t("letter")} {messageLength.length}
                    </span>
                    <span>SMS: {smsAmount}</span>
                  </div>
                </div>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  placeholder={t("messageLikhun")}
                  onChange={handleChange}
                  onBlur={hadleRequired}
                ></textarea>
                <div id="emailHelp" className="form-text text-danger">
                  {errMsg}
                </div>
              </div>
              <div className="modal-footer" style={{ border: "none" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  disabled={isLoading}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : t("sendMessage")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;
