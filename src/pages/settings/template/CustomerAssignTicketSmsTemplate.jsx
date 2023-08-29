import React, { useEffect, useState } from "react";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import apiLink from "../../../api/apiLink";
import { toast } from "react-toastify";

const CustomerAssignTicketSmsTemplate = () => {
  const { t } = useTranslation();

  // get SMS settings
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );

  // get message from redux
  let assignTicketMsg = settings.sms.template.assignTicket;

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // loading state
  const [loading, setLoading] = useState(false);

  // SMS state
  const [assignTicketStatus, setAssignTicketStatus] = useState(false);

  // message type status
  const [sendingType, setSendingType] = useState();

  // message state
  const [ticketSub, setTicketSub] = useState("");

  // handle submit method
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
      assignTicketSendBy: sendingType,
      assignTicket: assignTicketStatus,
      template: {
        ...settings.sms.template,
        assignTicket: ticketSub,
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

  useEffect(() => {
    setAssignTicketStatus(settings.sms.assignTicket);
    setSendingType(settings?.sms?.assignTicketSendBy);
    setTicketSub(assignTicketMsg ? assignTicketMsg : "");
  }, [settings]);

  return (
    <div className="py-4">
      <div className="writeMessageSection">
        <div className="messageStatus d-flex justify-content-between">
          <div className="sending-status">
            <h4> {t("assingTicketTemplate")} </h4>
            <input
              id="rechareRadioOn"
              name="assignTicket"
              type="radio"
              checked={assignTicketStatus}
              onChange={() => setAssignTicketStatus(true)}
            />
            &nbsp;
            {t("on")} {"              "}
            <input
              id="rechargeRadioOff"
              name="assignTicket"
              type="radio"
              checked={!assignTicketStatus}
              onChange={() => setAssignTicketStatus(false)}
            />
            &nbsp;
            {t("off")} {"              "}
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

export default CustomerAssignTicketSmsTemplate;
