import React, { useEffect, useState } from "react";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import { useDispatch, useSelector } from "react-redux";
import { getActiveCustomerONUInformation, getOLT } from "../../features/oltApi";
import { badge } from "../../components/common/Utils";
import { useTranslation } from "react-i18next";
import useISPowner from "../../hooks/useISPOwner";

const ONUDetails = ({ show, setShow, customer }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //---> Get user & current user data form useISPOwner hooks
  const { ispOwnerId } = useISPowner();

  //---> Get ISP owner olt from redux store
  const olt = useSelector((state) => state?.olt.olt);

  const onu = useSelector((state) => state?.olt.onu);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const macAddress =
    customer?.userType === "pppoe" ? customer?.callerId : customer?.macAddress;

  useEffect(() => {
    if (show && macAddress.toLowerCase() !== onu?.macAddress && olt?.length) {
      getActiveCustomerONUInformation(
        dispatch,
        customer?.ispOwner,
        customer?.mikrotik,
        macAddress,
        setIsLoading,
        olt[0]?.id
      );
    }
    !olt.length && getOLT(ispOwnerId, setLoading, dispatch);
  }, [show, customer, olt]);

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

  const handleOltVendorOnuLaser = (oltId) => {
    getActiveCustomerONUInformation(
      dispatch,
      customer?.ispOwner,
      customer?.mikrotik,
      macAddress,
      setIsLoading,
      oltId
    );
  };

  return (
    <ComponentCustomModal
      {...{
        show,
        setShow,
        centered: true,
        size: "md",
        header: customer?.pppoe?.name
          ? customer?.pppoe?.name
          : customer?.name + " " + t("onuLaser"),
      }}
    >
      {olt?.length > 0 && (
        <div>
          <label className="form-control-label changeLabelFontColor">
            {t("selectOlt")}
            <span className="text-danger mx-1">*</span>
          </label>
          <select
            className="form-select mt-0 mw-100"
            disabled={isLoading}
            onChange={(e) => handleOltVendorOnuLaser(e.target.value)}
          >
            {olt?.map((item) => (
              <option key={item.value} value={item.id}>
                {item.name}
              </option>
            ))}
            <option value="all">{t("allOlt")}</option>
          </select>
        </div>
      )}

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
