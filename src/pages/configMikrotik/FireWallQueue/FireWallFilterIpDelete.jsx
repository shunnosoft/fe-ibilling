import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// internal import
import Loader from "../../../components/common/Loader";
import { deleteFireWallIpDrop } from "../../../features/apiCalls";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const FireWallFilterIpDelete = ({
  show,
  setShow,
  deleteIp,
  mikrotikCheck,
  setMikrotikCheck,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user bp setting
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // fire Wall filter ip Drop delete Handler
  const fireWallIpDropDelete = (id) => {
    let checkCondition = true;

    if (mikrotikCheck) {
      checkCondition = window.confirm(t("deleteMikrotik"));
    }

    const data = {
      ispOwner: ispOwnerId,
      id: id,
      mikrotik: mikrotikCheck,
    };

    if (checkCondition) {
      deleteFireWallIpDrop(dispatch, setIsLoading, data, setShow);
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("fireWallIpDelete")}
      >
        <h5>
          {deleteIp?.srcAddress} {t("srcAddressDelete")}
        </h5>

        {bpSettings?.hasMikrotik && (
          <div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                checked={mikrotikCheck}
                id="mikrotikCheck"
                onChange={(event) => setMikrotikCheck(event.target.checked)}
              />
              <label
                class="form-check-label text-secondary"
                for="mikrotikCheck"
              >
                {t("deleteMikrotik")}
              </label>
            </div>
          </div>
        )}

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
            onClick={() => {
              fireWallIpDropDelete(deleteIp?.id);
            }}
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("delete")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default FireWallFilterIpDelete;
