import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// internal import
import Loader from "../../../components/common/Loader";
import { updateFireWallIpDrop } from "../../../features/apiCalls";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const FireWallFilterIpUpdate = ({ show, setShow, updateIp }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // update fire wall ip state
  const [fireWallIp, setFireWallIp] = useState("");

  useEffect(() => {
    setFireWallIp(updateIp);
  }, [updateIp]);

  // fire wall id drop handler
  const fireWallIpDropHandler = (e) => {
    e.preventDefault();
    updateFireWallIpDrop(dispatch, setIsLoading, fireWallIp, setShow);
  };

  // change fire wall ip
  const changeFireWallIp = (e) => {
    setFireWallIp({ ...fireWallIp, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("fireWallIpUpdate")}
      >
        <form onSubmit={fireWallIpDropHandler}>
          <div>
            <label class="form-label mb-0 text-secondary">
              {t("inputFireWallIpFilterDrop")}
            </label>
            <input
              class="form-control"
              type="text"
              name="srcAddress"
              value={fireWallIp?.srcAddress}
              onChange={changeFireWallIp}
            />
          </div>

          <div className="displayGrid1 float-end mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isLoading}
              onClick={() => setShow(false)}
            >
              {t("cancel")}
            </button>

            <button
              className="btn btn-success"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("submit")}
            </button>
          </div>
        </form>
      </ComponentCustomModal>
    </>
  );
};

export default FireWallFilterIpUpdate;
