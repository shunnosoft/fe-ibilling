import React from "react";
import { useTranslation } from "react-i18next";

const GlobalFilter = ({
  filter,
  setFilter,
  data,
  customComponent,
  bulkLength,
  toggleColumnButton,
}) => {
  const { t } = useTranslation();
  return (
    <div className="childCollector">
      <div className="d-flex align-items-center">
        <div>{toggleColumnButton}</div>
        <h6 className="allCollector">
          {t("totalData")}
          <span>
            {data ? data.length : "0"} {bulkLength ? `/ ${bulkLength}` : ""}
          </span>
        </h6>
        <div id="custom_component_data">{customComponent}</div>
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
