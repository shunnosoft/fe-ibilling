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

  const [sendingType, setSendingType] = useState();
  console.log(sendingType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
      staffSalarySendBy: sendingType,
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
    setSendingType(settings?.sms?.staffSalarySendBy);
  }, [settings]);

  return (
    <div>
      <div className="py-4">
        <div className="writeMessageSection">
          <div className="messageStatus d-flex justify-content-between">
            <div className="sending-status">
              <h4> {t("SalarySMSTemplate")} </h4>
              <input
                id="salaryRadioOn"
                name="salarySMS"
                type="radio"
                checked={salarySMS}
                onChange={() => setSalarySMS(true)}
              />
              &nbsp;
              {t("on")} {"              "}
              <input
                id="salaryRadioOff"
                name="salarySMS"
                type="radio"
                checked={!salarySMS}
                onChange={() => setSalarySMS(false)}
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
