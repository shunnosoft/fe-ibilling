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
      <div className="col-sm-8 d-flex align-items-center">
        <div style={{ marginTop: "-5px" }}>{toggleColumnButton}</div>
        <h6 style={{ fontSize: "18px" }} className="allCollector">
          {t("totalData")} <span>{data ? data.length : "0"}</span>
        </h6>
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
