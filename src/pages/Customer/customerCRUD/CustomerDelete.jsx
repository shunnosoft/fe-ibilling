import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// internal import
import Loader from "../../../components/common/Loader";
import { deleteACustomer } from "../../../features/apiCalls";
import { deleteResellerCustomer } from "../../../features/apiCallReseller";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const CustomerDelete = ({
  show,
  setShow,
  single,
  mikrotikCheck,
  setMikrotikCheck,
  status,
  page,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get ispOwner bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get all customer
  const customers = useSelector((state) =>
    status === "pppoe"
      ? state?.customer?.customer
      : state?.customer?.staticCustomer
  );

  // find deletable customer
  const singleData = customers.find((item) => item.id === single);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

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
      userType: singleData.userType,
    };

    const resellerCusData = {
      reseller: singleData.reseller,
      customerID: customerId,
      mikrotik: mikrotikCheck,
    };

    // api call
    if (checkCondition && page !== "reseller") {
      deleteACustomer(dispatch, data, setIsLoading, null, setShow);
    } else {
      deleteResellerCustomer(dispatch, resellerCusData, setIsLoading);
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={singleData?.name + " " + t("customerDelete")}
      >
        {bpSettings?.hasMikrotik && (
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              checked={mikrotikCheck}
              id="customerDelete"
              onChange={(event) => setMikrotikCheck(event.target.checked)}
            />

            <label class="form-check-label" htmlFor="customerDelete">
              <small className="text-secondary">{t("deleteMikrotik")}</small>
            </label>
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
              deleteCustomer(single);
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
