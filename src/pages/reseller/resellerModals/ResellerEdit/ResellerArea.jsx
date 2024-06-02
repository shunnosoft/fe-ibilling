import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { areasSubareasChecked } from "../../../staff/staffCustomFucn";

const ResellerArea = ({ reseller, useState }) => {
  const { t } = useTranslation();

  const { areaSubareas, setAreaSubareas } = useState;

  // get all area form redux store
  const area = useSelector((state) => state.area.area);

  // area subarea select handler for reseller
  const areaSubareaSelectHandler = ({ target }) => {
    const { name, checked, id } = target;

    let subAreas = [...areaSubareas];

    if (name === "area") {
      subAreas = subAreas.map((val) =>
        val.area === id ? { ...val, isChecked: checked } : val
      );
    } else {
      subAreas = subAreas.map((val) =>
        val.id === id ? { ...val, isChecked: checked } : val
      );
    }

    // set collector areas
    setAreaSubareas(subAreas);
  };

  return (
    <>
      <Card className="mt-3 bg-light">
        <Card.Body>
          <Card.Title className="inputLabelFontColor">
            {t("selectArea")}
          </Card.Title>
          <Card.Text>
            <div className="displayGrid4">
              {area?.map((val, key) => (
                <div key={key}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="area"
                      id={val.id}
                      onChange={areaSubareaSelectHandler}
                      checked={
                        areaSubareas &&
                        areasSubareasChecked(val.id, areaSubareas)
                      }
                    />

                    <label htmlFor={val.id} className="areaParent ms-1">
                      {val.name}
                    </label>
                  </div>

                  {areaSubareas?.map(
                    (subarea, k) =>
                      subarea.area === val.id && (
                        <div key={k} className="displayFlex">
                          <input
                            type="checkbox"
                            id={subarea.id}
                            onChange={areaSubareaSelectHandler}
                            checked={subarea.isChecked}
                          />

                          <label
                            htmlFor={subarea.id}
                            className="text-secondary"
                          >
                            {subarea.name}
                          </label>
                        </div>
                      )
                  )}
                </div>
              ))}
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};

export default ResellerArea;
