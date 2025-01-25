import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { badge } from "../../../components/common/Utils";
import useSelectorState from "../../../hooks/useSelectorState";

export default function Details({ show, setShow, activityLog }) {
  const { t } = useTranslation();

  //---> Get redux store state data from useSelectorState hooks
  const { areas } = useSelectorState();

  const objectIdRegex = /^[a-fA-F0-9]{24}$/;

  const getFormattedValue = (value) => {
    if (
      typeof value === "string" &&
      !/^\d+$/.test(value) &&
      moment(value).isValid()
    ) {
      return moment(value).format("YYYY/MM/DD hh:mm A");
    } else if (objectIdRegex?.test(value)) {
      const area = areas?.find((item) => item.id === value);
      return area?.name;
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
      size="lg"
      header={t("activityLogDetails")}
    >
      <div className="displayGrid">
        <div className="displayGridHorizontalFill5_5">
          <div className="displayGridHorizontalFill5_5">
            <p>{activityLog?.data?.map((item) => item.module)}</p>
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

        {activityLog?.data?.map((item) => (
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
              {activityLog?.action !== "DELETE" && (
                <div>
                  <p className="reportCollect p-2 h6 mb-0">
                    {t("previousState")}
                  </p>
                  <div className="displayGridManual6_4">
                    {Object.keys(item.old).map((key) => (
                      <React.Fragment key={key}>
                        <p className="changeLabelFontColor">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </p>
                        <p className="changeLabelFontColor">
                          {typeof item.old[key] === "object" &&
                          ![undefined, null].includes(item.old[key])
                            ? Object.keys(item.old?.[key])?.map((subKey) => (
                                <React.Fragment key={subKey}>
                                  <div className="displayGridManual6_4">
                                    <p className="changeLabelFontColor">
                                      {subKey.charAt(0).toUpperCase() +
                                        subKey.slice(1)}
                                    </p>
                                    <p className="changeLabelFontColor">
                                      {item.old?.[key][subKey]}
                                    </p>
                                  </div>
                                </React.Fragment>
                              ))
                            : getFormattedValue(item.old[key])}
                        </p>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="reportCollect p-2 h6 mb-0">{t("currentState")}</p>
                <div className="displayGridManual6_4">
                  {Object.keys(item.new).map((key) => (
                    <React.Fragment key={key}>
                      <p className="changeLabelFontColor">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </p>

                      <p className="changeLabelFontColor">
                        {typeof item.new[key] === "object" &&
                        ![undefined, null].includes(item.new[key])
                          ? Object.keys(item.new?.[key])?.map((subKey) => (
                              <React.Fragment key={subKey}>
                                <div className="displayGridManual6_4">
                                  <p className="changeLabelFontColor">
                                    {subKey.charAt(0).toUpperCase() +
                                      subKey.slice(1)}
                                  </p>
                                  <p className="changeLabelFontColor">
                                    {item.new?.[key][subKey]}
                                  </p>
                                </div>
                              </React.Fragment>
                            ))
                          : getFormattedValue(item.new[key])}
                      </p>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

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
