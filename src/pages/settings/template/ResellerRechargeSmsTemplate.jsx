import React, { useEffect, useState } from "react";
import Loader from "../../../components/common/Loader";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import apiLink from "../../../api/apiLink";
import { toast } from "react-toastify";

const ResellerRechargeSmsTemplate = () => {
  const { t } = useTranslation();

  // loading state
  const [loading, setLoading] = useState(false);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // SMS state
  const [rechargeSMS, setRechargeSMS] = useState(false);

  // message type status
  const [sendingType, setSendingType] = useState();

  // get SMS settings
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );

  // handle submit method
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
      resellerRechargeSendBy: sendingType,
      resellerRecharge: rechargeSMS,
    };
    setLoading(true);

    // api call
    try {
      await apiLink.patch(`/ispOwner/settings/sms/${ispOwnerId}`, data);
      setLoading(false);
      toast.success(t("rechargeSMSToast"));
    } catch (error) {
      setLoading(false);
    }
  };

  // set reseller recharge sms setting in state
  useEffect(() => {
    setRechargeSMS(settings.sms.resellerRecharge);
    setSendingType(settings?.sms?.resellerRechargeSendBy);
  }, [settings]);

  return (
    <div>
      <div className="writeMessageSection">
        <div className="messageStatus d-flex justify-content-between">
          <div className="sending-status">
            <h4> {t("resellerRechargeTemplate")} </h4>
            <div className="displayGrid1">
              <div className="message_radio">
                <input
                  type="radio"
                  name="rechargeSMS"
                  id="onTemplate"
                  checked={rechargeSMS}
                  onChange={() => setRechargeSMS(true)}
                />
                <label htmlFor="onTemplate">{t("ON")}</label>
              </div>

              <div className="message_radio">
                <input
                  type="radio"
                  name="rechargeSMS"
                  id="offTemplate"
                  checked={!rechargeSMS}
                  onChange={() => setRechargeSMS(false)}
                />
                <label htmlFor="offTemplate">{t("OFF")}</label>
              </div>
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
      </div>

      <hr />
      <button type="submit" onClick={handleSubmit} className="btn btn-success">
        {loading ? <Loader /> : t("save")}
      </button>
    </div>
  );
};

export default ResellerRechargeSmsTemplate;
