import React from "react";
import { ArchiveFill, GeoAlt, PenFill, ThreeDots } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

export default function ActionButton({
  getAreaSubarea,
  getSpecificArea,
  deleteSingleArea,
  data,
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="dropdown">
        <ThreeDots
          className="dropdown-toggle ActionDots"
          id="areaDropdown"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        />
        <ul className="dropdown-menu" aria-labelledby="areaDropdown">
          {/* <li
            data-bs-toggle="modal"
            data-bs-target="#subareaModal"
            onClick={() => getAreaSubarea(data.id)}
          >
            <div className="dropdown-item">
              <div className="customerAction">
                <GeoAlt />
                <p className="actionP"> {t("subArea")}</p>
              </div>
            </div>
          </li> */}

          <li
            data-bs-toggle="modal"
            data-bs-target="#areaEditModal"
            onClick={() => {
              getSpecificArea(data.id);
            }}
          >
            <div className="dropdown-item">
              <div className="customerAction">
                <PenFill />
                <p className="actionP"> {t("edit")}</p>
              </div>
            </div>
          </li>

          <li
            onClick={() => {
              deleteSingleArea(data.id, data.ispOwner);
            }}
          >
            <div className="dropdown-item actionManager">
              <div className="customerAction">
                <ArchiveFill />
                <p className="actionP"> {t("delete")} </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
