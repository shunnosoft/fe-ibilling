import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { bulkMikrotikUpdate } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";

const BulkMikrotikEdit = ({ bulkCustomer, show, setShow }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get mikrotik
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // mikrotik id state
  const [mikrotikId, setMikrotikId] = useState("");

  const changeMikrotik = (e) => {
    e.preventDefault();

    if (mikrotikId) {
      const data = {
        customerIds: bulkCustomer.map((item) => item.original.id),
        mikrotikId: mikrotikId,
      };
      const confirm = window.confirm(
        t("areYouWantToUpdateStatus") +
          bulkCustomer.length +
          t("updateStatusSubArea")
      );
      if (confirm) {
        bulkMikrotikUpdate(dispatch, data, setIsLoading, setShow);
        setMikrotikId("");
      }
    } else {
      alert(t("selectMikrotik"));
    }
  };

  return (
    <RootBulkModal show={show} setShow={setShow} header={t("changeMikrotik")}>
      <form onSubmit={changeMikrotik}>
        <div className="mikrotikSection">
          {bpSettings?.hasMikrotik && (
            <div>
              <label className="form-control-label changeLabelFontColor">
                {t("mikrotik")} <span className="text-danger">*</span>
              </label>
              <select
                className="form-select mw-100 mt-0"
                aria-label="Default select example"
                onChange={(event) => setMikrotikId(event.target.value)}
              >
                <option value="">...</option>
                {mikrotiks.length &&
                  mikrotiks.map((val, key) => (
                    <option key={key} value={val.id}>
                      {val.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

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
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("submit")}
          </button>
        </div>
      </form>
    </RootBulkModal>
  );
};

export default BulkMikrotikEdit;
