import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

// internal import
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { smsSettingUpdateIsp } from "../../../features/authSlice";
import { smsCount } from "../../../components/common/UtilityMethods";
import useISPowner from "../../../hooks/useISPOwner";

const CreateCustomerSmsTemplate = () => {
  const { t } = useTranslation();

  //---> @Get user & current user data form useISPOwner hooks
  const { ispOwnerData, ispOwnerId, hasMikrotik, settings } = useISPowner();

  const [loading, setLoading] = useState(false);
  const [totalText, setTotalText] = useState("");

  const dispatch = useDispatch();
  const [bottomText, setBottomText] = useState("");
  const [upperText, setUpperText] = useState("");
  const [fontText, setFontText] = useState("");

  const [sendingType, setSendingType] = useState();

  const [billConfirmation, setBillConfirmation] = useState("");
  const [billconfarmationparametres, setbillconparametres] = useState([]);
  const [matchFound, setMatchFound] = useState([]);

  const textRef = useRef();
  const formRef = useRef();

  // payment link state
  const [paymentLink, setPaymentLink] = useState("");

  // ispOwner payment gateway payment link
  const customerPaymentLink = `Payment Link: https://app.one-billing.com/isp/${ispOwnerData?.netFeeId}`;

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
      createCustomerSendBy: sendingType,
      createCustomer:
        billConfirmation === "on"
          ? true
          : billConfirmation === "off"
          ? false
          : null,
      template: {
        ...settings.sms.template,
        createCustomer:
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
      toast.success(t("newCustomerTemplateAlert"));
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
    setTotalText(upperText + bottomText);
  }, [matchFound, bottomText, upperText]);

  useEffect(() => {
    const fixedvalues = [
      "USER: USERNAME",
      "ID: CUSTOMER_ID",
      "PASSWORD: PASSWORD",
      "NAME: CUSTOMER_NAME",
      "BILL: AMOUNT",
      "LAST DATE: BILL_DATE",
      customerPaymentLink,
    ];
    var found = [];

    let messageBoxStr = settings?.sms?.template?.createCustomer
      ?.replace("USER: USERNAME", "")
      .replace("ID: CUSTOMER_ID", "")
      .replace("PASSWORD: PASSWORD", "")
      .replace("NAME: CUSTOMER_NAME", "")
      .replace("BILL: AMOUNT", "")
      .replace("LAST DATE: BILL_DATE", "")
      .replace(customerPaymentLink, "");

    let temp = messageBoxStr !== "undefined" ? messageBoxStr?.split("\n") : "";

    if (temp?.length > 0) {
      setFontText(temp[0] || "");

      let temptxt = "";
      temp?.map((value, index) => {
        if (index && value !== "") {
          temptxt += value + "\n";
        }
      });
      setBottomText(temptxt);
    }

    fixedvalues?.map((i) => {
      if (settings?.sms?.template?.createCustomer?.includes(i)) {
        found.push(i);
      }
      return found;
    });
    setMatchFound(found);
    // setbillconparametres(found);

    if (settings?.sms?.createCustomer) {
      setBillConfirmation("on");
    } else {
      setBillConfirmation("off");
    }

    setSendingType(settings?.sms?.createCustomerSendBy);
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
              <h4> {t("newCustomerTemplate")} </h4>
              <div className="displayGrid1 mb-3">
                <div className="message_radio">
                  <input
                    type="radio"
                    name="billConfirmation"
                    id="onTemplate_04"
                    value={"on"}
                    checked={billConfirmation === "on"}
                    onChange={radioCheckHandler}
                  />
                  <label htmlFor="onTemplate_04">{t("ON")}</label>
                </div>

                <div className="message_radio">
                  <input
                    type="radio"
                    name="billConfirmation"
                    id="offTemplate_04"
                    value={"off"}
                    checked={billConfirmation === "off"}
                    onChange={radioCheckHandler}
                  />
                  <label htmlFor="offTemplate_04">{t("OFF")}</label>
                </div>
              </div>

              <div className="">
                <input
                  value={fontText}
                  onChange={(event) => setFontText(event.target.value)}
                  class="form-control"
                  type="text"
                  placeholder="Title"
                  maxLength={40}
                />
              </div>
            </div>

            <div className="message-sending-type">
              <h4> {t("sendingMessageType")} </h4>
              <div className="smsType">
                <div className="message_radio">
                  <input
                    type="radio"
                    id="non_Masking_04"
                    checked={sendingType === "nonMasking"}
                    value={"nonMasking"}
                    onChange={(event) => setSendingType(event.target.value)}
                  />

                  <label htmlFor="non_Masking_04"> {t("nonMasking")}</label>
                </div>

                <div className="message_radio">
                  <input
                    type="radio"
                    id="_masking_04"
                    checked={sendingType === "masking"}
                    value={"masking"}
                    onChange={(event) => setSendingType(event.target.value)}
                  />

                  <label htmlFor="_masking_04"> {t("masking")}</label>
                </div>

                <div className="message_radio">
                  <input
                    type="radio"
                    id="fixed_Number_04"
                    checked={sendingType === "fixedNumber"}
                    value={"fixedNumber"}
                    onChange={(event) => setSendingType(event.target.value)}
                  />

                  <label htmlFor="fixed_Number_04"> {t("fixedNumber")}</label>
                </div>
              </div>
            </div>
          </div>

          <div className="billconfirm">
            <div className="showthesequence">
              <p className="endingText">{fontText}</p>
              {matchFound.map((item, key) => {
                return <p key={key}>{item}</p>;
              })}

              <p className="endingtext">{bottomText}</p>
            </div>
            <div className="displayFlexx">
              <div className="radioselect">
                <input
                  id="1"
                  type="checkbox"
                  className="getValueUsingClass"
                  value={"USER: USERNAME"}
                  checked={matchFound.includes("USER: USERNAME")}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="1">
                  {"USER: USERNAME"}
                </label>
              </div>
              <div className="radioselect">
                <input
                  id="2"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("ID: CUSTOMER_ID")}
                  value={"ID: CUSTOMER_ID"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="2">
                  {"ID: CUSTOMER_ID"}
                </label>
              </div>
              <div className="radioselect">
                <input
                  id="6"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("PASSWORD: PASSWORD")}
                  value={"PASSWORD: PASSWORD"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="2">
                  {"PASSWORD: PASSWORD"}
                </label>
              </div>
              <div className="radioselect">
                <input
                  id="3"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("NAME: CUSTOMER_NAME")}
                  value={"NAME: CUSTOMER_NAME"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="3">
                  {"NAME: CUSTOMER_NAME"}
                </label>
              </div>
              <div className="radioselect">
                <input
                  id="4"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("BILL: AMOUNT")}
                  value={"BILL: AMOUNT"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="4">
                  {"BILL: AMOUNT"}
                </label>
              </div>
              <div className="radioselect">
                <input
                  id="5"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("LAST DATE: BILL_DATE")}
                  value={"LAST DATE: BILL_DATE"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="5">
                  {"LAST DATE: BILL_DATE"}
                </label>
              </div>

              {ispOwnerData?.bpSettings.hasPG && (
                <div className="radioselect">
                  <input
                    id="Payment_Link"
                    type="checkbox"
                    className="getValueUsingClass"
                    value={customerPaymentLink}
                    checked={matchFound.includes(customerPaymentLink)}
                    onChange={(e) => {
                      itemSettingHandler(e.target.value);
                    }}
                  />
                  <label className="templatelabel" htmlFor="Payment_Link">
                    {"PAYMENT_LINK"}
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="smsCount">
            <span className="smsLength">
              {t("letter")}
              {(fontText + matchFound + bottomText).length}
            </span>

            <span>SMS: {smsCount(fontText + matchFound + bottomText)}</span>
          </div>

          <textarea
            id="messageTextArea"
            rows="6"
            className="form-control mt-4"
            placeholder={t("messageLikhun")}
            ref={textRef}
            value={bottomText}
            maxLength={335 - upperText.length}
            onChange={(e) => setBottomText(e.target.value)}
          ></textarea>

          <button type="submit" className="btn btn-success mt-4">
            {loading ? <Loader></Loader> : t("save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCustomerSmsTemplate;
