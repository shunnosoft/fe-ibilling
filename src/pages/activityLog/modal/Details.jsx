import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { badge } from "../../../components/common/Utils";
import useSelectorState from "../../../hooks/useSelectorState";

export default function Details({ show, setShow, activityLog }) {
  const { t } = useTranslation();

  //---> Get redux store state data from useSelectorState hooks
  const { mikrotiks, packages, allPackages, areas, subAreas, ownerUsers } =
    useSelectorState();

  const objectIdRegex = /^[a-fA-F0-9]{24}$/;

  const getFormattedValue = (value) => {
    if (
      typeof value === "string" &&
      !/^\d+$/.test(value) &&
      moment(value).isValid()
    ) {
      return moment(value).format("YYYY/MM/DD hh:mm A");
    } else if (objectIdRegex?.test(value)) {
      const mikrotik = mikrotiks?.find((mtk) => mtk.id === value);
      let mtkPackage =
        allPackages?.find((pack) => pack.id === value) ??
        packages?.find((pack) => pack.id === value);
      const area = areas?.find((area) => area.id === value);
      const subArea = subAreas?.find((sub) => sub.id === value);
      const createdBy = ownerUsers?.find((user) => Boolean(user?.[value]))?.[
        value
      ];

      return mikrotik
        ? mikrotik?.name
        : mtkPackage
        ? mtkPackage?.name
        : area
        ? area?.name
        : subArea
        ? subArea?.name
        : createdBy?.name;
    } else if (typeof value === "boolean") {
      return value ? "true" : "false";
    } else {
      return value;
    }
  };

  return (
    <ComponentCustomModal
      show={show}
      setShow={setShow}
      centered={true}
      size="xl"
      header={t("activityLogDetails")}
    >
      <div className="displayGrid">
        <div className="displayGridHorizontalFill5_5">
          <div className="displayGridHorizontalFill5_5">
            <p>{activityLog.module}</p>
            <p>{badge(activityLog?.action)}</p>
          </div>

          <div className="displayGridHorizontalFill5_5">
            <p>
              {activityLog?.action?.charAt(0).toUpperCase() +
                activityLog?.action?.slice(1).toLowerCase()}{" "}
              by
            </p>
            <p>{badge(activityLog?.role)}</p>
          </div>

          <div className="displayGridHorizontalFill5_5">
            <p>{t("ipAddress")}</p>
            <p>{activityLog?.ipAddress?.split(":").pop()}</p>
          </div>

          <div className="displayGridHorizontalFill5_5">
            <p>{t("createdAt")}</p>
            <p>{moment(activityLog?.createdAt).format("YYYY-MM-DD hh:mm A")}</p>
          </div>
        </div>

        <div>
          <label className="changeLabelFontColor">
            {t("description")} <span className="text-danger me-4">*</span>
          </label>
          <input
            className="form-control shadow-none"
            value={activityLog?.description}
            disabled
          ></input>
        </div>

        <div
          className="shadow-sm bg-white rounded"
          style={{
            overflow: "auto",
            maxHeight: "400px",
            maxWidth: "100%",
          }}
        >
          <div
            className={`${
              activityLog?.action === "DELETE" ? "" : "displayGrid2"
            } p-2`}
          >
            <div>
              <p className="reportCollect p-2 h6 mb-0">{t("previousState")}</p>
              <div className="displayGridManual7_3">
                {activityLog?.old &&
                  Object.keys(activityLog?.old)?.map((key) => (
                    <React.Fragment key={key}>
                      <p className="changeLabelFontColor">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </p>
                      <p className="changeLabelFontColor">
                        {Array.isArray(activityLog?.old[key])
                          ? activityLog?.old[key]
                              ?.map((value) => getFormattedValue(value))
                              .join(", ")
                          : typeof activityLog?.old[key] === "object" &&
                            ![undefined, null].includes(activityLog?.old[key])
                          ? Object.keys(activityLog?.old?.[key])?.map(
                              (subKey) => (
                                <React.Fragment key={subKey}>
                                  <div className="displayGridManual4_6">
                                    <p className="changeLabelFontColor">
                                      {subKey.charAt(0).toUpperCase() +
                                        subKey.slice(1)}
                                    </p>
                                    <p className="changeLabelFontColor">
                                      {getFormattedValue(
                                        activityLog?.old[key][subKey]
                                      )}
                                    </p>
                                  </div>
                                </React.Fragment>
                              )
                            )
                          : getFormattedValue(activityLog?.old[key])}
                      </p>
                    </React.Fragment>
                  ))}
              </div>
            </div>

            {activityLog?.action !== "DELETE" && (
              <div>
                <p className="reportCollect p-2 h6 mb-0">{t("currentState")}</p>
                <div className="displayGridManual7_3">
                  {activityLog?.new &&
                    Object.keys(activityLog?.new)?.map((key) => (
                      <React.Fragment key={key}>
                        <p className="changeLabelFontColor">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </p>

                        <p className="changeLabelFontColor">
                          {Array.isArray(activityLog?.new[key])
                            ? activityLog?.new[key]
                                ?.map((value) => getFormattedValue(value))
                                .join(", ")
                            : typeof activityLog?.new[key] === "object" &&
                              ![undefined, null].includes(activityLog?.new[key])
                            ? Object.keys(activityLog?.new?.[key])?.map(
                                (subKey) => (
                                  <React.Fragment key={subKey}>
                                    <div className="displayGridManual4_6">
                                      <p className="changeLabelFontColor">
                                        {subKey.charAt(0).toUpperCase() +
                                          subKey.slice(1)}
                                      </p>
                                      <p className="changeLabelFontColor">
                                        {getFormattedValue(
                                          activityLog?.new[key][subKey]
                                        )}
                                      </p>
                                    </div>
                                  </React.Fragment>
                                )
                              )
                            : getFormattedValue(activityLog?.new[key])}
                        </p>
                      </React.Fragment>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div class="form-floating">
          <label className="changeLabelFontColor">{t("userAgent")}</label>
          <textarea
            value={activityLog?.userAgent}
            className="form-control shadow-none"
            style={{
              resize: "none",
              height: "100px",
            }}
            disabled
          ></textarea>
        </div>
      </div>
    </ComponentCustomModal>
  );
}
