import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";

// custom hooks
import useISPowner from "../../hooks/useISPOwner";

// internal import
import { handleActiveFilter } from "./activeFilter";
import { getOwnerUsers, userStaffs } from "../../features/getIspOwnerUsersApi";
import {
  getMikrotik,
  getSubAreas,
  getResellerPackages,
} from "../../features/apiCallReseller";
import useSelectorState from "../../hooks/useSelectorState";

const DataFilter = ({
  page,
  customers,
  setCustomers,
  filterOptions,
  setFilterOption,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId, bpSettings, hasMikrotik, userData } = useISPowner();

  //---> Get redux store state data from useSelectorState hooks
  const { areas, subAreas, polesBox, mikrotiks } = useSelectorState();

  // current month date
  const { month } = filterOptions;
  let today = new Date();

  // current start & end date
  var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  var prevMonthDay = new Date(today.getFullYear(), today.getMonth() - 1);

  // current start & end date
  var filterFirstDayOfMonth = new Date(
    month?.getFullYear(),
    month?.getMonth(),
    1
  );
  var filterLastDayOfMonth = new Date(
    month?.getFullYear(),
    month?.getMonth() + 1,
    0
  );

  // current date and time
  firstDayOfMonth.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // admin staff user role permission
  const adminUser =
    role === "ispOwner" ||
    role === "manager" ||
    (role === "collector" && !userData.reseller);

  const resellerUser =
    role === "reseller" || (role === "collector" && userData.reseller);

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  const allSubAreas = adminUser ? subAreas : areas;

  // get mikrotik and without mikrotik packages in redux store
  const packages = useSelector((state) =>
    resellerUser ? state?.mikrotik?.pppoePackage : state?.package?.allPackages
  );

  // get reseller
  const resellers = useSelector((state) => state?.reseller.reseller);

  // get user staff data from redux store
  const staffs = useSelector((state) => state?.ownerUsers?.userStaff);

  // customers main data state
  const [mainData, setMainData] = useState([]);

  // mikrotik packages state
  const [mikrotikPackages, setMikrotikPackages] = useState([]);

  // loading state
  const [loading, setLoading] = useState(false);

  // api call
  useEffect(() => {
    // get user staffs api
    if (adminUser) {
      staffs.length === 0 && userStaffs(dispatch);
    } else {
      staffs.length === 0 && getOwnerUsers(dispatch, ispOwnerId);
    }

    // get all mikrotik packages
    if (!adminUser) {
      packages?.length === 0 && getResellerPackages(dispatch, resellerId);

      //---> @Get reseller mikrotiks data
      !mikrotiks?.length && getMikrotik(dispatch, resellerId);

      //---> @Get reseller areas sub-area data
      !allSubAreas.length && getSubAreas(dispatch, resellerId);
    }
  }, [page, adminUser]);

  // set customers in state
  useEffect(() => {
    let customerModified = [];

    // add area to customers
    customers?.map((c) => {
      allSubAreas?.map((sub) => {
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
  }, [customers, allSubAreas]);

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
      name: "month",
      type: "date",
      id: "month",
      isVisible: ["newCustomer", "inactiveCustomer", "dueCustomer"].includes(
        page
      ),
      disabled: false,
      component: "DatePicker",
      dateFormat: "MMM-yyyy",
      showMonthYearPicker: true,
      showFullMonthYearPicker: true,
      minDate: new Date(userData?.createdAt),
      maxDate: ["dueCustomer"]?.includes(page) ? prevMonthDay : firstDayOfMonth,
      selected: filterOptions.month,
      onChange: (date) => {
        setFilterOption({
          ...filterOptions,
          month: date,
        });
      },
    },
    {
      name: "startCreateDate",
      type: "date",
      id: "startCreateDate",
      isVisible: ["newCustomer"].includes(page),
      disabled: false,
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
      minDate: filterFirstDayOfMonth,
      maxDate:
        month?.getMonth() + 1 === today.getMonth() + 1
          ? today
          : filterLastDayOfMonth,
      selected: filterOptions?.startCreateDate,
      onChange: (date) => {
        setFilterOption({
          ...filterOptions,
          startCreateDate: date,
        });
      },
    },
    {
      name: "endCreateDate",
      type: "date",
      id: "endCreateDate",
      isVisible: ["newCustomer"].includes(page),
      disabled: false,
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
      minDate: filterFirstDayOfMonth,
      maxDate:
        month?.getMonth() + 1 === today.getMonth() + 1
          ? today
          : filterLastDayOfMonth,
      selected: filterOptions?.endCreateDate,
      onChange: (date) => {
        setFilterOption({
          ...filterOptions,
          endCreateDate: date,
        });
      },
    },
    {
      name: "mikrotik",
      type: "select",
      id: "mikrotik",
      value: filterOptions.mikrotik,
      isVisible: bpSettings?.hasMikrotik && (adminUser || resellerUser),
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
      isVisible: adminUser || resellerUser ? true : false,
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
      isVisible: adminUser ? true : false,
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
      isVisible: adminUser || resellerUser ? true : false,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          subArea: e.target.value,
        });
      },
      options: adminUser
        ? allSubAreas.filter((item) => item?.area === filterOptions.area)
        : allSubAreas,
      firstOptions: t("subArea"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      name: "poleBox",
      type: "select",
      id: "poleBox",
      value: filterOptions.poleBox,
      isVisible: bpSettings?.poleBox && (adminUser || resellerUser),
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          poleBox: e.target.value,
        });
      },
      options: polesBox.filter(
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
      isVisible: adminUser || resellerUser ? true : false,
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
      isVisible: adminUser || resellerUser ? true : false,
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
      isVisible:
        ["resellersCustomers"].includes(page) && adminUser ? true : false,
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
      name: "createdBy",
      type: "select",
      id: "createdBy",
      value: filterOptions.createdBy,
      isVisible: ["newCustomer"].includes(page) && adminUser ? true : false,
      disabled: false,
      onChange: (e) =>
        setFilterOption({
          ...filterOptions,
          createdBy: e.target.value,
        }),
      options: staffs,
      firstOptions: t("createdBy"),
      textAccessor: "name",
      valueAccessor: "user",
    },
    {
      name: "allCustomer",
      type: "select",
      id: "allCustomer",
      value: filterOptions.allCustomer,
      isVisible: adminUser || resellerUser ? true : false,
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
      isVisible: adminUser || resellerUser ? true : false,
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
      isVisible: adminUser || resellerUser ? true : false,
      disabled: false,
      placeholderText: t("startBillingCycleDate"),
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
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
      isVisible: adminUser || resellerUser ? true : false,
      disabled: false,
      placeholderText: t("endBillingCycleDate"),
      component: "DatePicker",
      dateFormat: "yyyy MM dd hh:mm a",
      timeIntervals: 60,
      showTimeSelect: "showTimeSelect",
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
      isVisible: adminUser || resellerUser ? true : false,
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
      isVisible: [
        "resellersCustomers",
        "resellerCustomers",
        "newCustomer",
        "inactiveCustomer",
        "dueCustomer",
      ].includes(page)
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
        ...(bpSettings?.customerType.includes("pppoe")
          ? [{ text: t("pppoe"), value: "pppoe" }]
          : []),
        ...(bpSettings?.customerType.includes("static")
          ? [{ text: t("static"), value: "static" }]
          : []),
      ],

      firstOptions: t("userType"),
      textAccessor: "text",
      valueAccessor: "value",
    },
  ];

  // filter reset controller
  const handleFilterReset = () => {
    if (Object.keys(filterOptions).length > 0) {
      // set empty filter option
      setFilterOption(
        Object.fromEntries(
          filterInputs.map((input) =>
            ["month", "startCreateDate", "endCreateDate"].includes(
              filterOptions[input.name]
            )
              ? [
                  input.name,
                  ["dueCustomer"].includes(page)
                    ? (filterOptions[input.name] = prevMonthDay)
                    : (filterOptions[input.name] = today),
                ]
              : [
                  !["month", "startCreateDate", "endCreateDate"].includes(
                    input.name
                  ) && input.name,
                  "",
                ]
          )
        )
      );

      // set empty mikrotik packages
      setMikrotikPackages([]);

      // set empty customers
      setCustomers(customers);
    }
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
