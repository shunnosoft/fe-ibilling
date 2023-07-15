import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { bulkCustomerRecharge } from "../../../../features/actions/bulkOperationApi";
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

  // get login user info
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // get login current user roles and others
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  // get current user Id
  const currentUserId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  const [isLoading, setIsLoading] = useState(false);
  const [singleMikrotik, setSingleMikrotik] = useState("");
  const [mikrotikPackage, setMikrotikPackage] = useState("");
  const [mikrotikPackageRate, setMikrotikPackageRate] = useState("");
  const [mikrotikId, setMikrotikId] = useState("");
  const [medium, setMedium] = useState("cash");

  useEffect(() => {
    let mik = true;
    let pac = true;

    for (let i = 0; i < bulkCustomer?.length - 1; i++) {
      if (
        bulkCustomer[i]?.original?.mikrotik !==
        bulkCustomer[i + 1]?.original?.mikrotik
      )
        mik = false;

      if (
        bulkCustomer[i]?.original?.mikrotikPackage !==
        bulkCustomer[i + 1]?.original?.mikrotikPackage
      )
        pac = false;
    }

    if (mik) {
      const IDs = {
        ispOwner: ispOwnerId,
        mikrotikId: bulkCustomer[0]?.original.mikrotik,
      };
      fetchPackagefromDatabase(dispatch, IDs, setIsLoading);
      setSingleMikrotik(bulkCustomer[0]?.original.mikrotik);
    }

    if (pac) {
      setMikrotikPackage(bulkCustomer[0]?.original.mikrotikPackage);
      setMikrotikPackageRate(bulkCustomer[0]?.original.monthlyFee);
    }
  }, [bulkCustomer, ispOwnerId]);

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

  //Form submit Handler
  const changePackage = (e) => {
    e.preventDefault();
    const form = e.target;

    const rate = e.target.rate.value;

    let otherMikrotikCount = 0;
    let otherPackageCount = 0;
    let customers;
    let filteredCus;

    //filtering all bulk customer by mikrotik
    if (singleMikrotik) {
      customers = bulkCustomer.reduce((acc, current) => {
        if (current.original.mikrotik === singleMikrotik) {
          acc.push(current);
        } else {
          otherMikrotikCount++;
          toast.error(
            "মাইক্রটিক এর মধ্যে এই " + current.original.name + " নেই"
          );
        }
        return acc;
      }, []);
    } else {
      alert(t("selectMikrotik"));
    }

    //filtering previous filtered customer by package and status
    if (mikrotikPackage) {
      filteredCus = customers.reduce((acc, current) => {
        if (
          current.original.mikrotikPackage === mikrotikPackage &&
          current.original.status !== "expired"
        ) {
          acc.push(current);
        } else {
          otherPackageCount++;
          toast.error("প্যাকেজ এর মধ্যে এই " + current.original.name + " নেই");
        }
        return acc;
      }, []);
    } else {
      alert(t("selectPackage"));
    }

    if (singleMikrotik && mikrotikPackage) {
      const data = {
        customerIds: filteredCus.map((item) => item.original.id),
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

      //final customer number for bulk recharge
      const changeCustomer = customers.length - otherPackageCount;

      const confirm = window.confirm(
        t("areYouWantToUpdateStatus") +
          " " +
          changeCustomer +
          " " +
          t("updateCustomerPackage") +
          "\n" +
          otherMikrotikCount +
          " " +
          t("otherMtkUsers") +
          "\n" +
          otherPackageCount +
          " " +
          t("otherPackageUsers")
      );
      if (confirm) {
        bulkCustomerRecharge(dispatch, data, setIsLoading);
        form.reset(); //form reset
        setMikrotikPackageRate("");
      }
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
                      <option
                        key={key}
                        selected={singleMikrotik === val.id}
                        value={val.id}
                      >
                        {val?.name}
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
                  <option
                    key={key}
                    selected={mikrotikPackage === val.id}
                    value={val.id}
                  >
                    {val.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Mikrotik Package price */}
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

          {/* Medium Of Payment*/}
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
