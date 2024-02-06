import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// internal import
import Loader from "../../../components/common/Loader";
import { deleteACustomer } from "../../../features/resellerCustomerAdminApi";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const CustomerDelete = ({
  show,
  setShow,
  customerId,
  mikrotikCheck,
  setMikrotikCheck,
}) => {
  const { t } = useTranslation();

  // get all data from redux state
  let resellerCustomer = useSelector(
    (state) => state?.resellerCustomer?.resellerCustomer
  );
  // find deletable customer
  const singleData = resellerCustomer.find((item) => item.id === customerId);

  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // DELETE handler
  const deleteCustomer = (customerId) => {
    let checkCondition = true;

    if (mikrotikCheck) {
      checkCondition = window.confirm(t("deleteMikrotik"));
    }

    // send data for api
    const data = {
      ispID: ispOwnerId,
      customerID: customerId,
      mikrotik: mikrotikCheck,
    };

    // api call
    if (checkCondition) {
      deleteACustomer(dispatch, data, setIsloading);
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={singleData?.name + " " + t("deleteCustomer")}
      >
        <div className="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            checked={mikrotikCheck}
            id="resellerCustomerDelete"
            onChange={(event) => setMikrotikCheck(event.target.checked)}
          />

          <label class="form-check-label" for="resellerCustomerDelete">
            <small className="text-secondary">{t("deleteMikrotik")}</small>
          </label>
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
            onClick={() => {
              deleteCustomer(customerId);
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

export default CustomerDelete;
