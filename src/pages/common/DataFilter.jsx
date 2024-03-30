import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

// custom hooks
import useISPowner from "../../hooks/useISPOwner";

// internal import
import {
  fetchMikrotik,
  getAllPackages,
  getArea,
} from "../../features/apiCalls";
import { getSubAreasApi } from "../../features/actions/customerApiCall";

const DataFilter = ({ page, customers, setCustomers }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  //get mikrotiks from redux store
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get mikrotik and without mikrotik packages in redux store
  const packages = useSelector((state) => state?.package?.allPackages);

  //get all areas
  const areas = useSelector((state) => state.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  //get all pole Box
  const poleBox = useSelector((state) => state.area?.poleBox);

  // customers main data state
  const [mainData, setMainData] = useState([]);

  // filter data state
  const [filterOptions, setFilterOption] = useState({
    mikrotik: "",
    mikrotikPackage: "",
    area: "",
    subArea: "",
    poleBox: "",
    status: "",
    paymentStatus: "",
  });

  // mikrotik packages state
  const [mikrotikPackages, setMikrotikPackages] = useState([]);

  // loading state
  const [loading, setLoading] = useState(false);

  // api call
  useEffect(() => {
    // get mikrotiks
    if (mikrotiks.length === 0) fetchMikrotik(dispatch, ispOwnerId, setLoading);

    // get mikrotik packages
    if (packages?.length === 0)
      getAllPackages(dispatch, ispOwnerId, setLoading);

    // get area
    if (areas.length === 0) getArea(dispatch, ispOwnerId, setLoading);

    // get sub area
    if (subAreas.length === 0) getSubAreasApi(dispatch, ispOwnerId);
  }, [page]);

  // set customers in state
  useEffect(() => {
    let customerModified = [];

    // add area to customers
    customers?.map((c) => {
      subAreas?.map((sub) => {
        if (sub.id === c.subArea) {
          customerModified.push({
            ...c,
            area: sub.area,
          });
        }
      });
    });

    // set customers in state
    setMainData(customerModified);
  }, [customers, subAreas]);

  // mikrotik handler method
  const mikrotikHandler = async (id) => {
    setFilterOption({
      ...filterOptions,
      mikrotik: id,
    });

    // if mikrotik id exist then filter packages or set empty
    if (id) {
      const mikrotikPackage = packages.filter((pack) => pack.mikrotik === id);
      setMikrotikPackages(mikrotikPackage);
    } else {
      setMikrotikPackages([]);
    }
  };

  // filter inputs options
  const filterInputs = [
    {
      name: "mikrotik",
      type: "select",
      id: "mikrotik",
      value: filterOptions.mikrotik,
      isVisible: bpSettings?.hasMikrotik,
      disabled: false,
      onChange: (e) => mikrotikHandler(e.target.value),
      options: mikrotiks,
      firstOptions: t("mikrotik"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "package",
      type: "select",
      id: "package",
      value: filterOptions.mikrotikPackage,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          mikrotikPackage: e.target.value,
        });
      },
      options: mikrotikPackages,
      firstOptions: t("package"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "area",
      type: "select",
      id: "area",
      value: filterOptions.area,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          area: e.target.value,
        });
      },
      options: areas,
      firstOptions: t("allArea"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "subArea",
      type: "select",
      id: "subArea",
      value: filterOptions.subArea,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          subArea: e.target.value,
        });
      },
      options: subAreas.filter((item) => item?.area === filterOptions.area),
      firstOptions: t("subArea"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "poleBox",
      type: "select",
      id: "poleBox",
      value: filterOptions.poleBox,
      isVisible: bpSettings?.poleBox,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          poleBox: e.target.value,
        });
      },
      options: poleBox.filter(
        (item) => item?.subArea === filterOptions.subArea
      ),
      firstOptions: t("poleBox"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "status",
      type: "select",
      id: "status",
      value: filterOptions.status,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          status: e.target.value,
        });
      },
      options: [
        {
          text: t("active"),
          value: "active",
        },
        {
          text: t("in active"),
          value: "inactive",
        },
        {
          text: t("expired"),
          value: "expired",
        },
      ],
      firstOptions: t("status"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      name: "paymentStatus",
      type: "select",
      id: "paymentStatus",
      value: filterOptions.paymentStatus,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          paymentStatus: e.target.value,
        });
      },
      options: [
        {
          text: t("paid"),
          value: "paid",
        },
        {
          text: t("unpaid"),
          value: "unpaid",
        },
        {
          text: t("free"),
          value: "free",
        },
        {
          text: t("partialPayment"),
          value: "partial",
        },
        {
          text: t("advance"),
          value: "advance",
        },
        {
          text: t("overDue"),
          value: "overDue",
        },
      ],
      firstOptions: t("paymentStatus"),
      textAccessor: "text",
      valueAccessor: "value",
    },
  ];

  // customers data filter controller
  const handleActiveFilter = () => {
    let findAnyCustomer = mainData.reduce((acc, c) => {
      const {
        mikrotik,
        mikrotikPackage,
        area,
        subArea,
        poleBox,
        status,
        paymentStatus,
      } = filterOptions;

      // make possible conditions objects if the filter value not selected thats return true
      //if filter value exist then compare
      const conditions = {
        mikrotik: mikrotik ? c.mikrotik === mikrotik : true,
        package: mikrotikPackage ? c.mikrotikPackage === mikrotikPackage : true,
        area: area ? c.area === area : true,
        subArea: subArea ? c.subArea === subArea : true,
        poleBox: poleBox ? c.poleBox === poleBox : true,
        status: status ? c.status === status : true,
        paid: paymentStatus ? c.paymentStatus === "paid" : true,
        unpaid: paymentStatus
          ? c.paymentStatus === "unpaid" && c.monthlyFee !== 0
          : true,
        free: paymentStatus ? c.monthlyFee === 0 : true,
        partial: paymentStatus
          ? c.paymentStatus === "unpaid" &&
            c.monthlyFee > c.balance &&
            c.balance > 0
          : true,
        advance: paymentStatus
          ? c.monthlyFee <= c.balance && c.monthlyFee > 0
          : true,
        overDue: paymentStatus
          ? c.paymentStatus === "unpaid" && c.balance < 0
          : true,
      };

      //check if condition pass got for next step or is fail stop operation
      //if specific filter option value not exist it will return true

      let isPass = false;

      isPass = conditions["mikrotik"];
      if (!isPass) return acc;

      isPass = conditions["package"];
      if (!isPass) return acc;

      isPass = conditions["area"];
      if (!isPass) return acc;

      isPass = conditions["poleBox"];
      if (!isPass) return acc;

      isPass = conditions["subArea"];
      if (!isPass) return acc;

      isPass = conditions["status"];
      if (!isPass) return acc;

      if (paymentStatus) {
        isPass = conditions[paymentStatus];
        if (!isPass) return acc;
      }

      if (isPass) acc.push(c);

      return acc;
    }, []);

    // set filter customer in customer state
    setCustomers(findAnyCustomer);
  };

  // filter reset controller
  const handleFilterReset = () => {
    // set empty filter option
    setFilterOption({
      mikrotik: "",
      mikrotikPackage: "",
      area: "",
      subArea: "",
      poleBox: "",
      status: "",
      paymentStatus: "",
    });

    // set empty mikrotik packages
    setMikrotikPackages([]);

    // set empty customers
    setCustomers(customers);
  };

  return (
    <>
      <div className="displayGrid6">
        {filterInputs.map(
          (item) =>
            item.isVisible && (
              <select
                className="form-select shadow-none mt-0"
                onChange={item.onChange}
                value={item.value}
              >
                <option value="">{item.firstOptions}</option>
                {item.options?.map((opt) => (
                  <option value={opt[item.valueAccessor]}>
                    {opt[item.textAccessor]}
                  </option>
                ))}
              </select>
            )
        )}

        <div className="displayGrid1">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handleActiveFilter}
          >
            {t("filter")}
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleFilterReset}
          >
            {t("reset")}
          </button>
        </div>
      </div>
    </>
  );
};

export default DataFilter;
