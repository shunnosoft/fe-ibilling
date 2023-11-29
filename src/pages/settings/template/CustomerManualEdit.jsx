import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// internal import
import Loader from "../../../components/common/Loader";
import apiLink from "../../../api/apiLink";

const CustomerManualEdit = () => {
  const { t } = useTranslation();

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get SMS settings
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // SMS state
  const [manualEditStatus, setManualEditStatus] = useState(false);

  // message type status
  const [sendingType, setSendingType] = useState("nonMasking");

  // handle submit method
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      customerInactiveManualSendBy: sendingType,
      customerInactiveManual: manualEditStatus,
    };
    setIsLoading(true);
    // api call
    try {
      await apiLink.patch(`/ispOwner/settings/sms/${ispOwner}`, data);
      toast.success(t("manualInactiveToast"));
    } catch (error) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setSendingType(settings?.sms?.customerInactiveManualSendBy);
    setManualEditStatus(settings?.sms?.customerInactiveManual);
  }, [settings]);

  return (
    <div className="py-4">
      <div className="writeMessageSection">
        <div className="messageStatus d-flex justify-content-between">
          <div className="sending-status">
            <h4> {t("manualInactive")} </h4>
            <div className="displayGrid1">
              <div className="message_radio">
                <input
                  type="radio"
                  name="assignTicket"
                  id="onTemplate"
                  checked={manualEditStatus}
                  onChange={() => setManualEditStatus(true)}
                />
                <label htmlFor="onTemplate">{t("ON")}</label>
              </div>

              <div className="message_radio">
                <input
                  type="radio"
                  name="assignTicket"
                  id="offTemplate"
                  checked={!manualEditStatus}
                  onChange={() => setManualEditStatus(false)}
                />
                <label htmlFor="offTemplate">{t("OFF")}</label>
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
            />
            {t("nonMasking")} {"              "}
            <input
              type="radio"
              checked={sendingType === "masking"}
              value={"masking"}
              onChange={(event) => setSendingType(event.target.value)}
            />
            {t("masking")} {"              "}
            <input
              type="radio"
              checked={sendingType === "fixedNumber"}
              value={"fixedNumber"}
              onChange={(event) => setSendingType(event.target.value)}
            />
            {t("fixedNumber")} {"              "}
          </div>
        </div>
      </div>

      <hr />
      <button type="submit" onClick={handleSubmit} className="btn btn-success">
        {isLoading ? <Loader /> : t("save")}
      </button>
    </div>
  );
};

export default CustomerManualEdit;
