import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Loader from "../../../components/common/Loader";
import { bulkCustomerReturnApi } from "../../../features/actions/bulkOperationApi";
import RootBulkModal from "../../Customer/customerCRUD/bulkOpration/bulkModal";

const BulkCustomerReturn = ({ show, setShow, bulkCustomer, isAllCustomer }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const returnCustotomer = () => {
    const confirm = window.confirm("Are you confirm?");
    if (!confirm) return;

    const data = {
      customerIds: bulkCustomer.map((item) => {
        return item.original.id;
      }),
    };
    bulkCustomerReturnApi(dispatch, data, isAllCustomer, setIsLoading, setShow);
  };

  return (
    <RootBulkModal show={show} setShow={setShow}>
      <p>{t("returnCustomerConfirmation")}</p>

      <div className="modal-footer" style={{ border: "none" }}>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={isLoading}
          onClick={() => setShow(false)}
        >
          {t("cancel")}
        </button>
        <button
          onClick={returnCustotomer}
          type="submit"
          className="btn btn-success"
          disabled={isLoading}
        >
          {isLoading ? <Loader /> : t("confirm")}
        </button>
      </div>
    </RootBulkModal>
  );
};

export default BulkCustomerReturn;
