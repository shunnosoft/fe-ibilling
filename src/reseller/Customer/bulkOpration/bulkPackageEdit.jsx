import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// internal import
import RootBulkModal from "./bulkModal";
import BulkPackageUpdateRecharge from "../../../pages/Customer/customerCRUD/bulkOpration/PackageUpdateRecharge";

// custom function import
import {
  getMonthStartDay,
  getCustomerDayLeft,
} from "../../../pages/Customer/customerCRUD/customerBillDayPromiseDate";

const BulkPackageEdit = ({ bulkCustomer, show, setShow }) => {
  const { t } = useTranslation();

  // get mikrotik
  const Getmikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get mikrotik package from redux
  const pppoePackage = useSelector((state) => state?.mikrotik?.pppoePackage);

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

  const customer = bulkCustomer.map((val) => {
    // home user data
    const homeUser = val.original;

    // home user billing date
    const billingDate = new Date(val.original.billingCycle);

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

    // customer day left amount
    const changePackageDayLeftAmount =
      (mikrotikPackage.rate / monthDate) * dayLeft;

    return { currentPackgeBalance, changePackageDayLeftAmount };
  });

  // customer package change and recharge
  const customersPackageUpdateHandle = (e) => {
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
          // toast.error("মাইক্রটিক এর মধ্যে এই" + current.original.name + "নেই");
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
        // bulkPackageEdit(dispatch, data, setIsLoading, setShow);
      }
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
              className="form-select mb-3 mw-100 mt-0"
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

        <div className="modal-footer" style={{ border: "none" }}>
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
            onClick={() => {
              setShow(false);
              setModalStatus("PackageUpdateRecharge");
              setModalShow(true);
            }}
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
