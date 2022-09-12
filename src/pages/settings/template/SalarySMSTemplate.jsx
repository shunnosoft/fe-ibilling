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
  console.log(settings);
  const [salarySMS, setSalarySMS] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
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
  }, [settings]);

  return (
    <div>
      <div className="py-5">
        <h4> {t("SalarySMSTemplate")} </h4>
        <div className="form-check">
          <input
            id="salaryRadioOn"
            className="form-check-input"
            name="salarySMS"
            type="radio"
            checked={salarySMS}
            onChange={() => setSalarySMS(true)}
          />
          <label className="form-check-label" htmlFor="salaryRadioOn">
            {t("on")}
          </label>
        </div>
        <div className="form-check">
          <input
            id="salaryRadioOff"
            className="form-check-input"
            name="salarySMS"
            type="radio"
            checked={!salarySMS}
            onChange={() => setSalarySMS(false)}
          />
          <label className="form-check-label" htmlFor="salaryRadioOff">
            {t("off")}
          </label>
        </div>

        <hr />
        <button
          type="submit"
          onClick={handleSubmit}
          className="btn btn-success"
        >
          {loading ? <Loader></Loader> : t("save")}
        </button>
      </div>
    </div>
  );
}

export default SalarySMSTemplate;
