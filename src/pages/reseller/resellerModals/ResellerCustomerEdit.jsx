import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

// internal import
import Loader from "../../../components/common/Loader";
import {
  fetchMikrotik,
  fetchPackagefromDatabase,
} from "../../../features/apiCalls";
import { editResellerCustomer } from "../../../features/resellerCustomerAdminApi";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const ResellerCustomerEdit = ({ show, setShow, customerId, allCustomer }) => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // initial loading state
  const [isLoading, setIsLoading] = useState(false);

  // initial package state
  const [packageId, setPackageId] = useState();

  // initial package rate
  const [packageRate, setPackageRate] = useState();

  // initial fix package rate
  const [fixPackageRate, setFixPackageRate] = useState();

  // package loading
  const [packageLoading, setPackageLoading] = useState(false);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get reseller customer
  const resellerCustomers = useSelector(
    (state) => state?.resellerCustomer?.resellerCustomer
  );

  // get all reseller customer
  const resellerAllCustomer = useSelector(
    (state) => state?.resellerCustomer?.allResellerCustomer
  );

  // get PPPoE package from state
  const ppPackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  // find single package
  const packages = ppPackage.find((item) => item.id === packageId);

  // find profile package
  const findPackage = ppPackage.find((item) => item.id === packageRate);

  // get all data from redux state
  let resellerCustomer;
  if (allCustomer) {
    resellerCustomer = resellerAllCustomer;
  }
  if (!allCustomer) {
    resellerCustomer = resellerCustomers;
  }

  // get single customer
  const data = resellerCustomer.find((item) => item.id === customerId);

  const [status, setStatus] = useState("");
  const [autoDisable, setAutoDisable] = useState("");
  const [billDate, setBillDate] = useState(new Date());
  const [monthlyFee, setMonthlyFee] = useState("");
  const [promiseDate, setPromiseDate] = useState(new Date());
  const monthlyFeeRef = useRef();

  useEffect(() => {
    setMonthlyFee(packages?.rate);
  }, [packageId]);

  useEffect(() => {
    setStatus(data?.status);
    setAutoDisable(data?.autoDisable);
    data?.billingCycle && setBillDate(moment(data.billingCycle).toDate());
    data?.promiseDate && setPromiseDate(moment(data.promiseDate).toDate());
    setMonthlyFee(data?.monthlyFee);
  }, [data]);

  // get mikrotik
  const getMikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get single mikrotik
  const singleMikrotik = getMikrotik.find((item) => item.id === data?.mikrotik);

  useEffect(() => {
    // set package id in package state
    setPackageId(data?.mikrotikPackage);

    setPackageRate(data?.mikrotikPackage);

    if (singleMikrotik) {
      const IDs = {
        ispOwner: ispOwnerId,
        mikrotikId: singleMikrotik?.id,
      };

      // get package api call
      fetchPackagefromDatabase(
        dispatch,
        IDs,
        setPackageLoading,
        singleMikrotik?.name
      );
    }
  }, [singleMikrotik?.id]);

  // set package rate in state
  useEffect(() => {
    setFixPackageRate(findPackage?.rate);
    fetchMikrotik(dispatch, ispOwnerId, setIsLoading);
  }, [findPackage?.rate]);

  // handle submit
  const handleSubmit = () => {
    const sendingData = {
      mikrotik: singleMikrotik?.id,
      mikrotikPackage: packageId,
      monthlyFee: monthlyFee,
      autoDisable: autoDisable,
      billingCycle: billDate.toISOString(),
      promiseDate: promiseDate.toISOString(),
      status,
      pppoe: {
        name: data?.pppoe?.name,
        password: data?.pppoe?.password,
        service: data?.pppoe?.service,
        comment: data?.pppoe?.comment,
        profile: packages?.name,
        disabled: data?.pppoe?.disabled,
      },
    };
    if (parseInt(monthlyFee) > packages?.rate) {
      alert(t("canNotIncreaseResellerMonthlyFee"));
      return monthlyFeeRef.current.focus();
    }
    let resellerId;
    if (allCustomer) {
      resellerId = data.reseller.id;
    } else {
      resellerId = data.reseller;
    }
    editResellerCustomer(
      dispatch,
      sendingData,
      resellerId,
      customerId,
      setIsLoading,
      allCustomer
    );
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={data?.name + " " + t("edit")}
      >
        <div className="displayGrid">
          <div>
            <label class="form-label mb-0"> {t("selectMikrotik")} </label>

            <select
              className="form-select mt-0 mw-100"
              aria-label="Default select example"
              disabled
              value={data?.mikrotik || ""}
            >
              <option value={singleMikrotik?.id || ""}>
                {singleMikrotik?.name || ""}
              </option>
            </select>
          </div>

          <div>
            <label class="form-label mb-0"> {t("selectPackage")} </label>

            <select
              className="form-select mt-0 mw-100"
              aria-label="Default select example"
              onChange={(event) => setPackageId(event.target.value)}
            >
              {ppPackage &&
                ppPackage?.map((item, key) => (
                  <option
                    selected={item.id === data?.mikrotikPackage}
                    key={key}
                    disabled={item.rate > findPackage?.rate}
                    value={item.id || ""}
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label class="form-label mb-0"> {t("monthFee")} </label>

            <input
              type="text"
              class="form-control"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              ref={monthlyFeeRef}
            />
          </div>

          <div>
            <label className="form-control-label">{t("billingCycle")}</label>
            <ReactDatePicker
              className="form-control"
              selected={billDate}
              onChange={(date) => setBillDate(date)}
              dateFormat="MMM dd yyyy h:mm"
              showTimeSelect
              minDate={billDate}
            />
          </div>

          <div>
            <label className="form-control-label">{t("promiseDate")}</label>
            <ReactDatePicker
              className="form-control"
              selected={promiseDate}
              onChange={(date) => setPromiseDate(date)}
              dateFormat="MMM dd yyyy h:mm"
              showTimeSelect
              minDate={promiseDate}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div className="pppoeStatus d-flex">
              <div className="form-check  ">
                <input
                  className="form-check-input"
                  type="radio"
                  name="staus"
                  value={"active"}
                  onChange={(e) => setStatus(e.target.value)}
                  checked={status === "active"}
                  id="activeStatus"
                />
                <label className="form-check-label" htmlFor="activeStatus">
                  {t("active")}
                </label>
              </div>

              <div className="form-check ">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inlineRadio2"
                  value={"inactive"}
                  onChange={(e) => setStatus(e.target.value)}
                  checked={status === "inactive"}
                  disabled
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                  {t("in active")}
                </label>
              </div>

              {data?.status === "expired" && (
                <div className="form-check ">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="expired"
                    disabled
                    checked={status === "expired"}
                  />
                  <label className="form-check-label" htmlFor="expired">
                    {t("expired")}
                  </label>
                </div>
              )}
            </div>

            <div className="autoDisable">
              <label htmlFor="auto_disabled">{t("autoConnectionOff")}</label>
              <input
                id="auto_disabled"
                type="checkBox"
                checked={autoDisable}
                onChange={(e) => setAutoDisable(e.target.checked)}
              />
            </div>
          </div>
        </div>

        <div className="displayGrid1 float-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isLoading}
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>

          <button
            onClick={handleSubmit}
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("submit")}
          </button>
        </div>
      </ComponentCustomModal>
    </>
  );
};

export default ResellerCustomerEdit;
