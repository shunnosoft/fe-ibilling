import React, { useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../../components/common/Loader";
import RootBulkModal from "./bulkModal";

const BulkSubAreaEdit = ({ bulkCustomer }) => {
  const areas = useSelector((state) => state?.persistedReducer?.area?.area);
  const [isLoading, setIsLoading] = useState();
  const [subArea, setSubArea] = useState("");

  //state for selected value
  const [selectedValue, setSelectedValue] = useState({
    area: "",
    subArea: "",
  });

  const [error, setError] = useState({
    area: "",
    subArea: "",
  });

  // select subArea
  const selectArea = (data) => {
    const areaId = data.target.value;
    if (areas) {
      const temp = areas.find((val) => {
        return val.id === areaId;
      });
      setSubArea(temp);
    }
    setSelectedValue({
      ...selectedValue,
      area: data.target.value,
    });

    if (!data.target.value) {
      setSelectedValue({
        ...error,
        subArea: "",
      });
    }
    if (data.target.value) {
      setError({
        ...error,
        area: "",
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedValue.area) {
      setError({
        ...error,
        area: "এরিয়া সিলেক্ট করুন",
      });
    } else if (!selectedValue.subArea) {
      setError((prev) => {
        return {
          ...prev,
          subArea: "সাবএরিয়া সিলেক্ট করুন",
        };
      });
    }

    if (selectedValue.area && selectedValue.subArea) {
      const data = {
        ids: bulkCustomer.map((item) => item.original.id),
        area: selectedValue.area,
        subArea: selectedValue.subArea,
      };
    }
  };
  const subAreaEditHandler = (e) => {
    setSelectedValue({
      ...selectedValue,
      subArea: e.target.value,
    });
    if (e.target.value) {
      setError({
        ...error,
        subArea: "",
      });
    }
  };

  return (
    <RootBulkModal header="Edit SubArea">
      <form onSubmit={submitHandler}>
        <div>
          <p>এরিয়া সিলেক্ট করুন</p>
          <select
            className="form-select mw-100"
            aria-label="Default select example"
            name="area"
            onChange={selectArea}
          >
            <option value="">এরিয়া সিলেক্ট করুন</option>
            {areas.length > 0 &&
              areas.map((val, key) => (
                <option key={key} value={val.id}>
                  {val.name}
                </option>
              ))}
          </select>
          {error.area && <p className="text-danger">{error.area}</p>}
        </div>

        <div>
          <p>{subArea ? subArea.name + " এর - " : ""} সাব-এরিয়া সিলেক্ট করুন</p>
          <select
            className="form-select mw-100"
            aria-label="Default select example"
            name="subArea"
            id="subAreaId"
            onChange={subAreaEditHandler}
          >
            <option value="">সাব-এরিয়া সিলেক্ট করুন</option>
            {subArea?.subAreas &&
              subArea.subAreas.map((val, key) => (
                <option key={key} value={val.id}>
                  {val.name}
                </option>
              ))}
          </select>
          {error.subArea && <p className="text-danger">{error.subArea}</p>}
        </div>

        <div className="modal-footer" style={{ border: "none" }}>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            disabled={isLoading}
          >
            বাতিল করুন
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "সেভ করুন"}
          </button>
        </div>
      </form>
    </RootBulkModal>
  );
};

export default BulkSubAreaEdit;
