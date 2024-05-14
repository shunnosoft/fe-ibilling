import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";

// custom hooks
import useISPowner from "../../hooks/useISPOwner";

// internal import
import {
  fetchMikrotik,
  getAllPackages,
  getArea,
} from "../../features/apiCalls";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import { handleActiveFilter } from "./activeFilter";

const DataFilter = ({
  page,
  customers,
  setCustomers,
  filterOptions,
  setFilterOption,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // current month date
  let today = new Date();

  // current start & end date
  var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // current date and time
  firstDayOfMonth.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings, hasMikrotik, userData } = useISPowner();

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

  // get reseller
  const resellers = useSelector((state) => state?.reseller.reseller);

  // customers main data state
  const [mainData, setMainData] = useState([]);

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
    // {
    //   name: "month",
    //   type: "date",
    //   id: "month",
    //   isVisible: ["newCustomer"].includes(page),
    //   disabled: false,
    //   component: "DatePicker",
    //   dateFormat: "MMM-yyyy",
    //   showMonthYearPicker: true,
    //   showFullMonthYearPicker: true,
    //   minDate: new Date(userData?.createdAt),
    //   maxDate: firstDayOfMonth,
    //   selected: filterOptions.month,
    //   onChange: (date) => {
    //     setFilterOption({
    //       ...filterOptions,
    //       month: date,
    //     });
    //   },
    // },
    // {
    //   ...(filterOptions?.startCreateDate !== "Invalid Date" &&
    //   filterOptions?.startCreateDate !== undefined
    //     ? {
    //         name: "startCreateDate",
    //         type: "date",
    //         id: "startCreateDate",
    //         isVisible: ["newCustomer"].includes(page),
    //         disabled: false,
    //         placeholderText: t("startBillingCycleDate"),
    //         component: "DatePicker",
    //         dateFormat: "MMM dd yyyy",
    //         // minDate: firstDayOfMonth,
    //         // maxDate: lastDayOfMonth,
    //         selected: filterOptions?.startCreateDate,
    //         onChange: (date) => {
    //           setFilterOption({
    //             ...filterOptions,
    //             startCreateDate: date,
    //           });
    //         },
    //       }
    //     : ""),
    // },
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
      options: hasMikrotik ? mikrotikPackages : packages,
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
    {
      name: "reseller",
      type: "select",
      id: "reseller",
      value: filterOptions.reseller,
      isVisible: ["resellersCustomers"].includes(page) ? true : false,
      disabled: false,
      onChange: (e) =>
        setFilterOption({
          ...filterOptions,
          reseller: e.target.value,
        }),
      options: resellers,
      firstOptions: t("allReseller"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "allCustomer",
      type: "select",
      id: "allCustomer",
      value: filterOptions.allCustomer,
      isVisible: true,
      disabled: false,
      onChange: (e) =>
        setFilterOption({
          ...filterOptions,
          allCustomer: e.target.value,
        }),
      options: [
        { value: "freeUser", text: t("freeCustomer") },
        { value: "nonFreeUser", text: t("nonFreeCustomer") },
        { value: "prepaid", text: t("prepaid") },
        { value: "postpaid", text: t("postPaid") },
      ],
      firstOptions: t("sokolCustomer"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      name: "billDayLeft",
      type: "select",
      id: "billDayLeft",
      value: filterOptions.billDayLeft,
      isVisible: true,
      disabled: false,
      onChange: (e) =>
        setFilterOption({
          ...filterOptions,
          billDayLeft: e.target.value,
        }),
      options: [
        { value: "1", text: t("oneDayLeft") },
        { value: "2", text: t("twoDayLeft") },
        { value: "3", text: t("threeDayLeft") },
        { value: "4", text: t("fourDayLeft") },
        { value: "7", text: t("sevenDayLeft") },
      ],
      firstOptions: t("filterBillDate"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      name: "startDate",
      type: "date",
      id: "startDate",
      isVisible: true,
      disabled: false,
      placeholderText: t("startBillingCycleDate"),
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
      minDate: firstDayOfMonth,
      maxDate: lastDayOfMonth,
      selected: filterOptions.startDate,
      onChange: (date) => {
        setFilterOption({
          ...filterOptions,
          startDate: date,
        });
      },
    },
    {
      name: "endDate",
      type: "date",
      id: "endDate",
      isVisible: true,
      disabled: false,
      placeholderText: t("endBillingCycleDate"),
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
      minDate: firstDayOfMonth,
      maxDate: lastDayOfMonth,
      selected: filterOptions.endDate,
      onChange: (date) => {
        setFilterOption({
          ...filterOptions,
          endDate: date,
        });
      },
    },
    {
      name: "changeCustomer",
      type: "select",
      id: "changeCustomer",
      value: filterOptions.changeCustomer,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          changeCustomer: e.target.value,
        });
      },
      options: [
        {
          text: t("promiseDate"),
          value: "promiseDate",
        },
        {
          text: t("connectionOn"),
          value: "true",
        },
        {
          text: t("connectionOff"),
          value: "false",
        },
      ],
      firstOptions: t("changeCustomer"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      name: "userType",
      type: "select",
      id: "userType",
      value: filterOptions.userType,
      isVisible: ["resellersCustomers", "resellerCustomers"].includes(page)
        ? true
        : false,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          userType: e.target.value,
        });
      },
      options: [
        {
          text: t("pppoe"),
          value: "pppoe",
        },
        {
          text: t("static"),
          value: "static",
        },
      ],
      firstOptions: t("userType"),
      textAccessor: "text",
      valueAccessor: "value",
    },
  ];

  // filter reset controller
  const handleFilterReset = () => {
    // set empty filter option
    setFilterOption(
      Object.fromEntries(
        filterInputs.map((input) => [
          !["month"].includes(input.name) && input.name,
          "",
        ])
      )
    );

    // set empty mikrotik packages
    setMikrotikPackages([]);

    // set empty customers
    setCustomers(customers);
  };

  return (
    <>
      <div className="displayGrid6">
        {filterInputs.map((item) => {
          if (item.isVisible) {
            return item.type === "select" ? (
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
            ) : (
              <div>
                <DatePicker className="form-control mt-0" {...item} />
              </div>
            );
          }
        })}

        <div className="displayGrid1">
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() =>
              setCustomers(handleActiveFilter(mainData, filterOptions))
            }
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
