import React from "react";
import { useTranslation } from "react-i18next";

const GlobalFilter = ({
  filter,
  setFilter,
  data,
  customComponent,
  toggleColumnButton,
}) => {
  const { t } = useTranslation();
  return (
    <div className="row searchCollector d-flex">
      <div
        style={{ display: "flex", alignItems: "center" }}
        className="col-sm-8"
      >
        <h4 style={{ fontSize: "18px" }} className="allCollector">
          {t("totalData")} <span>{data ? data.length : "0"}</span>
        </h4>
        <div>{customComponent}</div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "end", alignItems: "center" }}
        className="col-sm-1"
      >
        {toggleColumnButton}
      </div>
      <div className="col-sm-3">
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
