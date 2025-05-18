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

const CustomerTicketSmsTemplate = () => {
  const { t } = useTranslation();
  const textRef = useRef();

  //---> @Get user & current user data form useISPOwner hooks
  const { role, ispOwnerId, userData, hasMikrotik, settings } = useISPowner();

  // loading state
  const [loading, setLoading] = useState(false);

  // customer ticket message sending status
  const [ticketConfirmation, setTicketConfirmation] = useState(true);

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
      "USER: USERNAME",
      "ID: CUSTOMER_ID",
      "NAME: CUSTOMER_NAME",
      "TICKET ID: TICKET_ID",
      "SUB: TICKET_SUBJECT",
    ];
    var found = [];

    let messageBoxStr = settings?.sms?.template?.customerTicket
      ?.replace("USER: USERNAME", "")
      .replace("ID: CUSTOMER_ID", "")
      .replace("NAME: CUSTOMER_NAME", "")
      .replace("TICKET ID: TICKET_ID", "")
      .replace("SUB: TICKET_SUBJECT", "");

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
      if (settings?.sms?.template?.customerTicket?.includes(i)) {
        found.push(i);
      }
      return found;
    });
    setMatchFound(found);

    // set message sending confirmation
    if (settings?.sms?.customerTicket) {
      setTicketConfirmation(true);
    } else {
      setTicketConfirmation(false);
    }

    // set message sending type
    setSendingType(settings?.sms?.customerTicketSendBy);
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
      customerTicketSendBy: sendingType,
      customerTicket: ticketConfirmation,
      template: {
        ...settings.sms.template,
        customerTicket: fontText + upperText + "\n" + bottomText,
      },
    };

    // api call
    setLoading(true);
    if (role === "ispOwner") {
      try {
        await apiLink.patch(`/ispOwner/settings/sms/${ispOwnerId}`, data);
        setLoading(false);
        toast.success(t("customerTicketToast"));
      } catch (error) {
        setLoading(false);
      }
    }

    if (role === "reseller") {
      try {
        await apiLink.patch(`/reseller/settings/sms/${userData.id}`, data);
        setLoading(false);
        toast.success(t("customerTicketToast"));
      } catch (error) {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="writeMessageSection">
        <div className="messageStatus d-flex justify-content-between">
          <div className="sending-status">
            <h4> {t("customerTicketTemplate")} </h4>
            <div className="displayGrid1 mb-3">
              <div className="message_radio">
                <input
                  type="radio"
                  name="customerTicket"
                  id="templateON"
                  checked={ticketConfirmation}
                  onChange={() => setTicketConfirmation(true)}
                />
                <label htmlFor="templateON">{t("ON")}</label>
              </div>

              <div className="message_radio">
                <input
                  type="radio"
                  name="customerTicket"
                  id="templateOFF"
                  checked={!ticketConfirmation}
                  onChange={() => setTicketConfirmation(false)}
                />
                <label htmlFor="templateOFF">{t("OFF")}</label>
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
            <p className="endingtext">{bottomText}</p>
          </div>

          <div className="displayGrid mt-3">
            <div className="checkboxSelect">
              <input
                id="user_Name"
                type="checkbox"
                className="getValueUsingClass"
                value={"USER: USERNAME"}
                checked={matchFound.includes("USER: USERNAME")}
                onChange={(e) => {
                  itemSettingHandler(e.target.value);
                }}
              />
              <label className="templatelabel" htmlFor="user_Name">
                {"USER: USERNAME"}
              </label>
            </div>
            <div className="checkboxSelect">
              <input
                id="customer_Id"
                type="checkbox"
                className="getValueUsingClass"
                checked={matchFound.includes("ID: CUSTOMER_ID")}
                value={"ID: CUSTOMER_ID"}
                onChange={(e) => {
                  itemSettingHandler(e.target.value);
                }}
              />
              <label className="templatelabel" htmlFor="customer_Id">
                {"ID: CUSTOMER_ID"}
              </label>
            </div>

            <div className="checkboxSelect">
              <input
                id="customer_Name"
                type="checkbox"
                className="getValueUsingClass"
                checked={matchFound.includes("NAME: CUSTOMER_NAME")}
                value={"NAME: CUSTOMER_NAME"}
                onChange={(e) => {
                  itemSettingHandler(e.target.value);
                }}
              />
              <label className="templatelabel" htmlFor="customer_Name">
                {"NAME: CUSTOMER_NAME"}
              </label>
            </div>

            <div className="checkboxSelect">
              <input
                id="ticket_Id"
                type="checkbox"
                className="getValueUsingClass"
                value={"TICKET ID: TICKET_ID"}
                checked={matchFound.includes("TICKET ID: TICKET_ID")}
                onChange={(e) => {
                  itemSettingHandler(e.target.value);
                }}
              />
              <label className="templatelabel" htmlFor="ticket_Id">
                {"TICKET ID: TICKET_ID"}
              </label>
            </div>

            <div className="checkboxSelect">
              <input
                id="ticket_Sub"
                type="checkbox"
                className="getValueUsingClass"
                value={"SUB: TICKET_SUBJECT"}
                checked={matchFound.includes("SUB: TICKET_SUBJECT")}
                onChange={(e) => {
                  itemSettingHandler(e.target.value);
                }}
              />
              <label className="templatelabel" htmlFor="ticket_Sub">
                {"SUB: TICKET_SUBJECT"}
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

export default CustomerTicketSmsTemplate;
