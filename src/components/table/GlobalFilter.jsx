import React from "react";

const GlobalFilter = ({ filter, setFilter, data }) => {
  return (
    <div className="row searchCollector">
      <div className="col-sm-8">
        <h4 className="allCollector">
          মোট: <span>{data ? data.length : "0"}</span>
        </h4>
      </div>

      <div className="col-sm-4">
        <div className=" collectorSearch">
          <input
            type="text"
            className="search"
            placeholder="সার্চ করুন "
            value={filter || ""}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalFilter;
