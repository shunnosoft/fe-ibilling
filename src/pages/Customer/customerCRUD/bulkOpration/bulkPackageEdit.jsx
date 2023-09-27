import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

//internal import
import Loader from "../../../../components/common/Loader";
import { bulkPackageEdit } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";

const BulkPackageEdit = ({ bulkCustomer, show, setShow, status }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get mikrotik
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get pppoe & static Package
  const packages = useSelector((state) =>
    bpSettings?.hasMikrotik && status !== "static"
      ? state?.package?.pppoePackages
      : state?.package?.packages
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // mikrotik pppoe & static package state
  const [PPPoEPackage, setPPPoEPackage] = useState([]);

  // select mikrotik id state
  const [singleMikrotik, setSingleMikrotik] = useState("");

  // select mikrotik package state
  const [mikrotikPackage, setMikrotikPackage] = useState("");

  // select mikrotik package filter
  const selectMikrotik = (e) => {
    const id = e.target.value;
    setSingleMikrotik(id);

    const mikrotikPackage = packages.filter((pack) => pack.mikrotik === id);
    setPPPoEPackage(mikrotikPackage);
  };

  // mikrotik Package handler
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    if (mikrotikPackageId === "0") {
      setMikrotikPackage("");
    } else {
      setMikrotikPackage(mikrotikPackageId);
    }
  };

  // change package submit hadler
  const changePackage = (e) => {
    e.preventDefault();
    let otherCusetomerCount = 0;
    let customers;
    if (singleMikrotik) {
      customers = bulkCustomer.reduce((acc, current) => {
        if (current.original.mikrotik === singleMikrotik) {
          acc.push(current);
        } else {
          otherCusetomerCount++;
          toast.error("মাইক্রটিক এর মধ্যে এই" + current.original.name + "নেই");
        }
        return acc;
      }, []);
    } else {
      alert(t("selectMikrotik"));
    }

    if (singleMikrotik && mikrotikPackage) {
      const data = {
        customerIds: customers.map((item) => item.original.id),
        mikrotikPackage,
      };
      const confirm = window.confirm(
        t("areYouWantToUpdateStatus") +
          customers.length +
          t("updateCustomerPackage") +
          "\n" +
          otherCusetomerCount +
          t("otherMtkUsers")
      );
      if (confirm) {
        bulkPackageEdit(dispatch, data, setIsLoading, setShow);
      }
    } else {
      alert(t("selectPackage"));
    }
  };

  return (
    <RootBulkModal show={show} setShow={setShow} header={t("updatePackage")}>
      <form onSubmit={changePackage}>
        <div className="mikrotikSection">
          {bpSettings?.hasMikrotik ? (
            <div>
              <label className="form-control-label changeLabelFontColor">
                {t("mikrotik")} <span className="text-danger">*</span>
              </label>
              <select
                className="form-select mw-100 mt-0"
                aria-label="Default select example"
                onChange={selectMikrotik}
              >
                <option value="">...</option>
                {Getmikrotik.length === undefined
                  ? ""
                  : Getmikrotik.map((val, key) => (
                      <option key={key} value={val.id}>
                        {val.name}
                      </option>
                    ))}
              </select>
            </div>
          ) : (
            ""
          )}

          {/* pppoe package */}
          <div>
            <label className="form-control-label changeLabelFontColor">
              {t("package")} <span className="text-danger">*</span>
            </label>
            <select
              className="form-select mb-3 mw-100 mt-0"
              aria-label="Default select example"
              onChange={selectMikrotikPackage}
            >
              <option value={"0"}>...</option>
              {PPPoEPackage?.map((val, key) => (
                <option key={key} value={val.id}>
                  {val.name}
                </option>
              ))}
            </select>
          </div>
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

export default BulkPackageEdit;
