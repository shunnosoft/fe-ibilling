import React, { useEffect, useState } from "react";
import ComponentCustomModal from "../../common/customModal/ComponentCustomModal";
import { useTranslation } from "react-i18next";
import { getIspOwner, getReseller } from "../../../features/apiCallAdmin";
import { toast } from "react-toastify";

const BillingCycle = ({ show, setShow, ispOwner }) => {
  console.log({ ispOwner });

  const { t } = useTranslation();

  // billing cycle panel state
  const [panel, setPanel] = useState("admin");

  // billing cycle state
  const [billingCycle, setBillingCycle] = useState();
  const [resellerBillCycleData, setResellerBillCycleData] = useState();

  // ispOwner customer billing cycle function handler
  const handleBillingCycle = async () => {
    if (panel === "admin") {
      getIspOwner(ispOwner?.id, setBillingCycle);
      setShow(false);
    }

    if (panel === "reseller") {
      getReseller(ispOwner?.id, setResellerBillCycleData);
      setShow(false);
    }
  };

  useEffect(() => {
    if (billingCycle) {
      toast.success(billingCycle.msg);
    }
  }, [billingCycle]);

  useEffect(() => {
    if (resellerBillCycleData) {
      toast.success(resellerBillCycleData.msg);
    }
  }, [resellerBillCycleData]);

  return (
    <ComponentCustomModal
      show={show}
      setShow={setShow}
      centered={false}
      size={"md"}
      header={t("selectBillingCyclePanel")}
      footer={
        <div>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleBillingCycle}
          >
            {t("submit")}
          </button>
        </div>
      }
    >
      <div className="message-sending-type">
        <div className="smsType my-3">
          <div className="message_radio">
            <input
              type="radio"
              id="admin"
              checked={panel === "admin"}
              value="admin"
              onChange={(e) => setPanel(e.target.value)}
            />

            <label htmlFor="admin" className="fs-5">
              {t("admin")}
            </label>
          </div>

          <div className="message_radio">
            <input
              type="radio"
              id="reseller"
              checked={panel === "reseller"}
              value="reseller"
              onChange={(e) => setPanel(e.target.value)}
            />

            <label htmlFor="reseller" className="fs-5">
              {t("reseller")}
            </label>
          </div>
        </div>
      </div>
    </ComponentCustomModal>
  );
};

export default BillingCycle;
