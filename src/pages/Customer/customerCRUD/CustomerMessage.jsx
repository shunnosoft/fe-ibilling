import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ExclamationOctagonFill } from "react-bootstrap-icons";
import { Card } from "react-bootstrap";
import { smsCount } from "../../../components/common/UtilityMethods";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";

const CustomerMessage = ({ customerId, page }) => {
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

  //initial data variable
  let data;

  // find single customer
  if (page === "customer") {
    data = customer.find((item) => item.id === customerId);
  }

  // find single static customer
  if (page === "staticCustomer") {
    data = staticCustomer.find((item) => item.id === customerId);
  }

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // get message form textare field
  const [messageLength, setMessageLength] = useState("");

  // sending type
  const [sendingType, setSendingType] = useState("nonMasking");

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
        items: [
          {
            app: "netfee",
            type: "other",
            senderId: cureentAuth?.id,
            message: messageLength,
            mobile: data?.mobile,
            count: smsCount(messageLength),
          },
        ],
        totalSmsCount: smsCount(messageLength),
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
    <>
      <Card.Title className="clintTitle mb-0">
        <h5 className="profileInfo">{t("message")}</h5>
      </Card.Title>
      <Card.Body>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <div className="d-flex justify-content-between">
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
                size={20}
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
              disabled={isLoading || !data?.mobile}
            >
              {isLoading ? <Loader /> : t("sendMessage")}
            </button>
          </div>
        </form>
      </Card.Body>
    </>
  );
};

export default CustomerMessage;
