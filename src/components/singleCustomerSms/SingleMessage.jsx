import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ExclamationOctagonFill } from "react-bootstrap-icons";

// internal import
import Loader from "../common/Loader";
import { smsCount } from "../common/UtilityMethods";
import apiLink from "../../api/apiLink";
import ComponentCustomModal from "../common/customModal/ComponentCustomModal";

const SingleMessage = ({ show, setShow, single, sendCustomer }) => {
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

  //get all managers
  const manager = useSelector((state) => state.manager?.manager);

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

  if (sendCustomer === "manager") {
    // find single manager
    data = manager.find((item) => item.id === single);
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

        // get sms balance
        let smsBalance =
          sendingType === "nonMasking"
            ? owner?.data.smsBalance
            : sendingType === "masking"
            ? owner?.data.maskingSmsBalance
            : owner?.data.fixedNumberSmsBalance;

        alert(`${t("sampleSMS")} :\n\n${messageLength}`);
        if (smsBalance >= smsAmount) {
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
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={data?.name + " " + t("sendingMessage")}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            {!data?.mobile && (
              <div className="d-flex justify-content-center align-items-center">
                <h5 className="text-center text-danger">
                  {t("notFoundMobileNumber")}
                </h5>
                <ExclamationOctagonFill
                  className="text-warning fs-5 ms-1"
                  style={{ marginBottom: "10px" }}
                />
              </div>
            )}
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

            <div className="message-sending-type mt-3">
              <h5 className="mb-0"> {t("sendingMessageType")} </h5>
              <div className="d-flex align-items-center">
                <div className="message_radio">
                  <input
                    type="radio"
                    id="non_Masking"
                    checked={sendingType === "nonMasking"}
                    value={"nonMasking"}
                    onChange={(event) => setSendingType(event.target.value)}
                  />

                  <label htmlFor="non_Masking"> {t("nonMasking")}</label>
                </div>

                <div className="message_radio">
                  <input
                    type="radio"
                    id="_masking"
                    checked={sendingType === "masking"}
                    value={"masking"}
                    onChange={(event) => setSendingType(event.target.value)}
                  />

                  <label htmlFor="_masking"> {t("masking")}</label>
                </div>

                <div className="message_radio">
                  <input
                    type="radio"
                    id="fixed_Number"
                    checked={sendingType === "fixedNumber"}
                    value={"fixedNumber"}
                    onChange={(event) => setSendingType(event.target.value)}
                  />

                  <label htmlFor="fixed_Number"> {t("fixedNumber")}</label>
                </div>
              </div>
            </div>
          </div>

          <div className="displayGrid1 float-end mt-2">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isLoading}
              onClick={() => setShow(false)}
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
      </ComponentCustomModal>
    </>
  );
};

export default SingleMessage;
