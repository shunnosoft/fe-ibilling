import React, { useEffect, useState } from "react";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import apiLink from "../../../api/apiLink";
import { toast } from "react-toastify";

const StaffAssignTicketSMSTemplate = () => {
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
    setAssignTicketStatus(settings?.sms?.assignTicket);
    setSendingType(settings?.sms?.assignTicketSendBy);
    setTicketSub(assignTicketMsg ? assignTicketMsg : "");
  }, [settings]);

  return (
    <div className="py-4">
      <div className="writeMessageSection">
        <div className="messageStatus d-flex justify-content-between">
          <div className="sending-status">
            <h4> {t("assingTicketTemplate")} </h4>
            <div className="displayGrid1 mb-3">
              <div className="message_radio">
                <input
                  type="radio"
                  id="onTemplate"
                  checked={assignTicketStatus}
                  onChange={() => setAssignTicketStatus(true)}
                />
                <label htmlFor="onTemplate">{t("ON")}</label>
              </div>

              <div className="message_radio">
                <input
                  type="radio"
                  id="offTemplate"
                  checked={!assignTicketStatus}
                  onChange={() => setAssignTicketStatus(false)}
                />
                <label htmlFor="offTemplate">{t("OFF")}</label>
              </div>
            </div>
          </div>

          <div className="message-sending-type">
            <h4> {t("sendingMessageType")} </h4>
            <div className="smsType">
              <div className="message_radio">
                <input
                  type="radio"
                  id="non_Masking_11"
                  checked={sendingType === "nonMasking"}
                  value={"nonMasking"}
                  onChange={(event) => setSendingType(event.target.value)}
                />

                <label htmlFor="non_Masking_11"> {t("nonMasking")}</label>
              </div>

              <div className="message_radio">
                <input
                  type="radio"
                  id="_masking_11"
                  checked={sendingType === "masking"}
                  value={"masking"}
                  onChange={(event) => setSendingType(event.target.value)}
                />

                <label htmlFor="_masking_11"> {t("masking")}</label>
              </div>

              <div className="message_radio">
                <input
                  type="radio"
                  id="fixed_Number_11"
                  checked={sendingType === "fixedNumber"}
                  value={"fixedNumber"}
                  onChange={(event) => setSendingType(event.target.value)}
                />

                <label htmlFor="fixed_Number_11"> {t("fixedNumber")}</label>
              </div>
            </div>
          </div>
        </div>

        <div className="displayFlexx">
          <div className="checkboxSelect">
            <input
              id="ticket_subject_11"
              type="checkbox"
              className="getValueUsingClass"
              value={"Subject: TICKET_SUBJECT"}
              checked={ticketSub}
              onChange={(e) => {
                e.target.checked
                  ? setTicketSub(e.target.value)
                  : setTicketSub("");
              }}
            />
            <label className="templatelabel" htmlFor="ticket_subject_11">
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

export default StaffAssignTicketSMSTemplate;
