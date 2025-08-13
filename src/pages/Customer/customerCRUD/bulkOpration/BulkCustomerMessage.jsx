import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// internal import
import { smsCount } from "../../../../components/common/UtilityMethods";
import Loader from "../../../../components/common/Loader";
import apiLink from "../../../../api/apiLink";
import RootBulkModal from "./bulkModal";

const BulkCustomerMessage = ({ bulkCustomer, show, setShow }) => {
  const { t } = useTranslation();

  //get ispOwner Data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData
  );

  //get role from redux
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // get message form textare field
  const [messageText, setMessageText] = useState("");

  // sending type
  const [sendingType, setSendingType] = useState("nonMasking");

  // set error value
  const [errMsg, setErrMsg] = useState("");

  let cureentAuth;
  if (currentUser?.user?.role === "ispOwner") {
    cureentAuth = currentUser?.ispOwner;
  } else if (currentUser?.user?.role === "reseller") {
    cureentAuth = currentUser?.reseller;
  }

  // handle change
  const handleChange = (event) => {
    setMessageText(event.target.value);

    if (event.target.value) {
      setErrMsg("");
    }
  };

  // Message counting from text
  let smsAmount = smsCount(messageText) * bulkCustomer.length;

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
        app: "ibilling",
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
        totalSmsCount: smsCount(messageText) * bulkCustomer.length,
        sendBy: sendingType,
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

        // get sms balance
        let smsBalance =
          sendingType === "nonMasking"
            ? owner?.data.smsBalance
            : sendingType === "masking"
            ? owner?.data.maskingSmsBalance
            : owner?.data.fixedNumberSmsBalance;

        alert(`${t("sampleSMS")} :${messageText}`);

        if (smsBalance >= smsAmount) {
          // message confirm alert
          let condition = window.confirm(
            `${bulkCustomer.length} ${t("getSMS")} ${smsAmount} ${t(
              "expenseSMS"
            )}`
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
              setShow(false);
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
    <RootBulkModal show={show} setShow={setShow} header={t("bulkMessage")}>
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
              <span>SMS: {smsCount(messageText)}</span>
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
            onClick={() => setShow(false)}
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
    </RootBulkModal>
  );
};

export default BulkCustomerMessage;
