import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { fetchpppoePackage } from "../../../features/apiCalls";
import { editResellerCustomer } from "../../../features/resellerCustomerAdminApi";
import { useTranslation } from "react-i18next";

const ResellerCustomerEdit = ({ customerId }) => {
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

  // get all data from redux state
  const resellerCustomer = useSelector(
    (state) => state?.persistedReducer?.resellerCustomer?.resellerCustomer
  );

  // get single customer
  const data = resellerCustomer.find((item) => item.id === customerId);

  // get mikrotik
  const getMikrotik = useSelector(
    (state) => state.persistedReducer?.mikrotik?.mikrotik
  );
  // get single mikrotik
  const singleMikrotik = getMikrotik.find((item) => item.id === data?.mikrotik);

  useEffect(() => {
    // set package id in package state
    setPackageId(data?.mikrotikPackage);

    setPackageRate(data?.mikrotikPackage);

    if (singleMikrotik) {
      const IDs = {
        ispOwner: data?.ispOwner,
        mikrotikId: singleMikrotik?.id,
      };

      // get package api call
      fetchpppoePackage(dispatch, IDs, singleMikrotik?.name);
    }
  }, [singleMikrotik?.id]);

  // get PPPoE package from state
  const ppPackage = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoePackage
  );

  // find single package
  const packages = ppPackage.find((item) => item.id === packageId);

  // find profile package
  const findPackage = ppPackage.find((item) => item.id === packageRate);

  // set package rate in state
  useEffect(() => {
    setFixPackageRate(findPackage?.rate);
  }, [findPackage?.rate]);

  // handle submit
  const handleSubmit = () => {
    const sendingData = {
      mikrotik: singleMikrotik?.id,
      mikrotikPackage: packageId,
      monthlyFee: packages?.rate,
      pppoe: {
        name: data?.pppoe?.name,
        password: data?.pppoe?.password,
        service: data?.pppoe?.service,
        comment: data?.pppoe?.comment,
        profile: packages?.name,
        disabled: data?.pppoe?.disabled,
      },
    };
    editResellerCustomer(
      dispatch,
      sendingData,
      data?.reseller,
      customerId,
      setIsLoading
    );
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="CustomerEditModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("edit")}
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
                          disabled={item.rate >= findPackage?.rate}
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
                    disabled
                    type="text"
                    class="form-control"
                    value={packages?.rate}
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
              {t("cancle")}
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
