import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { bulksubAreaEdit } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";

const BulkSubAreaEdit = ({ bulkCustomer, modalId }) => {
  const { t } = useTranslation();
  const areas = useSelector((state) => state?.area?.area);
  const storeSubArea = useSelector((state) => state.area?.subArea);
  const [isLoading, setIsLoading] = useState(false);
  const [subArea, setSubArea] = useState("");
  const [areaName, setAreaName] = useState("");
  const dispatch = useDispatch();
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
    if (storeSubArea) {
      const temp = storeSubArea.filter((val) => {
        return val.area === areaId;
      });
      const areaFind = areas.find((val) => {
        return val.id === areaId;
      });
      setSubArea(temp);
      setAreaName(areaFind.name);
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
    const form = e.target;
    if (!selectedValue.area) {
      setError({
        ...error,
        area: t("selectArea"),
      });
    } else if (!selectedValue.subArea) {
      setError((prev) => {
        return {
          ...prev,
          subArea: t("selectSubArea"),
        };
      });
    }

    if (selectedValue.area && selectedValue.subArea) {
      const data = {
        customerIds: bulkCustomer.map((item) => item.original.id),
        subAreaId: selectedValue.subArea,
      };
      const confirm = window.confirm(
        t("areYouWantToUpdate") +
          bulkCustomer.length +
          t("updateCustomerSubArea")
      );
      if (confirm) {
        bulksubAreaEdit(dispatch, data, setIsLoading);
      }
      setSelectedValue({
        area: "",
        subArea: "",
      });
      setAreaName("");
      form.reset();
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
    <RootBulkModal modalId={modalId} header={t("updateArea")}>
      <form onSubmit={submitHandler}>
        <div>
          <p>{t("selectArea")}</p>
          <select
            className="form-select mw-100"
            aria-label="Default select example"
            name="area"
            onChange={selectArea}
          >
            <option value="">{t("selectArea")}</option>
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
          <p>
            {areaName ? areaName + " এর - " : ""} {t("selectSubArea")}
          </p>
          <select
            className="form-select mw-100"
            aria-label="Default select example"
            name="subArea"
            id="subAreaId"
            onChange={subAreaEditHandler}
          >
            <option value="">{t("selectSubArea")}</option>
            {subArea &&
              subArea?.map((val, key) => (
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
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("save")}
          </button>
        </div>
      </form>
    </RootBulkModal>
  );
};

export default BulkSubAreaEdit;
