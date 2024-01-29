import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// internal import
import { fireWallIpFilterDrop } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const FireWallFIlterDrop = ({ show, setShow, ispOwner, mikrotikId }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // customer block ip state
  const [dropIp, setDropIp] = useState();

  // fire wall id drop handler
  const fireWallIpDropHandler = (e) => {
    e.preventDefault();

    fireWallIpFilterDrop(
      dispatch,
      setIsLoading,
      ispOwner,
      mikrotikId,
      dropIp,
      setShow
    );
  };
  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("fireWallIpFilterDrop")}
      >
        <form onSubmit={fireWallIpDropHandler}>
          <div>
            <label class="form-label mb-0 text-secondary">
              {t("inputFireWallIpFilterDrop")}
            </label>
            <input
              class="form-control"
              type="text"
              id="singleIpDrop"
              onChange={(e) => setDropIp(e.target.value)}
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

            <button className="btn btn-success" disabled={isLoading}>
              {isLoading ? <Loader /> : t("submit")}
            </button>
          </div>
        </form>
      </ComponentCustomModal>
    </>
  );
};

export default FireWallFIlterDrop;
