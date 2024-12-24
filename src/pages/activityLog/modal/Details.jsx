import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { badge } from "../../../components/common/Utils";

export default function Details({ show, setShow, activityLog }) {
  const { t } = useTranslation();

  //get all areas
  const areas = useSelector((state) => state.area?.area);

  const objectIdRegex = /^[a-fA-F0-9]{24}$/;

  const findIdInformation = (key, value) => {
    const area = areas?.find((item) => item.id === value);

    return area?.name;
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
                          {objectIdRegex?.test(item.old[key])
                            ? findIdInformation(item.old, item.old[key])
                            : item.old[key]}
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
                          : objectIdRegex?.test(item.new[key])
                          ? findIdInformation(item.new, item.new[key])
                          : item.new[key]}
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
