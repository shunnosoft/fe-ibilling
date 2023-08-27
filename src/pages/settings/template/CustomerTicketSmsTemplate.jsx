import React, { useEffect, useState } from "react";
import Loader from "../../../components/common/Loader";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import apiLink from "../../../api/apiLink";
import { toast } from "react-toastify";

const CustomerTicketSmsTemplate = () => {
  const { t } = useTranslation();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get SMS settings
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );

  // get message from redux
  let customerTicketMsg = settings.sms.template.customerTicket;

  // loading state
  const [loading, setLoading] = useState(false);

  // SMS state
  const [customerTicketStatus, setCustomerTicketStatus] = useState(false);

  // message type status
  const [sendingType, setSendingType] = useState();

  // message state
  const [ticketSub, setTicketSub] = useState("");
  const [customerId, setCustomerId] = useState("");

  // handle submit method
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
      customerTicketSendBy: sendingType,
      customerTicket: customerTicketStatus,
      template: {
        ...settings.sms.template,
        customerTicket: customerId + "\n" + ticketSub,
      },
    };
    setLoading(true);

    // api call
    try {
      await apiLink.patch(`/ispOwner/settings/sms/${ispOwnerId}`, data);
      setLoading(false);
      toast.success(t("customerTicketToast"));
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    // split message
    let message = customerTicketMsg?.split("\n");

    setCustomerTicketStatus(settings.sms.customerTicket);
    setSendingType(settings?.sms?.customerTicketSendBy);
    setCustomerId(message[0] ? message[0] : "");
    setTicketSub(message[1] ? message[1] : "");
  }, [settings]);

  return (
    <div className="py-4">
      <div className="writeMessageSection">
        <div className="messageStatus d-flex justify-content-between">
          <div className="sending-status">
            <h4> {t("customerTicketTemplate")} </h4>
            <input
              id="rechareRadioOn"
              name="customerTicket"
              type="radio"
              checked={customerTicketStatus}
              onChange={() => setCustomerTicketStatus(true)}
            />
            &nbsp;
            {t("on")} {"              "}
            <input
              id="rechargeRadioOff"
              name="customerTicket"
              type="radio"
              checked={!customerTicketStatus}
              onChange={() => setCustomerTicketStatus(false)}
            />
            &nbsp;
            {t("off")} {"              "}
          </div>
          <div className="message-sending-type">
            <h4> {t("sendingMessageType")} </h4>
            <input
              name="messageSendingType"
              type="radio"
              checked={sendingType === "nonMasking"}
              value={"nonMasking"}
              onChange={(event) => setSendingType(event.target.value)}
            />{" "}
            {t("nonMasking")} {"              "}
            <input
              name="messageSendingType"
              type="radio"
              checked={sendingType === "masking"}
              value={"masking"}
              onChange={(event) => setSendingType(event.target.value)}
            />{" "}
            {t("masking")} {"              "}
            <input
              name="messageSendingType"
              type="radio"
              checked={sendingType === "fixedNumber"}
              value={"fixedNumber"}
              onChange={(event) => setSendingType(event.target.value)}
            />{" "}
            {t("fixedNumber")} {"              "}
          </div>
        </div>

        <div className="displayFlexx">
          <div className="radioselect">
            <input
              id="1"
              type="checkbox"
              className="getValueUsingClass"
              checked={customerId}
              value={"ID: CUSTOMER_ID"}
              onChange={(e) => {
                e.target.checked
                  ? setCustomerId(e.target.value)
                  : setCustomerId("");
              }}
            />
            <label className="templatelabel" htmlFor="2">
              {"ID: CUSTOMER_ID"}
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
            <label className="templatelabel" htmlFor="1">
              {"SUB: TICKET_SUBJECT"}
            </label>
          </div>
        </div>
      </div>

      <hr />
      <button type="submit" onClick={handleSubmit} className="btn btn-success">
        {loading ? <Loader /> : t("save")}
      </button>
    </div>
  );
};

export default CustomerTicketSmsTemplate;
