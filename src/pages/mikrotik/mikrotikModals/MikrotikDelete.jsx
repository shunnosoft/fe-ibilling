import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

// internal import
import Loader from "../../../components/common/Loader";
import { deleteSingleMikrotik } from "../../../features/apiCalls";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const MikrotikDelete = ({ show, setShow, mikrotikID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get all mikrotik from redux
  const allmikrotiks = useSelector((state) => state.mikrotik.mikrotik);

  // find deleteble mikrotik
  const data = allmikrotiks.find((item) => item.id === mikrotikID);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // delete mikrotik handler
  const deleteMikrotik = () => {
    const IDs = {
      ispOwner,
      id: mikrotikID,
    };
    deleteSingleMikrotik(dispatch, IDs, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={data?.name + " " + t("deleteMikrotik")}
      >
        <p className="">{t("areYouSureWantToDeleteMikrotik")}</p>

        <div className="displayGrid1 float-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="btn btn-success"
            onClick={deleteMikrotik}
          >
            {isLoading ? <Loader /> : t("delete")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default MikrotikDelete;
