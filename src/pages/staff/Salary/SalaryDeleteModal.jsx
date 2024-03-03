import React from "react";
import { useState } from "react";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { deleteSalary } from "../../../features/apiCallStaff";
import { useDispatch } from "react-redux";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const SalaryDeleteModal = ({ show, setShow, salaryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // delete salary handler
  const deleteSalaryHandler = () => {
    deleteSalary(dispatch, setIsLoading, salaryId, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="md"
        header={t("salaryDelete")}
      >
        <p>{t("salaryDeleteAlert")}</p>

        <div className="displayGrid1 float-end mt-4">
          <button
            onClick={deleteSalaryHandler}
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("submit")}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            disabled={isLoading}
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default SalaryDeleteModal;
