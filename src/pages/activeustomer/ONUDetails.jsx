import React, { useEffect, useState } from "react";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import { useDispatch, useSelector } from "react-redux";
import { getActiveCustomerONUInformation } from "../../features/oltApi";
import { badge } from "../../components/common/Utils";
import { useTranslation } from "react-i18next";

const ONUDetails = ({ show, setShow, customer }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onu = useSelector((state) => state?.olt.onu);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (show && customer?.callerId?.toLowerCase() !== onu?.macAddress) {
      getActiveCustomerONUInformation(
        dispatch,
        customer?.ispOwner,
        customer?.callerId,
        setIsLoading
      );
    }
  }, [show, customer?.callerId]);

  const ONUFields = [
    // { label: "MAC Address", key: "macAddress" },
    { label: t("olt"), key: "username" },
    { label: t("status"), key: "status" },
    { label: t("onuId"), key: "onuId" },
    { label: t("pon"), key: "port" },
    { label: t("rxPower"), key: "rxPowerDbm" },
    { label: t("txPower"), key: "txPowerDbm" },
    { label: t("temperature"), key: "temperature" },
    { label: t("vlan"), key: "vlan" },
    { label: t("voltage"), key: "voltage" },
  ];

  return (
    <ComponentCustomModal
      {...{
        show,
        setShow,
        centered: true,
        size: "md",
        header: customer?.pppoe.name + " " + t("onuLaser"),
      }}
    >
      <div>
        {isLoading
          ? ONUFields.map((field, index) => (
              <div
                className="displayGridManual3_7 placeholder-glow"
                key={index}
              >
                <p>{field.label}:</p>
                <p className="placeholder rounded-pill"></p>
              </div>
            ))
          : ONUFields.map((field, index) => (
              <div className="displayGridManual3_7" key={index}>
                <p>{field.label}:</p>

                {field.key === "status" ? (
                  <p>{badge(onu?.[field.key])}</p>
                ) : (
                  <p>{onu?.[field.key]}</p>
                )}
              </div>
            ))}
      </div>
    </ComponentCustomModal>
  );
};

export default ONUDetails;
