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

  // get SMS settings
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );
  console.log(settings);

  // handle submit method
  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
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
  }, [settings]);

  return (
    <div className="py-5">
      <h4> {t("resellerSMSTemplate")} </h4>
      <div className="form-check">
        <input
          id="rechareRadioOn"
          className="form-check-input"
          name="rechargeSMS"
          type="radio"
          checked={rechargeSMS}
          onChange={() => setRechargeSMS(true)}
        />
        <label className="form-check-label" htmlFor="rechareRadioOn">
          {t("on")}
        </label>
      </div>
      <div className="form-check">
        <input
          id="rechargeRadioOff"
          className="form-check-input"
          name="rechargeSMS"
          type="radio"
          checked={!rechargeSMS}
          onChange={() => setRechargeSMS(false)}
        />
        <label className="form-check-label" htmlFor="rechargeRadioOff">
          {t("off")}
        </label>
      </div>

      <hr />
      <button type="submit" onClick={handleSubmit} className="btn btn-success">
        {loading ? <Loader></Loader> : t("save")}
      </button>
    </div>
  );
};

export default ResellerRechargeSmsTemplate;
