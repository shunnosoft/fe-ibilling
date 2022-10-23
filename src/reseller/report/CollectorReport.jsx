import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import moment from "moment";
import {
  ArchiveFill,
  ArrowClockwise,
  ArrowDownUp,
  PenFill,
  PersonFill,
  ThreeDots,
  Wallet,
} from "react-bootstrap-icons";
import TdLoader from "../../components/common/TdLoader";
import Pagination from "../../components/Pagination";
import Footer from "../../components/admin/footer/Footer";
import "../Customer/customer.css";
import "./report.css";

import { useDispatch, useSelector } from "react-redux";
import arraySort from "array-sort";
import { getCollectorBill } from "../../features/apiCalls";
import FormatNumber from "../../components/common/NumberFormat";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import DatePicker from "react-datepicker";

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

  const [singleArea, setArea] = useState({});
  const [subAreaIds, setSubArea] = useState([]);
  const [mainData, setMainData] = useState(allBills);
  const [mainData2, setMainData2] = useState(allBills);
  const [isLoading, setIsLoading] = useState(false);
  const [isSorted, setSorted] = useState(false);

  const dispatch = useDispatch();

  // reload handler
  const reloadHandler = () => {
    getCollectorBill(dispatch, setIsLoading);
  };

  useEffect(() => {
    if (allBills.length === 0) getCollectorBill(dispatch, setIsLoading);
  }, [dispatch]);

  useEffect(() => {
    let areas = [];

    collectorArea?.map((item) => {
      let area = {
        id: item?.area?.id,
        name: item.area?.name,
        subAreas: [
          {
            id: item.id,
            name: item.name,
          },
        ],
      };

      let found = areas?.find((area) => area.id === item.area?.id);
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
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(dateStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(dateEnd).format("YYYY-MM-DD")).getTime()
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

  const onSearch = (e) => {
    const keys = ["amount", "name", "customerId", "createdAt"];

    let arr = mainData2.filter((item) =>
      keys.some((key) =>
        item[key]
          ? typeof item[key] === "string"
            ? item[key]?.toString()?.toLowerCase().includes(e)
            : item[key]?.toString().includes(e)
          : typeof item["customer"][key] === "string"
          ? item["customer"][key]?.toString()?.toLowerCase().includes(e)
          : item["customer"][key]?.toString().includes(e)
      )
    );

    setMainData(arr);
  };

  const columns2 = React.useMemo(
    () => [
      {
        width: "25%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "25%",
        Header: t("customer"),
        accessor: "customer.name",
      },
      {
        width: "25%",
        Header: t("bill"),
        accessor: "amount",
      },

      {
        width: "25%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
    ],
    [t]
  );

  const customComponent = (
    <div style={{ fontSize: "18px" }}>
      {t("totalBill")} {addAllBills()} {t("tk")}
    </div>
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2>{t("billReport")}</h2>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>

              {/* Model start */}

              {/* Model finish */}

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

                      <div>
                        <DatePicker
                          className="form-control mw-100 mt-2"
                          selected={dateStart}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="MMM dd yyyy"
                          placeholderText={t("selectBillDate")}
                        />
                      </div>
                      <div className="mx-2">
                        <DatePicker
                          className="form-control mw-100 mt-2"
                          selected={dateEnd}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="MMM dd yyyy"
                          placeholderText={t("selectBillDate")}
                        />
                      </div>
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
                      isLoading={isLoading}
                      data={mainData}
                      columns={columns2}
                    ></Table>
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
