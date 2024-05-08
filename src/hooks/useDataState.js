import React, { useState } from "react";

const useDataState = () => {
  // Filter Options Data
  const [filterOptions, setFilterOption] = useState({});

  // return for state
  return {
    filterOptions,
    setFilterOption,
  };
};

export default useDataState;
