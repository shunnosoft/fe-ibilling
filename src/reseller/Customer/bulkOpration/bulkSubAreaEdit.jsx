import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/common/Loader";
import { bulksubAreaEdit } from "../../../features/actions/bulkOperationApi";

const BulkSubAreaEdit = ({ bulkCustomer, show, setShow }) => {
  const { t } = useTranslation();
  const areas = useSelector((state) => state?.area?.area);
  const [isLoading, setIsLoading] = useState(false);
  const [subArea, setSubArea] = useState("");
  const dispatch = useDispatch();
  //state for selected value
  const [selectedValue, setSelectedValue] = useState({
    area: "",
  });

  const [error, setError] = useState({
    area: "",
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
        area: t("selectArea"),
      });
    }

    if (selectedValue.area) {
      const data = {
        customerIds: bulkCustomer.map((item) => item.original.id),
        subAreaId: selectedValue.area,
      };

      const confirm = window.confirm(
        t("areYouWantToUpdate") +
          bulkCustomer.length +
          t("updateCustomerSubArea")
      );
      if (confirm) {
        bulksubAreaEdit(dispatch, data, setIsLoading, setShow);
      }
    }
  };
  // const subAreaEditHandler = (e) => {
  //   setSelectedValue({
  //     ...selectedValue,
  //     subArea: e.target.value,
  //   });
  //   if (e.target.value) {
  //     setError({
  //       ...error,
  //       subArea: "",
  //     });
  //   }
  // };

  return (
    <RootBulkModal show={show} setShow={setShow} header={t("updateArea")}>
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

        {/* <div>
          <p>
            {subArea ? subArea.name + " এর - " : ""} {t("selectSubArea")}
          </p>
          <select
            className="form-select mw-100"
            aria-label="Default select example"
            name="subArea"
            id="subAreaId"
            onChange={subAreaEditHandler}
          >
            <option value="">{t("selectSubArea")}</option>
            {subArea?.subAreas &&
              subArea.subAreas.map((val, key) => (
                <option key={key} value={val.id}>
                  {val.name}
                </option>
              ))}
          </select>
          {error.subArea && <p className="text-danger">{error.subArea}</p>}
        </div> */}

        <div className="modal-footer" style={{ border: "none" }}>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
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
