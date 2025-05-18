import React, { useEffect, useState } from "react";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { getMikrotikSystemResource } from "../../../features/apiCalls";
import useISPowner from "../../../hooks/useISPOwner";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const MikrotikResource = ({ show, setShow, mikrotik }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //---> Get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  //---> Get mikrotik system data from redux store
  const system = useSelector((state) => state.mikrotik.system);

  //---> Loading State
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show) {
      getMikrotikSystemResource(
        dispatch,
        ispOwnerId,
        mikrotik?.id,
        setIsLoading
      );
    }
  }, [show]);

  const mikrotikFields = [
    { label: t("version"), key: "version" },
    { label: t("cpu"), key: "cpu" },
    { label: t("cpuCount"), key: "cpuCount" },
    { label: t("cpuFrequency"), key: "cpuFrequency" },
    { label: t("cpuLoad"), key: "cpuLoad" },
    { label: t("architectureName"), key: "architectureName" },
    { label: t("boardName"), key: "boardName" },
    { label: t("platform"), key: "platform" },
  ];

  return (
    <ComponentCustomModal
      {...{
        show,
        setShow,
        centered: true,
        header: mikrotik?.name + " " + t("mikrotikHistory"),
      }}
    >
      <div>
        {isLoading
          ? mikrotikFields.map((field, index) => (
              <div
                className="displayGridManual6_4 placeholder-glow"
                key={index}
              >
                <p>{field.label}:</p>
                <p className="placeholder rounded-pill"></p>
              </div>
            ))
          : mikrotikFields.map((field, index) => (
              <div className="displayGridManual6_4" key={index}>
                <p>{field.label}:</p>
                <p>{system?.[field.key]}</p>
              </div>
            ))}
      </div>
    </ComponentCustomModal>
  );
};

export default MikrotikResource;
