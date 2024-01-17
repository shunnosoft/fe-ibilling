import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// custom hook import
import { smsCount } from "../../../components/common/UtilityMethods";

// internal import
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";

const CustomerTicketAssignSmsTemplate = () => {
  const { t } = useTranslation();
  const textRef = useRef();

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get SMS settings
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );

  // loading state
  const [loading, setLoading] = useState(false);

  // customer ticket assign sending status
  const [assignTicketStatus, setAssignTicketStatus] = useState(true);

  // customer support ticket message sending type
  const [sendingType, setSendingType] = useState("nonMasking");

  // customer match data state
  const [matchFound, setMatchFound] = useState([]);

  // message title
  const [fontText, setFontText] = useState("");

  // select customer information
  const [upperText, setUpperText] = useState("");

  // customer text message
  const [bottomText, setBottomText] = useState("");

  // set customer text message
  const [totalText, setTotalText] = useState("");
  // set customer support ticket
  useEffect(() => {
    const fixedvalues = [
      "CUSTOMER_NAME",
      "TICKET ID: TICKET_ID",
      "STAFF NAME: STAFF_NAME",
      "STAFF MOBILE: STAFF_MOBILE",
    ];
    var found = [];

    let messageBoxStr = settings?.sms?.template?.ticketSendCustomer
      ?.replace("CUSTOMER_NAME", "")
      .replace("TICKET ID: TICKET_ID", "")
      .replace("STAFF NAME: STAFF_NAME", "")
      .replace("STAFF MOBILE: STAFF_MOBILE", "");

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
      if (settings?.sms?.template?.ticketSendCustomer?.includes(i)) {
        found.push(i);
      }
      return found;
    });
    setMatchFound(found);

    // set message sending confirmation
    if (settings?.sms?.ticketSendCustomer) {
      setAssignTicketStatus(true);
    } else {
      setAssignTicketStatus(false);
    }

    // set message sending type
    setSendingType(settings?.sms?.ticketSendCustomerSendBy);
  }, [settings]);

  // set customer information match data
  useEffect(() => {
    var theText = "";
    matchFound.map((i) => {
      return (theText = theText + "\n" + i);
    });

    setUpperText(theText);
    setTotalText(upperText + bottomText);
  }, [matchFound, bottomText, upperText]);

  // customer message submit handler
  const itemSettingHandler = (item) => {
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
  };

  // handle submit method
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
      ticketSendCustomerSendBy: sendingType,
      ticketSendCustomer: assignTicketStatus,
      template: {
        ...settings.sms.template,
        ticketSendCustomer: fontText + " " + upperText + "\n" + bottomText,
      },
    };
    setLoading(true);

    // api call
    try {
      await apiLink.patch(`/ispOwner/settings/sms/${ispOwner}`, data);
      setLoading(false);
      toast.success(t("assignTicketToast"));
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="py-4">
      <div className="writeMessageSection">
        <div className="messageStatus d-flex justify-content-between">
          <div className="sending-status">
            <h4> {t("customerNotifyTemplate")} </h4>
            <div className="displayGrid1 mb-3">
              <div className="message_radio">
                <input
                  type="radio"
                  id="onTemplate_10"
                  checked={assignTicketStatus}
                  onChange={() => setAssignTicketStatus(true)}
                />
                <label htmlFor="onTemplate_10">{t("ON")}</label>
              </div>

              <div className="message_radio">
                <input
                  type="radio"
                  id="offTemplate_10"
                  checked={!assignTicketStatus}
                  onChange={() => setAssignTicketStatus(false)}
                />
                <label htmlFor="offTemplate_10">{t("OFF")}</label>
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
                  id="non_Masking_10"
                  checked={sendingType === "nonMasking"}
                  value={"nonMasking"}
                  onChange={(event) => setSendingType(event.target.value)}
                />

                <label htmlFor="non_Masking_10"> {t("nonMasking")}</label>
              </div>

              <div className="message_radio">
                <input
                  type="radio"
                  id="_masking_10"
                  checked={sendingType === "masking"}
                  value={"masking"}
                  onChange={(event) => setSendingType(event.target.value)}
                />

                <label htmlFor="_masking_10"> {t("masking")}</label>
              </div>

              <div className="message_radio">
                <input
                  type="radio"
                  id="fixed_Number_10"
                  checked={sendingType === "fixedNumber"}
                  value={"fixedNumber"}
                  onChange={(event) => setSendingType(event.target.value)}
                />

                <label htmlFor="fixed_Number_10"> {t("fixedNumber")}</label>
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

          <div className="displayGrid mt-3">
            <div className="checkboxSelect">
              <input
                id="user_Name_10"
                type="checkbox"
                className="getValueUsingClass"
                value={"CUSTOMER_NAME"}
                checked={matchFound.includes("CUSTOMER_NAME")}
                onChange={(e) => {
                  itemSettingHandler(e.target.value);
                }}
              />
              <label className="templatelabel" htmlFor="user_Name_10">
                {"CUSTOMER NAME: CUSTOMER_NAME"}
              </label>
            </div>

            <div className="checkboxSelect">
              <input
                id="ticket_Id_2"
                type="checkbox"
                className="getValueUsingClass"
                value={"TICKET ID: TICKET_ID"}
                checked={matchFound.includes("TICKET ID: TICKET_ID")}
                onChange={(e) => {
                  itemSettingHandler(e.target.value);
                }}
              />
              <label className="templatelabel" htmlFor="ticket_Id_2">
                {"TICKET ID: TICKET_ID"}
              </label>
            </div>

            <div className="checkboxSelect">
              <input
                id="staff_id_1"
                type="checkbox"
                className="getValueUsingClass"
                value={"STAFF NAME: STAFF_NAME"}
                checked={matchFound.includes("STAFF NAME: STAFF_NAME")}
                onChange={(e) => {
                  itemSettingHandler(e.target.value);
                }}
              />
              <label className="templatelabel" htmlFor="staff_id_1">
                {"STAFF NAME: STAFF_NAME"}
              </label>
            </div>

            <div className="checkboxSelect">
              <input
                id="staff_mobile_1"
                type="checkbox"
                className="getValueUsingClass"
                value={"STAFF MOBILE: STAFF_MOBILE"}
                checked={matchFound.includes("STAFF MOBILE: STAFF_MOBILE")}
                onChange={(e) => {
                  itemSettingHandler(e.target.value);
                }}
              />
              <label className="templatelabel" htmlFor="staff_mobile_1">
                {"STAFF MOBILE: STAFF_MOBILE"}
              </label>
            </div>
          </div>
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
        className="form-control mt-2"
        placeholder={t("messageLikhun")}
        ref={textRef}
        value={bottomText}
        maxLength={335 - upperText.length}
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

export default CustomerTicketAssignSmsTemplate;
