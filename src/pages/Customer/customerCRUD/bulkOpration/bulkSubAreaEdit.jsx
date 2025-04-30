import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { bulksubAreaEdit } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";

const BulkSubAreaEdit = ({ bulkCustomer, show, setShow }) => {
  const { t } = useTranslation();

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  const areas = useSelector((state) => state?.area?.area);
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //get all pole Box
  const poleBox = useSelector((state) => state.area?.poleBox);

  const [isLoading, setIsLoading] = useState(false);
  const [subArea, setSubArea] = useState("");
  const [areaName, setAreaName] = useState("");
  const dispatch = useDispatch();

  // subarea state
  const [subAreaName, setSubAreaName] = useState("");

  // poleBox state
  const [subPoleBox, setSubPoleBox] = useState([]);

  //state for selected value
  const [selectedValue, setSelectedValue] = useState({
    area: "",
    subArea: "",
    poleBox: "",
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
        areaId: selectedValue.area,
        subAreaId: selectedValue.subArea,
        poleBox: selectedValue.poleBox,
      };

      if (!bpSettings?.poleBox) {
        delete data.poleBox;
      }
      const confirm = window.confirm(
        t("areYouWantToUpdate") +
          bulkCustomer.length +
          t("updateCustomerSubArea")
      );
      if (confirm) {
        bulksubAreaEdit(dispatch, data, setIsLoading, setShow);
      }
      setSelectedValue({
        area: "",
        subArea: "",
        poleBox: "",
      });
      setAreaName("");
      form.reset();
    }
  };

  // subArea update handler
  const subAreaEditHandler = (e) => {
    const subareaPoleBox = poleBox.filter((val) => {
      return val.subArea === e.target.value;
    });
    setSubPoleBox(subareaPoleBox);

    const subAreaFind = storeSubArea.find((val) => {
      return val.id === e.target.value;
    });
    setSubAreaName(subAreaFind.name);

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

  // subArea poleBox update handler
  const subAreaPoleBoxHandler = (e) => {
    setSelectedValue({
      ...selectedValue,
      poleBox: e.target.value,
    });
  };

  return (
    <RootBulkModal show={show} setShow={setShow} header={t("updateArea")}>
      <form onSubmit={submitHandler}>
        <div>
          <p>{t("selectArea")}</p>
          <select
            className="form-select mt-0 mw-100"
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

        <div className="mt-2">
          <p>
            {areaName ? areaName + " এর - " : ""} {t("selectSubArea")}
          </p>
          <select
            className="form-select mt-0 mw-100"
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

        {bpSettings?.poleBox && (
          <div className="mt-2">
            <p>
              {subAreaName ? subAreaName + " এর - " : ""} {t("selectPoleBox")}
            </p>
            <select
              className="form-select mt-0 mw-100"
              aria-label="Default select example"
              name="subArea"
              id="subAreaId"
              onChange={subAreaPoleBoxHandler}
            >
              <option value="">{t("selectPoleBox")}</option>
              {subPoleBox &&
                subPoleBox?.map((val, key) => (
                  <option key={key} value={val.id}>
                    {val.name}
                  </option>
                ))}
            </select>
            {error.poleBox && <p className="text-danger">{error.poleBox}</p>}
          </div>
        )}

        <div className="modal-footer" style={{ border: "none" }}>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isLoading}
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("submit")}
          </button>
        </div>
      </form>
    </RootBulkModal>
  );
};

export default BulkSubAreaEdit;
