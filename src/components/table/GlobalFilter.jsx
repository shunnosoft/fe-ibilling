import React from "react";
import { useTranslation } from "react-i18next";

const GlobalFilter = ({ filter, setFilter, data, customComponent }) => {
  const { t } = useTranslation();
  return (
    <div className="row searchCollector">
      <div
        style={{ display: "flex", alignItems: "center" }}
        className="col-sm-8"
      >
        <h4 style={{ fontSize: "20px" }} className="allCollector">
          {t("totalData")}: <span>{data ? data.length : "0"}</span>
        </h4>
        <div>{customComponent}</div>
      </div>

      <div className="col-sm-4">
        <div className=" collectorSearch">
          <input
            type="text"
            className="search"
            placeholder={t("search")}
            value={filter || ""}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalFilter;
