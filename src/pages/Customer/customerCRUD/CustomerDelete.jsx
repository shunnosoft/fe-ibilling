import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// internal import
import Loader from "../../../components/common/Loader";
import { deleteACustomer } from "../../../features/apiCalls";
import { deleteResellerCustomer } from "../../../features/apiCallReseller";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import useISPowner from "../../../hooks/useISPOwner";

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

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

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
      customerID: customerId,
      mikrotik: mikrotikCheck,
      userType: singleData.userType,
    };

    // api call
    if (checkCondition) {
      if (page !== "reseller") {
        data.ispID = ispOwnerId; // set owner id for delete

        // isp owner customer delete api
        deleteACustomer(dispatch, data, setIsLoading, null, setShow);
      } else {
        data.reseller = singleData.reseller; // set reseller id for delete

        // reseller customer delete api
        deleteResellerCustomer(dispatch, data, setIsLoading, setShow);
      }
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
