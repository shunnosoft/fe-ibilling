import React from "react";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import moment from "moment";
import Footer from "../../components/admin/footer/Footer";
import "../Customer/customer.css";
import "./report.css";

import { useDispatch, useSelector } from "react-redux";
import arraySort from "array-sort";
import { getCollectorBill } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import FormatNumber from "../../components/common/NumberFormat";

export default function CollectorReport() {
  const { t } = useTranslation();
  //   const allArea = useSelector(state => state.area.area);
  const [allArea, setAreas] = useState([]);
  const collectorArea = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.collector.areas
  );

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  const allBills = useSelector((state) => state.collector.collectorBill);

  const [isLoading, setIsLoading] = useState(false);
  const [singleArea, setArea] = useState({});
  const [subAreaIds, setSubArea] = useState([]);
  const [mainData, setMainData] = useState(allBills);
  console.log(mainData);
  const [mainData2, setMainData2] = useState(allBills);

  const dispatch = useDispatch();

  useEffect(() => {
    getCollectorBill(dispatch, setIsLoading);
  }, [dispatch]);

  useEffect(() => {
    let areas = [];

    collectorArea?.map((item) => {
      let area = {
        id: item?.area?.id,
        name: item?.area?.name,
        subAreas: [
          {
            id: item?.id,
            name: item?.name,
          },
        ],
      };

      let found = areas?.find((area) => area?.id === item.area?.id);
      if (found) {
        found.subAreas.push({ id: item.id, name: item.name });

        return (areas[areas.findIndex((item) => item.id === found.id)] = found);
      } else {
        return areas.push(area);
      }
    });
    setAreas(areas);
  }, [collectorArea]);

  useEffect(() => {
    var initialToday = new Date();
    var initialFirst = new Date(
      initialToday.getFullYear(),
      initialToday.getMonth(),
      1
    );

    initialFirst.setHours(0, 0, 0, 0);
    initialToday.setHours(23, 59, 59, 999);
    setMainData(
      allBills?.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );

    // Temp varialbe for search
    setMainData2(
      allBills?.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );
  }, [allBills]);

  const onChangeArea = (param) => {
    let area = JSON.parse(param);
    setArea(area);

    if (
      area &&
      Object.keys(area).length === 0 &&
      Object.getPrototypeOf(area) === Object.prototype
    ) {
      setSubArea([]);
    } else {
      let subAreaIds = [];

      area?.subAreas.map((sub) => subAreaIds.push(sub.id));

      setSubArea(subAreaIds);
    }
  };

  const onChangeSubArea = (id) => {
    if (!id) {
      let subAreaIds = [];
      singleArea?.subAreas.map((sub) => subAreaIds.push(sub.id));

      setSubArea(subAreaIds);
    } else {
      setSubArea([id]);
    }
  };

  const onClickFilter = () => {
    let arr = allBills;

    if (subAreaIds.length) {
      arr = allBills?.filter((bill) =>
        subAreaIds.includes(bill.customer.subArea)
      );
    }

    arr = arr.filter(
      (item) =>
        Date.parse(item.createdAt) >= Date.parse(dateStart) &&
        Date.parse(item.createdAt) <= Date.parse(dateEnd)
    );

    setMainData(arr);
    setMainData2(arr);
  };

  const addAllBills = useCallback(() => {
    var count = 0;
    mainData?.forEach((item) => {
      count = count + item.amount;
    });
    return FormatNumber(count);
  }, [mainData]);

  const customComponent = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      <div>
        {t("collectorReportBill")} {addAllBills()} {t("tk")}
      </div>
    </div>
  );

  const columns = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "15%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "15%",
        Header: t("customer"),
        accessor: "customer.name",
      },
      {
        width: "15%",
        Header: t("mobile"),
        accessor: "customer.mobile",
      },
      {
        width: "15%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "20%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
    ],
    [t]
  );

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle"> {t("billReport")} </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    {/* filter selector */}
                    <div className="selectFilteringg">
                      <select
                        className="form-select"
                        onChange={(e) => onChangeArea(e.target.value)}
                      >
                        <option value={JSON.stringify({})} defaultValue>
                          {t("allArea")}{" "}
                        </option>
                        {allArea.map((area, key) => (
                          <option key={key} value={JSON.stringify(area)}>
                            {area.name}
                          </option>
                        ))}
                      </select>
                      <select
                        className="form-select mx-3"
                        onChange={(e) => onChangeSubArea(e.target.value)}
                      >
                        <option value="" defaultValue>
                          {t("allSubArea")}{" "}
                        </option>
                        {singleArea?.subAreas?.map((sub, key) => (
                          <option key={key} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>

                      <input
                        className="form-select"
                        type="date"
                        id="start"
                        name="trip-start"
                        value={moment(dateStart).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                        }}
                      />
                      <input
                        className="form-select mx-3"
                        type="date"
                        id="end"
                        name="trip-start"
                        value={moment(dateEnd).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                        }}
                      />

                      <button
                        className="btn btn-outline-primary w-140 mt-2"
                        type="button"
                        onClick={onClickFilter}
                      >
                        {t("filter")}
                      </button>
                    </div>
                  </div>
                  {/* table */}
                  <div className="table-section">
                    <Table
                      customComponent={customComponent}
                      columns={columns}
                      data={mainData}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
}
