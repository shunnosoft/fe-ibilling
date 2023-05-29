import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { smsCount } from "../../../../components/common/UtilityMethods";
import Loader from "../../../../components/common/Loader";
import { useSelector } from "react-redux";
import apiLink from "../../../../api/apiLink";
import { toast } from "react-toastify";

const BulkCustomerMessage = ({ bulkCustomer }) => {
  const { t } = useTranslation();

  //get ispOwner Data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData
  );

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // get message form textare field
  const [messageText, setMessageText] = useState("");

  // sending type
  const [sendingType, setSendingType] = useState("nonMasking");

  // set error value
  const [errMsg, setErrMsg] = useState("");

  // handle change
  const handleChange = (event) => {
    setMessageText(event.target.value);

    if (event.target.value) {
      setErrMsg("");
    }
  };

  // Message counting from text
  let smsAmount = smsCount(messageText);

  // validation check
  const hadleRequired = () => {
    if (!messageText) {
      setErrMsg(t("smsAmount"));
    }
  };

  // handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    //getting specific formated info from bulk customer
    let customerInfo = [];
    bulkCustomer.forEach((cus) => {
      customerInfo.push({
        app: "netfee",
        type: "bulk",
        senderId: ispOwnerData?.id,
        message: messageText,
        mobile: cus.original.mobile,
        count: smsCount(messageText),
      });
    });
    if (messageText) {
      // send data for api body
      const sendingData = {
        items: customerInfo,
        totalSmsCount: smsCount(messageText),
        sendBy: sendingType,
      };
      try {
        alert(`${t("sampleSMS")} :\n\n${messageText}`);

        if (ispOwnerData.smsBalance >= smsAmount) {
          // message confirm alert
          let condition = window.confirm(
            `${t("getSMS")} ${smsAmount} ${t("expenseSMS")}`
          );
          if (condition) {
            setIsloading(true);

            let res;

            //api for bulk sms
            res = await apiLink.post(
              `sms/bulk/${ispOwnerData?.id}`,
              sendingData
            );

            setIsloading(false);
            if (res.data.status) {
              document.querySelector("#bulkCustomerMessage").click();
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
      id="bulkCustomerMessage"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("bulkMessage")}
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
                      {t("letter")} {messageText.length}
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

                <div
                  className="message-sending-type mt-3"
                  style={{ fontWeight: "normal" }}
                >
                  <h4 className="mb-0"> {t("sendingMessageType")} </h4>
                  <input
                    name="messageSendingType"
                    type="radio"
                    checked={sendingType === "nonMasking"}
                    value={"nonMasking"}
                    onChange={(event) => setSendingType(event.target.value)}
                  />{" "}
                  {t("nonMasking")}&nbsp; &nbsp;
                  <input
                    name="messageSendingType"
                    type="radio"
                    value={"masking"}
                    onChange={(event) => setSendingType(event.target.value)}
                  />{" "}
                  {t("masking")}&nbsp; &nbsp;
                  <input
                    name="messageSendingType"
                    type="radio"
                    value={"fixedNumber"}
                    onChange={(event) => setSendingType(event.target.value)}
                  />{" "}
                  {t("fixedNumber")}
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

export default BulkCustomerMessage;
