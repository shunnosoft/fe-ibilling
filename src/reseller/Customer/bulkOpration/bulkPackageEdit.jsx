import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";

// custom function import
import {
  getMonthStartDay,
  getCustomerDayLeft,
} from "../../../pages/Customer/customerCRUD/customerBillDayPromiseDate";

// internal import
import RootBulkModal from "./bulkModal";
import { bulkPackageEdit } from "../../../features/actions/bulkOperationApi";

const BulkPackageEdit = ({ bulkCustomer, show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner
  const { hasMikrotik } = useISPowner();

  // get mikrotik
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get mikrotik package from redux
  const pppoePackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // package recharge modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [modalShow, setModalShow] = useState(false);

  // user mikrotik packages
  const [ppPackage, setppPackage] = useState([]);

  // single mikrotik id
  const [singleMikrotik, setSingleMikrotik] = useState("");

  // single mikrotik package
  const [mikrotikPackage, setMikrotikPackage] = useState();

  // user select mikrotik packages
  useEffect(() => {
    const userMikrotikId = bulkCustomer[0]?.original.mikrotik;

    const mikrotikPackage = pppoePackage.filter(
      (pack) => pack.mikrotik === userMikrotikId
    );
    setppPackage(mikrotikPackage);
    setSingleMikrotik(userMikrotikId);
  }, [pppoePackage, bulkCustomer]);

  // select Getmikrotik
  const selectMikrotik = (e) => {
    const id = e.target.value;

    if (id) {
      const mikrotikPackage = pppoePackage.filter(
        (pack) => pack.mikrotik === id
      );
      setppPackage(mikrotikPackage);
    } else {
      setppPackage([]);
    }

    setSingleMikrotik(id);
  };

  // mikrotik package find handler
  const selectMikrotikPackage = ({ target }) => {
    const mikrotikPackage = pppoePackage.find(
      (pack) => pack.id === target.value
    );
    setMikrotikPackage(mikrotikPackage);
  };

  const customer = bulkCustomer.reduce((acc, crr) => {
    // home user data
    const homeUser = crr.original;

    // home user billing date
    const billingDate = new Date(homeUser.billingCycle);

    // customer bill month days
    const monthDate = new Date(
      billingDate.getFullYear(),
      billingDate.getMonth(),
      0
    ).getDate();

    // customer bill month day
    const monthDay = new Date(
      billingDate.getFullYear(),
      billingDate.getMonth() - 1,
      billingDate.getDate()
    );

    // customer useds day in current date
    const daysUsed = getMonthStartDay(monthDay);

    // customer bill day left
    const dayLeft = getCustomerDayLeft(homeUser.billingCycle);

    // customer current package useds day amount
    const currentPackgeUsedDayAmount =
      (homeUser.monthlyFee / monthDate) * daysUsed;

    // customer current package day left amount
    const currentPackgeBalance =
      homeUser.monthlyFee - currentPackgeUsedDayAmount;

    // customer day left amountcurrentPackgeBalance
    const changePackageDayLeftAmount =
      (mikrotikPackage?.rate / monthDate) * dayLeft;

    // customer change package amount after day left change in current date
    let changePackageAmount = 0;

    if (homeUser.status === "active" && homeUser.paymentStatus === "paid") {
      // customer current package change before current package and after balance
      if (homeUser.mikrotikPackage === mikrotikPackage?.id) {
        changePackageAmount = homeUser.balance ? homeUser.balance : 0;
      } else {
        changePackageAmount =
          currentPackgeBalance - changePackageDayLeftAmount + homeUser.balance;
      }
    } else if (
      homeUser.status === "active" &&
      homeUser.paymentStatus === "unpaid"
    ) {
      // customer current package change before current package
      if (homeUser.mikrotikPackage === mikrotikPackage?.id) {
        changePackageAmount = homeUser.balance ? homeUser.balance : 0;
      } else {
        // customer privious package and crrent package used amount
        changePackageAmount = -(
          currentPackgeUsedDayAmount +
          changePackageDayLeftAmount -
          homeUser.balance
        );

        // customer change package amount after day left change in current date
        changePackageAmount = homeUser.balance - changePackageDayLeftAmount;
      }
    } else {
      // for inactive or expired user change package monthly fee
      changePackageAmount = -mikrotikPackage?.rate;
    }

    // with or without mikrotik check customers package change
    if (hasMikrotik && homeUser.mikrotik === singleMikrotik) {
      acc[homeUser.id] = Math.round(changePackageAmount);
    } else {
      acc[homeUser.id] = Math.round(changePackageAmount);
    }

    return acc;
  }, {});

  // customer package change and recharge
  const customersPackageUpdateHandle = (e) => {
    e.preventDefault();

    // customers sending data to api
    if (mikrotikPackage) {
      const data = {
        customerIds: Object.keys(customer),
        customerBalance: customer,
        mikrotikPackage: mikrotikPackage.id,
      };

      const confirm = window.confirm(
        Object.keys(customer).length + t("updateCustomerPackage")
      );

      // bulkcustomers pakcage update api
      if (confirm) bulkPackageEdit(dispatch, data, setIsLoading);
    } else {
      alert(t("selectPackage"));
    }
  };

  return (
    <>
      <RootBulkModal show={show} setShow={setShow} header={t("updatePackage")}>
        {Getmikrotik.length > 0 ? (
          <div className="displayGrid2">
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
                {Getmikrotik?.map((val, key) => (
                  <option
                    key={key}
                    value={val.id}
                    selected={val.id === bulkCustomer[0]?.original.mikrotik}
                  >
                    {val.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-control-label changeLabelFontColor">
                {t("selectPackage")} <span className="text-danger">*</span>
              </label>
              <select
                className="form-select mb-3 mw-100 mt-0"
                aria-label="Default select example"
                onChange={selectMikrotikPackage}
              >
                <option value={"0"}>...</option>
                {ppPackage?.map((val, key) => (
                  <option
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
        ) : (
          <div>
            <label className="form-control-label changeLabelFontColor">
              {t("selectPackage")} <span className="text-danger">*</span>
            </label>
            <select
              className="form-select mw-100 mt-0"
              aria-label="Default select example"
              onChange={selectMikrotikPackage}
            >
              <option value={"0"}>...</option>
              {pppoePackage?.map((val, key) => (
                <option
                  disabled={val.rate < bulkCustomer[0]?.original.monthlyFee}
                  key={key}
                  value={val.id || ""}
                >
                  {val.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="displayGrid1 float-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={customersPackageUpdateHandle}
          >
            {t("submit")}
          </button>
        </div>
      </RootBulkModal>

      {/* package update customer monthly recharge modal */}
      {/* {modalStatus === "PackageUpdateRecharge" && (
        <BulkPackageUpdateRecharge
          show={modalShow}
          customer={customer}
          setShow={setModalShow}
          bulkCustomer={bulkCustomer}
          singleMikrotik={singleMikrotik}
          mikrotikPackage={mikrotikPackage}
        />
      )} */}
    </>
  );
};

export default BulkPackageEdit;
