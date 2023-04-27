import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import {
  fetchMikrotik,
  fetchPackagefromDatabase,
  fetchpppoePackage,
} from "../../../features/apiCalls";
import { editResellerCustomer } from "../../../features/resellerCustomerAdminApi";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

const ResellerCustomerEdit = ({ customerId, allCustomer }) => {
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
      // fetchpppoePackage(dispatch, IDs, singleMikrotik?.name);
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
    <div
      className="modal fade "
      id="CustomerEditModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {data?.name} {t("edit")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="wrapper-body">
              <div class="align-items-center">
                <div class="col-auto">
                  <label class="form-label mb-0"> {t("selectMikrotik")} </label>
                </div>
                <div className="col-auto">
                  <select
                    className="form-select mt-0 mb-3 mw-100"
                    aria-label="Default select example"
                    disabled
                    value={data?.mikrotik || ""}
                  >
                    <option value={singleMikrotik?.id || ""}>
                      {singleMikrotik?.name || ""}
                    </option>
                  </select>
                </div>
              </div>

              <div class=" align-items-center">
                <div class="col-auto">
                  <label class="form-label mb-0"> {t("selectPackage")} </label>
                </div>
                <div className="col-auto">
                  <select
                    className="form-select mb-3 mt-0 mw-100"
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
              </div>

              <div class="align-items-center">
                <div class="col-auto">
                  <label class="form-label mb-0"> {t("monthFee")} </label>
                </div>
                <div class="col-auto">
                  <input
                    type="text"
                    class="form-control"
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    ref={monthlyFeeRef}
                  />
                </div>
              </div>

              <div className="billCycle">
                <div className="mt-2">
                  <label className="form-control-label">
                    {t("billingCycle")}
                  </label>
                  <ReactDatePicker
                    className="form-control"
                    selected={billDate}
                    onChange={(date) => setBillDate(date)}
                    dateFormat="MMM dd yyyy h:mm"
                    showTimeSelect
                    minDate={billDate}
                  />
                </div>
              </div>

              <div className="mt-2">
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

              <div className="d-flex justify-content-evenly align-items-center">
                <div className="pppoeStatus mt-4 d-flex">
                  {/* <p>স্ট্যাটাস পরিবর্তন</p> */}
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
                <div className="autoDisable mt-4 m-75">
                  <label htmlFor="auto_disabled">
                    {t("autoConnectionOff")}
                  </label>
                  <input
                    id="auto_disabled"
                    type="checkBox"
                    checked={autoDisable}
                    onChange={(e) => setAutoDisable(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              disabled={isLoading}
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
        </div>
      </div>
    </div>
  );
};

export default ResellerCustomerEdit;
