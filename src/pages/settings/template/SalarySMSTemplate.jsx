import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";

import { useTranslation } from "react-i18next";

function SalarySMSTemplate() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );
  const [salarySMS, setSalarySMS] = useState(false);

  const [salarySendingType, setSalarySendingType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
      staffSalarySendBy: salarySendingType,
      staffSalary: salarySMS,
    };
    setLoading(true);
    try {
      await apiLink.patch(`/ispOwner/settings/sms/${ispOwnerId}`, data);
      setLoading(false);
      toast.success(t("SalarySMSToast"));
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSalarySMS(settings.sms.staffSalary);
    setSalarySendingType(settings?.sms?.staffSalarySendBy);
  }, [settings]);

  return (
    <div>
      <div className="py-4">
        <div className="writeMessageSection">
          <div className="messageStatus d-flex justify-content-between">
            <div className="sending-status">
              <h4> {t("SalarySMSTemplate")} </h4>
              <div className="displayGrid1">
                <div className="message_radio">
                  <input
                    type="radio"
                    name="salarySMS"
                    id="onTemplate"
                    checked={salarySMS}
                    onChange={() => setSalarySMS(true)}
                  />
                  <label htmlFor="onTemplate">{t("ON")}</label>
                </div>

                <div className="message_radio">
                  <input
                    type="radio"
                    name="salarySMS"
                    id="offTemplate"
                    checked={!salarySMS}
                    onChange={() => setSalarySMS(false)}
                  />
                  <label htmlFor="offTemplate">{t("OFF")}</label>
                </div>
              </div>
            </div>
            <div className="message-sending-type">
              <h4> {t("sendingMessageType")} </h4>
              <input
                name="salarySmsSendingType"
                type="radio"
                checked={salarySendingType === "nonMasking"}
                value={"nonMasking"}
                onChange={(event) => setSalarySendingType(event.target.value)}
              />{" "}
              {t("nonMasking")} {"              "}
              <input
                name="salarySmsSendingType"
                type="radio"
                checked={salarySendingType === "masking"}
                value={"masking"}
                onChange={(event) => setSalarySendingType(event.target.value)}
              />{" "}
              {t("masking")} {"              "}
              <input
                name="salarySmsSendingType"
                type="radio"
                checked={salarySendingType === "fixedNumber"}
                value={"fixedNumber"}
                onChange={(event) => setSalarySendingType(event.target.value)}
              />{" "}
              {t("fixedNumber")} {"              "}
            </div>
          </div>
        </div>
        <hr />
        <button
          type="submit"
          onClick={handleSubmit}
          className="btn btn-success"
        >
          {loading ? <Loader /> : t("save")}
        </button>
      </div>
    </div>
  );
}

export default SalarySMSTemplate;
