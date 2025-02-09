import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { smsSettingUpdateIsp } from "../../../features/authSlice";
import { smsCount } from "../../../components/common/UtilityMethods";
import { useTranslation } from "react-i18next";
import useISPowner from "../../../hooks/useISPOwner";

function CustomerInactiveSmsTemplate() {
  const { t } = useTranslation();

  const textRef = useRef();
  const formRef = useRef();

  //---> @Get user & current user data form useISPOwner hooks
  const { ispOwnerData, ispOwnerId, hasMikrotik, settings } = useISPowner();

  // loading state
  const [loading, setLoading] = useState(false);

  const [totalText, setTotalText] = useState("");

  const dispatch = useDispatch();
  const [fontText, setFontText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [upperText, setUpperText] = useState("");

  const [billConfirmation, setBillConfirmation] = useState("");
  const [billconfarmationparametres, setbillconparametres] = useState([]);
  const [matchFound, setMatchFound] = useState([]);

  const [sendingType, setSendingType] = useState();

  // payment link state
  const [paymentLink, setPaymentLink] = useState("");

  // ispOwner payment gateway payment link
  const customerPaymentLink = `Payment Link: https://app.netfeebd.com/isp/${ispOwnerData?.netFeeId}`;

  // customer payment link handler
  const paymentLinkHandler = (e) => {
    if (paymentLink) {
      setPaymentLink("");
    } else {
      setPaymentLink(e.target.value);
    }
  };

  const itemSettingHandler = (item) => {
    if (billconfarmationparametres.includes(item)) {
      const index = billconfarmationparametres.indexOf(item);
      if (index > -1) {
        billconfarmationparametres.splice(index, 1);
      }
    } else {
      billconfarmationparametres.push(item);
    }

    if (matchFound.includes(item)) {
      const index = matchFound.indexOf(item);
      if (index > -1) {
        matchFound.splice(index, 1);
      }
    } else {
      if ((fontText + totalText + item).length > 334) {
        toast.error(t("exceedSMSLimit"));
        return;
      }
      matchFound.push(item);
    }

    setMatchFound(matchFound);

    var theText = "";
    matchFound.map((i) => {
      return (theText = theText + "\n" + i);
    });

    setUpperText(theText);

    setbillconparametres(billconfarmationparametres);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = {
      ...settings.sms,
      customerInactiveSendBy: sendingType,
      customerInactive:
        billConfirmation === "on"
          ? true
          : billConfirmation === "off"
          ? false
          : null,
      template: {
        ...settings.sms.template,
        customerInactive:
          fontText + upperText + "\n" + bottomText + "\n" + paymentLink,
      },
    };
    setLoading(true);
    try {
      const res = await apiLink.patch(
        `/ispOwner/settings/sms/${ispOwnerId}`,
        data
      );
      dispatch(smsSettingUpdateIsp(res.data));
      setLoading(false);
      toast.success(t("customerInactiveTemplateAlert"));
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // formRef.current.reset();
  };
  useEffect(() => {
    var theText = "";
    matchFound.map((i) => {
      return (theText = theText + "\n" + i);
    });

    setUpperText(theText);
    setTotalText(upperText + bottomText + paymentLink);
  }, [matchFound, bottomText, upperText]);
  useEffect(() => {
    const fixedvalues = [
      "USER: USERNAME",
      "ID: CUSTOMER_ID",
      "NAME: CUSTOMER_NAME",
      "BILL: AMOUNT",
      "LAST DATE: BILL_DATE",
    ];
    var found = [];

    let messageBoxStr = settings?.sms?.template?.customerInactive
      ?.replace("USER: USERNAME", "")
      .replace("ID: CUSTOMER_ID", "")
      .replace("NAME: CUSTOMER_NAME", "")
      .replace("BILL: AMOUNT", "")
      .replace("LAST DATE: BILL_DATE", "");

    // setBottomText(messageBoxStr !== "undefined" ? messageBoxStr?.trim() : "");

    let temp = messageBoxStr !== "undefined" ? messageBoxStr?.split("\n") : "";

    if (temp?.length > 0) {
      setFontText(temp[0] || "");

      let temptxt = "";
      temp?.map((value, index) => {
        if (index > 1 && value !== "") {
          temptxt += value + "\n";
        }
      });
      setBottomText(temptxt);
    }
    fixedvalues.map((i) => {
      if (settings?.sms?.template?.customerInactive?.includes(i)) {
        found.push(i);
      }
      return found;
    });
    setMatchFound(found);
    // setbillconparametres(found);

    if (settings?.sms?.customerInactive) {
      setBillConfirmation("on");
    } else {
      setBillConfirmation("off");
    }

    setSendingType(settings?.sms?.customerInactiveSendBy);
  }, [settings]);

  const radioCheckHandler = (e) => {
    setBillConfirmation(e.target.value);
  };
  return (
    <div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        action=""
        className="settingForm"
      >
        <div className="writeMessageSection">
          <div className="messageStatus d-flex justify-content-between">
            <div className="sending-status">
              <h4> {t("customerInactiveSMSTemplate")} </h4>
              <div className="displayGrid1 mb-3">
                <div className="message_radio">
                  <input
                    type="radio"
                    name="billConfirmation"
                    id="onTemplate"
                    value={"on"}
                    checked={billConfirmation === "on"}
                    onChange={radioCheckHandler}
                  />
                  <label htmlFor="onTemplate">{t("ON")}</label>
                </div>

                <div className="message_radio">
                  <input
                    type="radio"
                    name="billConfirmation"
                    id="offTemplate"
                    value={"off"}
                    checked={billConfirmation === "off"}
                    onChange={radioCheckHandler}
                  />
                  <label htmlFor="offTemplate">{t("OFF")}</label>
                </div>
              </div>

              <div className="">
                <input
                  value={fontText}
                  onChange={(event) => setFontText(event.target.value)}
                  className="form-control"
                  type="text"
                  placeholder="Title"
                  maxLength={40}
                />
              </div>
            </div>
            <div className="message-sending-type">
              <h4> {t("sendingMessageType")} </h4>
              <input
                name="messageSendingType"
                type="radio"
                checked={sendingType === "nonMasking"}
                value={"nonMasking"}
                onChange={(event) => setSendingType(event.target.value)}
              />
              {t("nonMasking")} {"              "}
              <input
                name="messageSendingType"
                type="radio"
                checked={sendingType === "masking"}
                value={"masking"}
                onChange={(event) => setSendingType(event.target.value)}
              />
              {t("masking")} {"              "}
              <input
                name="messageSendingType"
                type="radio"
                checked={sendingType === "fixedNumber"}
                value={"fixedNumber"}
                onChange={(event) => setSendingType(event.target.value)}
              />
              {t("fixedNumber")} {"              "}
            </div>
          </div>

          <div className="billconfirm">
            <div className="showthesequence">
              <p className="endingText">{fontText}</p>
              {matchFound.map((item, key) => {
                return <p key={key}>{item}</p>;
              })}

              <p className="endingtext">{bottomText}</p>
              {paymentLink && <p className="text-primary">{paymentLink}</p>}
            </div>
            <div className="displayFlexx">
              {hasMikrotik && (
                <div className="radioselect">
                  <input
                    id="userName"
                    type="checkbox"
                    className="getValueUsingClass"
                    value={"USER: USERNAME"}
                    checked={matchFound.includes("USER: USERNAME")}
                    onChange={(e) => {
                      itemSettingHandler(e.target.value);
                    }}
                  />
                  <label className="templatelabel" htmlFor="userName">
                    {"USER: USERNAME"}
                  </label>
                </div>
              )}

              <div className="radioselect">
                <input
                  id="customerId"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("ID: CUSTOMER_ID")}
                  value={"ID: CUSTOMER_ID"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="customerId">
                  {"ID: CUSTOMER_ID"}
                </label>
              </div>

              <div className="radioselect">
                <input
                  id="customer"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("NAME: CUSTOMER_NAME")}
                  value={"NAME: CUSTOMER_NAME"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="customer">
                  {"NAME: CUSTOMER_NAME"}
                </label>
              </div>

              <div className="radioselect">
                <input
                  id="amount"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("BILL: AMOUNT")}
                  value={"BILL: AMOUNT"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="amount">
                  {"BILL: AMOUNT"}
                </label>
              </div>

              <div className="radioselect">
                <input
                  id="billDate"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("LAST DATE: BILL_DATE")}
                  value={"LAST DATE: BILL_DATE"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="billDate">
                  {"LAST DATE: BILL_DATE"}
                </label>
              </div>

              {ispOwnerData?.bpSettings.hasPG && (
                <div className="radioselect">
                  <input
                    id="paymentLink"
                    type="checkbox"
                    className="getValueUsingClass"
                    value={customerPaymentLink}
                    onChange={paymentLinkHandler}
                  />
                  <label className="templatelabel" htmlFor="paymentLink">
                    {"PAYMENT_LINK"}
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="smsCount">
            <span className="smsLength">
              {t("letter")}
              {(fontText + matchFound + bottomText + paymentLink).length}
            </span>
            <span>
              SMS: {smsCount(fontText + matchFound + bottomText + paymentLink)}
            </span>
          </div>

          <textarea
            id="messageTextArea"
            rows="6"
            className="form-control mt-4"
            placeholder={t("messageLikhun")}
            ref={textRef}
            value={bottomText}
            // onClick={insertMyText}
            maxLength={335 - upperText.length}
            onChange={(e) => setBottomText(e.target.value)}
          ></textarea>
          <hr />
          <button
            type="submit"
            // onClick={handleSendMessage}
            className="btn btn-success"
          >
            {loading ? <Loader></Loader> : t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CustomerInactiveSmsTemplate;
