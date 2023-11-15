import React, { useEffect, useState } from "react";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import apiLink from "../../../api/apiLink";
import { toast } from "react-toastify";

const CustomerTicketSmsTemplate = ({ otherTabs }) => {
  const { t } = useTranslation();

  // get SMS settings
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );

  // get message from redux
  let customerTicketMsg = settings.sms?.template?.customerTicket;

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get current user
  const userId = useSelector(
    (state) => state.persistedReducer.auth.currentUser.reseller?.id
  );

  // get user role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // loading state
  const [loading, setLoading] = useState(false);

  // SMS state
  const [customerTicketStatus, setCustomerTicketStatus] = useState(false);

  // message type status
  const [sendingType, setSendingType] = useState("");

  // message state
  const [ticketSub, setTicketSub] = useState("");

  // handle submit method
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
      customerTicketSendBy: sendingType,
      customerTicket: customerTicketStatus,
      template: {
        ...settings.sms.template,
        customerTicket: ticketSub,
      },
    };
    setLoading(true);

    // api call
    if (role === "ispOwner") {
      try {
        await apiLink.patch(`/ispOwner/settings/sms/${ispOwner}`, data);
        setLoading(false);
        toast.success(t("customerTicketToast"));
      } catch (error) {
        setLoading(false);
      }
    }

    if (role === "reseller") {
      try {
        await apiLink.patch(`/reseller/settings/sms/${userId}`, data);
        setLoading(false);
        toast.success(t("customerTicketToast"));
      } catch (error) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setCustomerTicketStatus(settings.sms.customerTicket);
    setSendingType(settings?.sms?.customerTicketSendBy);
    setTicketSub(customerTicketMsg ? customerTicketMsg : "");
  }, [settings]);

  return (
    <div className="py-4">
      <div className="writeMessageSection">
        <div className="messageStatus d-flex justify-content-between">
          <div className="sending-status">
            <h4> {t("customerTicketTemplate")} </h4>

            {/* customer create ticket template switch */}
            <div className="d-flex">
              <div>
                <input
                  id="customerTicketOn"
                  name="customerTicket"
                  type="radio"
                  checked={customerTicketStatus}
                  onChange={() => setCustomerTicketStatus(true)}
                />
                &nbsp;
                <label htmlFor="customerTicketOn"> {t("on")}</label>
              </div>

              <div>
                <input
                  id="customerTicketOff"
                  name="customerTicket"
                  type="radio"
                  checked={!customerTicketStatus}
                  onChange={() => setCustomerTicketStatus(false)}
                />
                &nbsp;
                <label htmlFor="customerTicketOff"> {t("off")}</label>{" "}
              </div>
            </div>
          </div>
          <div className="message-sending-type">
            <h4> {t("sendingMessageType")} </h4>
            <input
              type="radio"
              checked={sendingType === "nonMasking"}
              value={"nonMasking"}
              onChange={(event) => setSendingType(event.target.value)}
            />{" "}
            {t("nonMasking")} {"              "}
            <input
              type="radio"
              checked={sendingType === "masking"}
              value={"masking"}
              onChange={(event) => setSendingType(event.target.value)}
            />{" "}
            {t("masking")} {"              "}
            <input
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

      <hr />
      <button type="submit" onClick={handleSubmit} className="btn btn-success">
        {loading ? <Loader /> : t("save")}
      </button>
    </div>
  );
};

export default CustomerTicketSmsTemplate;
