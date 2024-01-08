import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// custom hook import
import useISPowner from "../../../hooks/useISPOwner";

// internal import
import Loader from "../../../components/common/Loader";
import apiLink from "../../../api/apiLink";
import { smsCount } from "../../../components/common/UtilityMethods";

const CustomerTicketSmsTemplate = ({ otherTabs }) => {
  const { t } = useTranslation();
  const textRef = useRef();

  // get user & current user data form useISPOwner
  const { role, ispOwnerId, userData } = useISPowner();

  // get SMS settings
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );

  // get message from redux
  let customerTicketMsg = settings.sms?.template?.customerTicket;

  // loading state
  const [loading, setLoading] = useState(false);

  // SMS state
  const [customerTicketStatus, setCustomerTicketStatus] = useState(false);

  // message type status
  const [sendingType, setSendingType] = useState("");

  const [matchFound, setMatchFound] = useState([]);

  const [billconfarmationparametres, setbillconparametres] = useState([]);
  console.log(billconfarmationparametres);

  const [fontText, setFontText] = useState("");

  const [upperText, setUpperText] = useState("");

  const [bottomText, setBottomText] = useState("");

  // set customer text message
  const [totalText, setTotalText] = useState("");

  // message state
  const [ticketSub, setTicketSub] = useState("");

  // set customer support ticket
  useEffect(() => {
    setCustomerTicketStatus(settings.sms.customerTicket);
    setSendingType(settings?.sms?.customerTicketSendBy);
    setTicketSub(customerTicketMsg ? customerTicketMsg : "");
  }, [settings]);

  // useEffect(() => {
  //   const fixedvalues = [
  //     "USER: USERNAME",
  //     "ID: CUSTOMER_ID",
  //     "NAME: CUSTOMER_NAME",
  //   ];
  //   var found = [];

  //   let messageBoxStr = settings?.sms?.template?.customerInactive
  //     ?.replace("USER: USERNAME", "")
  //     .replace("ID: CUSTOMER_ID", "")
  //     .replace("NAME: CUSTOMER_NAME", "");

  //   let temp = messageBoxStr !== "undefined" ? messageBoxStr?.split("\n") : "";

  //   if (temp?.length > 0) {
  //     setFontText(temp[0] || "");

  //     let temptxt = "";
  //     temp?.map((value, index) => {
  //       if (index > 1 && value !== "") {
  //         temptxt += value + "\n";
  //       }
  //     });
  //     setBottomText(temptxt);
  //   }
  //   fixedvalues.map((i) => {
  //     if (settings?.sms?.template?.customerInactive?.includes(i)) {
  //       found.push(i);
  //     }
  //     return found;
  //   });
  //   setMatchFound(found);
  //   // setbillconparametres(found);

  //   if (settings?.sms?.customerInactive) {
  //     setBillConfirmation("on");
  //   } else {
  //     setBillConfirmation("off");
  //   }

  //   setSendingType(settings?.sms?.customerInactiveSendBy);
  // }, [settings]);

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

  // handle submit method
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
      customerTicketSendBy: sendingType,
      customerTicket: customerTicketStatus,

      template: {
        ...settings.sms.template,
        customerTicket:
          fontText + upperText + "\n" + ticketSub + "\n" + bottomText,
      },
      // template: {
      //   ...settings.sms.template,
      //   customerTicket: ticketSub,
      // },
    };

    console.log(data);

    // setLoading(true);

    // api call
    // if (role === "ispOwner") {
    //   try {
    //     await apiLink.patch(`/ispOwner/settings/sms/${ispOwnerId}`, data);
    //     setLoading(false);
    //     toast.success(t("customerTicketToast"));
    //   } catch (error) {
    //     setLoading(false);
    //   }
    // }

    // if (role === "reseller") {
    //   try {
    //     await apiLink.patch(`/reseller/settings/sms/${userData.id}`, data);
    //     setLoading(false);
    //     toast.success(t("customerTicketToast"));
    //   } catch (error) {
    //     setLoading(false);
    //   }
    // }
  };

  return (
    <div className="py-4">
      <div className="writeMessageSection">
        <div className="messageStatus d-flex justify-content-between">
          <div className="sending-status">
            <h4> {t("customerTicketTemplate")} </h4>
            <div className="displayGrid1 mb-3">
              <div className="message_radio">
                <input
                  type="radio"
                  name="customerTicket"
                  id="onTemplate"
                  checked={customerTicketStatus}
                  onChange={() => setCustomerTicketStatus(true)}
                />
                <label htmlFor="onTemplate">{t("ON")}</label>
              </div>

              <div className="message_radio">
                <input
                  type="radio"
                  name="customerTicket"
                  id="offTemplate"
                  checked={!customerTicketStatus}
                  onChange={() => setCustomerTicketStatus(false)}
                />
                <label htmlFor="offTemplate">{t("OFF")}</label>
              </div>
            </div>

            <div>
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
            <div className="smsType">
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

        <div className="billconfirm">
          <div className="showthesequence">
            <p className="endingText">{fontText}</p>
            {matchFound.map((item, key) => {
              return <p key={key}>{item}</p>;
            })}
            <p className="endingtext">{ticketSub}</p>
            <p className="endingtext">{bottomText}</p>
          </div>

          <div className="displayFlexx">
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
                id="2"
                type="checkbox"
                className="getValueUsingClass"
                value={"SUB: TICKET_SUBJECT"}
                checked={ticketSub}
                onChange={(e) => {
                  e.target.checked
                    ? setTicketSub(e.target.value)
                    : setTicketSub("");
                }}
              />
              <label className="templatelabel" htmlFor="2">
                {"SUB: TICKET_SUBJECT"}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="smsCount">
        <span className="smsLength">
          {t("letter")}
          {(fontText + matchFound + ticketSub + bottomText).length}
        </span>
        <span>
          SMS: {smsCount(fontText + matchFound + ticketSub + bottomText)}
        </span>
      </div>

      <textarea
        id="messageTextArea"
        rows="6"
        className="form-control mt-2"
        placeholder={t("messageLikhun")}
        ref={textRef}
        value={bottomText}
        maxLength={335 - (upperText.length + ticketSub.length)}
        onChange={(e) => setBottomText(e.target.value)}
      ></textarea>

      <button
        type="submit"
        onClick={handleSubmit}
        className="btn btn-success mt-4"
      >
        {loading ? <Loader /> : t("save")}
      </button>
    </div>
  );
};

export default CustomerTicketSmsTemplate;
