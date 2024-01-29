import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// inaternal import
import Loader from "../../../../components/common/Loader";
import { syncHotspotCustomer } from "../../../../features/hotspotApi";
import ComponentCustomModal from "../../../../components/common/customModal/ComponentCustomModal";

const HotspotCustomerSync = ({ show, setShow, ispOwnerId, mikrotikId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // hotspot Customer loading state
  const [hotspotCustomerLoading, setHotspotCustomerLoading] = useState(false);

  // inactive checkbox state
  const [inActiveCustomer, setInActiveCustomer] = useState(false);

  // sync hotspot customer handler
  const hotspotCustomerHandle = () => {
    syncHotspotCustomer(
      dispatch,
      ispOwnerId,
      mikrotikId,
      inActiveCustomer,
      setHotspotCustomerLoading,
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
        header={t("hotspotCustomerSync")}
      >
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            checked={inActiveCustomer}
            id="hotspotCustomerSync"
            onChange={(event) => setInActiveCustomer(event.target.checked)}
          />
          <label class="form-check-label" htmlFor="hotspotCustomerSync">
            <small className="text-secondary">
              {t("doYouWantToSyncWithInActiveCustomer")}
            </small>
          </label>
        </div>

        <div className="displayGrid1 float-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={hotspotCustomerLoading}
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>

          <button
            onClick={hotspotCustomerHandle}
            className="btn btn-success"
            disabled={hotspotCustomerLoading}
          >
            {hotspotCustomerLoading ? <Loader /> : t("sync")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default HotspotCustomerSync;
