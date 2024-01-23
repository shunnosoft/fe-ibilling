import React from "react";
import { ArchiveFill, PenFill, ThreeDots } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ActionButton({
  getSpecificArea,
  deleteSingleArea,
  data,
  setShow,
  setModalStatus,
}) {
  const { t } = useTranslation();

  const allMikrotiks = useSelector((state) => state.mikrotik.mikrotik);

  const mikrotikConditionHandle = () => {
    if (allMikrotiks.find((val) => val.name == data?.name)) {
      return toast.warn(t("doNotAreaDeleteAndUpdate"));
    }
  };

  return (
    <>
      <div className="dropdown">
        <ThreeDots
          className="dropdown-toggle ActionDots"
          onClick={mikrotikConditionHandle}
          id="areaDropdown"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        />
        <>
          <ul className="dropdown-menu" aria-labelledby="areaDropdown">
            {!allMikrotiks.find((val) => val.name == data?.name) && (
              <>
                <li
                  onClick={() => {
                    getSpecificArea(data.id);
                    setModalStatus("areaEdit");
                    setShow(true);
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
              </>
            )}
          </ul>
        </>
      </div>
    </>
  );
}
