import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { deleteHotspotCustomer } from "../../../features/hotspotApi";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const DeleteCustomer = ({
  show,
  setShow,
  customerId,
  mikrotikCheck,
  setMikrotikCheck,
}) => {
  const { t } = useTranslation();
  // get all customer
  const customers = useSelector((state) => state?.hotspot?.customer);

  // find deletable customer
  const singleData = customers.find((item) => item.id === customerId);

  // import dispatch
  const dispatch = useDispatch();

  // loading state
  const [deleteLoading, setDeleteLoading] = useState(false);

  // DELETE handler
  const deleteCustomer = (customerId) => {
    let checkCondition = true;

    if (mikrotikCheck) {
      checkCondition = window.confirm(t("deleteMikrotik"));
    }

    // sentding data
    const data = {
      customerID: customerId,
      mikrotik: mikrotikCheck,
    };

    // api call
    if (checkCondition) {
      deleteHotspotCustomer(dispatch, data, setDeleteLoading, setShow);
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
        <div class="form-check mt-4">
          <input
            class="form-check-input"
            type="checkbox"
            checked={mikrotikCheck}
            id="flexCheckDefault"
            onChange={(event) => setMikrotikCheck(event.target.checked)}
          />
          <label class="form-check-label" htmlFor="flexCheckDefault">
            <small className="text-secondary">{t("deleteMikrotik")}</small>
          </label>
        </div>

        <div className="modal-footer" style={{ border: "none" }}>
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            disabled={deleteLoading}
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => {
              deleteCustomer(customerId);
            }}
            className="btn btn-success"
            disabled={deleteLoading}
          >
            {deleteLoading ? <Loader /> : t("delete")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default DeleteCustomer;
