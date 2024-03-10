import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// internal imports
import Loader from "../../../components/common/Loader";
import { deleteStaffApi } from "../../../features/apiCallStaff";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const StaffDelete = ({ show, setShow, staffId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // delete salary handler
  const deleteStaffHandler = () => {
    deleteStaffApi(dispatch, staffId, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="md"
        header={t("staffDelete")}
        footer={
          <div className="displayGrid1 float-end">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              {t("cancel")}
            </button>

            <button
              onClick={deleteStaffHandler}
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("delete")}
            </button>
          </div>
        }
      >
        <div>{t("staffDeleteAlert")}</div>
      </ComponentCustomModal>
    </>
  );
};

export default StaffDelete;
