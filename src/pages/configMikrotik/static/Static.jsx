import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CustomerSync from "../configMikrotikModals/CustomerSync";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PersonLinesFill } from "react-bootstrap-icons";

const Static = () => {
  const { ispOwner, mikrotikId } = useParams();
  const { t } = useTranslation();

  // get all mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // mikrotik
  const configMikrotik = mikrotik.find((item) => item.id === mikrotikId);

  // inactive customer state
  const [inActiveCustomer, setInActiveCustomer] = useState(false);

  // customer type state
  const [customerType, setCustomerType] = useState();

  return (
    <>
      <div className="collectorWrapper mt-2 py-2">
        <div className="addCollector">
          <div className=" d-flex justify-content-around">
            {/* <div className="rightSideMikrotik">
              <h5 className="mb-1"> {t("select")} </h5>
              <select
                id="selectMikrotikOption"
                className="form-select mt-0"
                onChange={(event) => setShowSection(event.target.value)}
              >
                <option value="hotspotPackage">{t("package")}</option>
                <option value="hotsPotCustomer">{t("sokolCustomer")}</option>
              </select>
            </div> */}

            {/* mikrotik information */}
            <div className="mikrotikDetails">
              <p className="lh-sm">
                {t("name")} : <b>{configMikrotik?.name || "..."}</b>
              </p>
              <p className="lh-sm">
                {t("ip")} : <b>{configMikrotik?.host || "..."}</b>
              </p>
              <p className="lh-sm">
                {t("userName")} : <b>{configMikrotik?.username || "..."}</b>
              </p>
              <p className="lh-sm">
                {t("port")} : <b>{configMikrotik?.port || "..."}</b>
              </p>
            </div>

            {/* setting button */}
            <div className="addAndSettingIcon">
              {/* static customer sync button */}
              <button
                data-bs-toggle="modal"
                data-bs-target="#SyncCustomer"
                onClick={() => {
                  setInActiveCustomer(false);
                  setCustomerType("static");
                }}
                title={t("staticCustomerSync")}
                className="btn btn-outline-primary me-2 "
              >
                {t("staticCustomerSync")} <PersonLinesFill />
              </button>
            </div>
          </div>
        </div>
      </div>
      <CustomerSync
        mikrotikId={mikrotikId}
        ispOwner={ispOwner}
        customerType={customerType}
        inActiveCustomer={inActiveCustomer}
        setInActiveCustomer={setInActiveCustomer}
      />
    </>
  );
};

export default Static;
