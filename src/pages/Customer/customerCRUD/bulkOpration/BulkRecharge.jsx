import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { bulkRecharge } from "../../../../features/actions/bulkOperationApi";
import RootBulkModal from "./bulkModal";
import { useTranslation } from "react-i18next";
import { fetchPackagefromDatabase } from "../../../../features/apiCalls";
import { toast } from "react-toastify";

const BulkRecharge = ({ bulkCustomer, modalId }) => {
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

  // get pppoe Package
  const ppPackage = useSelector((state) =>
    bpSettings?.hasMikrotik
      ? state?.mikrotik?.packagefromDatabase
      : state?.package?.packages
  );

  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  const currentUserId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  const [isLoading, setIsLoading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");

  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [mikrotikPackageRate, setMikrotikPackageRate] = useState("");
  const [mikrotikId, setMikrotikId] = useState("");
  const [medium, setMedium] = useState("cash");

  // select Getmikrotik
  const selectMikrotik = (e) => {
    const id = e.target.value;
    if (id && ispOwnerId) {
      const IDs = {
        ispOwner: ispOwnerId,
        mikrotikId: id,
      };
      //ToDo
      if (bpSettings?.hasMikrotik) {
        fetchPackagefromDatabase(dispatch, IDs, setIsLoading);
      }
    }
    setSingleMikrotik(id);
    setMikrotikPackage("");
  };

  // select Mikrotik Package
  const selectMikrotikPackage = (e) => {
    const mikrotikPackageId = e.target.value;
    if (mikrotikPackageId === "0") {
      setMikrotikPackage("");
      setMikrotikPackageRate("");
    } else {
      setMikrotikPackage(mikrotikPackageId);
      const item = ppPackage.find((temp) => temp.id === mikrotikPackageId);
      setMikrotikPackageRate(item.rate);
      setMikrotikId(item.mikrotik);
    }
  };

  const changePackage = (e) => {
    e.preventDefault();
    const form = e.target;

    const rate = e.target.rate.value;

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

    const filteredCustomer = customers
      .map((item) => item.original)
      .filter((temp) => temp.mikrotikPackage === mikrotikPackage)
      .filter((temp) => temp.status !== "expired");

    if (singleMikrotik && mikrotikPackage) {
      const data = {
        customerIds: filteredCustomer.map((item) => item.id),
        mikrotik: mikrotikId,
        mikrotikPackage,
        amount: rate,
        billType: "bill",
        medium,
        name: userData.name,
        collectedBy: currentUser?.user.role,
        user: currentUser?.user.id,
        collectorId: currentUserId, //when collector is logged in
      };
      //   console.log(data);

      const confirm = window.confirm(
        t("areYouWantToUpdateStatus") +
          customers.length +
          t("updateCustomerPackage") +
          "\n" +
          otherCusetomerCount +
          t("otherMtkUsers")
      );
      if (confirm) {
        bulkRecharge(dispatch, data, setIsLoading);
        form.reset();
        setMikrotikPackageRate("");
      }
    } else {
      alert(t("selectPackage"));
    }
  };

  return (
    <RootBulkModal modalId={modalId} header={t("bulkRecharge")}>
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
              {ppPackage &&
                ppPackage?.map((val, key) => (
                  <option key={key} value={val.id}>
                    {val.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="form-control-label changeLabelFontColor">
              {t("price")} <span className="text-danger">*</span>
            </label>
            <input
              defaultValue={mikrotikPackageRate}
              type="text"
              class="form-control"
              name="rate"
            />
          </div>

          <div>
            <label className="form-control-label changeLabelFontColor">
              {t("medium")} <span className="text-danger">*</span>
            </label>
            <select
              as="select"
              id="receiver_type"
              className="form-select mt-0 mw-100"
              aria-label="Default select example"
              onChange={(e) => setMedium(e.target.value)}
            >
              <option value="cash" selected>
                {t("handCash")}
              </option>
              <option value="bKash"> {t("bKash")} </option>
              <option value="rocket"> {t("rocket")} </option>
              <option value="nagad"> {t("nagad")} </option>
              <option value="others"> {t("others")} </option>
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
            {isLoading ? <Loader /> : t("recharge")}
          </button>
        </div>
      </form>
    </RootBulkModal>
  );
};

export default BulkRecharge;
