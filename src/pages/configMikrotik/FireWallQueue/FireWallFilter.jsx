import React, { useState } from "react";
import { PencilFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FireWallFIlterDrop from "./FireWallFIlterDrop";
import { testFireWallApi } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";

const FireWallFilter = () => {
  const { t } = useTranslation();
  const { ispOwner, mikrotikId } = useParams();

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  //get all mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  //single mikrotik
  const configMikrotik = mikrotik.find((mtk) => mtk.id === mikrotikId);

  //sync simple queue to fire wall filter handler
  const syncSimpleQueueToFirewallFilterRuleHandler = () => {
    const data = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
    };

    testFireWallApi(data);
    testFireWallApi(setIsLoading, data);
  };

  return (
    <>
      <div className="collectorWrapper py-2">
        <div className="addCollector">
          <div className=" d-flex justify-content-around">
            <div className="mikrotikDetails">
              <p className="lh-sm">
                {t("name")}: <b>{configMikrotik?.name || "..."}</b>
              </p>
              <p className="lh-sm">
                {t("ip")}: <b>{configMikrotik?.host || "..."}</b>
              </p>
              <p className="lh-sm">
                {t("userName")}: <b>{configMikrotik?.username || "..."}</b>
              </p>
              <p className="lh-sm">
                {t("port")}: <b>{configMikrotik?.port || "..."}</b>
              </p>
            </div>

            <div className="addAndSettingIcon d-flex flex-column align-items-center">
              <div className="">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#fireWallIpFilter"
                  title="Block Ip"
                  className="btn btn-outline-primary my-2"
                >
                  {t("fireWallIpFilterDrop")} &nbsp;
                  <PencilFill />
                </button>
              </div>
              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={syncSimpleQueueToFirewallFilterRuleHandler}
                >
                  {isLoading ? <Loader /> : t("syncFireWallFilter")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FireWallFIlterDrop ispOwner={ispOwner} mikrotikId={mikrotikId} />
    </>
  );
};

export default FireWallFilter;
