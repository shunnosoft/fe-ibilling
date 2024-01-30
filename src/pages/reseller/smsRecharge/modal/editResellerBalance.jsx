import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// internal import
import Loader from "../../../../components/common/Loader";
import { updateResellerBalance } from "../../../../features/apiCalls";
import ComponentCustomModal from "../../../../components/common/customModal/ComponentCustomModal";

const EditResellerBalance = ({ show, setShow, resellerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get all reseller data from redux store
  const allReseller = useSelector((state) => state?.reseller?.reseller);

  // singe reseller find
  const reseller = allReseller.find((val) => {
    return val.id === resellerId;
  });

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [resellerBalanceState, setResellerBalance] = useState(0);

  // set reseller balance
  useEffect(() => {
    setResellerBalance(reseller?.rechargeBalance);
  }, [resellerId]);

  // update balance handler
  const updateBalanceController = () => {
    const { rechargeBalance, ...resellerData } = reseller;

    const data = {
      ispId: reseller.ispOwner,
      resellerId: reseller.id,
      rechargeBalance: resellerBalanceState,
      ...resellerData,
    };
    updateResellerBalance(dispatch, data, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("editBalance")}
      >
        <input
          className="form-control w-100"
          type="number"
          value={Math.floor(resellerBalanceState)}
          onChange={(e) => setResellerBalance(e.target.value)}
          min={0}
          placeholder={t("enterAmount")}
        />

        <div className="displayGrid1 float-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>
          <button
            onClick={updateBalanceController}
            type="button"
            className="btn btn-success"
          >
            {isLoading ? <Loader></Loader> : t("update")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default EditResellerBalance;
