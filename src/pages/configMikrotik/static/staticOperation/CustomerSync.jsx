import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// internal import
import Loader from "../../../../components/common/Loader";
import { syncMikrotikStaticUser } from "../../../../features/apiCalls";
import ComponentCustomModal from "../../../../components/common/customModal/ComponentCustomModal";

const CustomerSync = ({ show, setShow, mikrotikId, ispOwner }) => {
  const { t } = useTranslation();

  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // inactive customer check
  const [inActiveCustomer, setInActiveCustomer] = useState(false);

  // Sync Customer
  const syncCostomer = () => {
    // send data for api
    const data = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
      inActiveCustomer: inActiveCustomer,
    };

    syncMikrotikStaticUser(
      dispatch,
      data,
      setIsloading,
      setInActiveCustomer,
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
        header={t("staticCustomerSync")}
      >
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            checked={inActiveCustomer}
            id="staticCustomerSync"
            onChange={(event) => setInActiveCustomer(event.target.checked)}
          />

          <label class="form-check-label" htmlFor="staticCustomerSync">
            <small className="text-secondary">
              {t("doYouWantToSyncWithInActiveCustomer")}
            </small>
          </label>
        </div>

        <div className="displayGrid1 float-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            disabled={isLoading}
          >
            {t("cancel")}
          </button>

          <button
            onClick={syncCostomer}
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("sync")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default CustomerSync;
