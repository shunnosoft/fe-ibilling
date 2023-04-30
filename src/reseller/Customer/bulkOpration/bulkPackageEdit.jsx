import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { fetchPackagefromDatabase } from "../../../features/apiCalls";
import { bulkPackageEdit } from "../../../features/actions/bulkOperationApi";
import Loader from "../../../components/common/Loader";
import apiLink from "../../../api/apiLink";

const BulkPackageEdit = ({ bulkCustomer, modalId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get mikrotik
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  //get permissions
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permission
  );

  // find profile package
  //   const findPackage = ppPackage.find((item) => item.id === dataPackageRate);

  const [ppPackage, setppPackage] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [singleMikrotik, setSingleMikrotik] = useState("");

  const [mikrotikPackage, setMikrotikPackage] = useState("");

  // select Getmikrotik
  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && ispOwnerId) {
      const IDs = {
        ispOwner: ispOwnerId,
        mikrotikId: id,
      };

      const fetchPac = async () => {
        try {
          const res = await apiLink.get(
            `/mikrotik/ppp/package/${IDs.mikrotikId}`
          );
          setppPackage(res.data);
        } catch (error) {
          console.log(error);
        }
      };
      fetchPac();
    }
    setSingleMikrotik(id);
    setMikrotikPackage("");
  };

  const changePackage = (e) => {
    e.preventDefault();

    bulkCustomer.map((temp) => temp.original.monthlyFee);

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
    console.log(customers);

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
        bulkPackageEdit(dispatch, data, setIsLoading);
      }
    } else {
      alert(t("selectPackage"));
    }
  };

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    if (mikrotikPackageId === "0") {
      setMikrotikPackage("");
    } else {
      setMikrotikPackage(mikrotikPackageId);
    }
  };

  return (
    <RootBulkModal modalId={modalId} header={t("updatePackage")}>
      <form onSubmit={changePackage}>
        <div className="mikrotikSection">
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

          {/* pppoe package */}
          <div>
            <label className="form-control-label changeLabelFontColor">
              {t("selectPackage")} <span className="text-danger">*</span>
            </label>
            <select
              className="form-select mb-3 mw-100 mt-0"
              aria-label="Default select example"
              onChange={selectMikrotikPackage}
              disabled={!permission?.customerMikrotikPackageEdit}
            >
              <option value={"0"}>...</option>
              {ppPackage &&
                ppPackage?.map((val, key) => (
                  <option
                    // selected={val.id === packageRate?.id}
                    disabled={val.rate < bulkCustomer[0]?.original.monthlyFee}
                    key={key}
                    value={val.id || ""}
                  >
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
            data-bs-dismiss="modal"
            disabled={isLoading}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("save")}
          </button>
        </div>
      </form>
    </RootBulkModal>
  );
};

export default BulkPackageEdit;
