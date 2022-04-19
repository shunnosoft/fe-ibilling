import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import moment from "moment";
import {
  ArchiveFill,
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

export default function CollectorReport() {
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

  const allBills = useSelector(
    (state) => state.persistedReducer.collector.collectorBill
  );

  const [singleArea, setArea] = useState({});
  const [subAreaIds, setSubArea] = useState([]);
  const [mainData, setMainData] = useState(allBills);
  const [mainData2, setMainData2] = useState(allBills);

  const [isSorted, setSorted] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    getCollectorBill(dispatch);
  }, [dispatch]);

  useEffect(() => {
    let areas = [];

    collectorArea?.map((item) => {
      let area = {
        id: item.area.id,
        name: item.area.name,
        subAreas: [
          {
            id: item.id,
            name: item.name,
          },
        ],
      };

      let found = areas?.find((area) => area.id === item.area.id);
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
    return count.toString();
  }, [mainData]);

  const onSearch = (e) => {
    const keys = ["amount", "name", "customerId", "createdAt"];

    let arr = mainData2.filter((item) =>
      keys.some((key) =>
        item[key]
          ? typeof item[key] === "string"
            ? item[key]?.toLowerCase().includes(e)
            : item[key]?.toString().includes(e)
          : typeof item["customer"][key] === "string"
          ? item["customer"][key]?.toLowerCase().includes(e)
          : item["customer"][key]?.toString().includes(e)
      )
    );

    setMainData(arr);
  };

  const toggleSort = (item) => {
    setMainData(arraySort(mainData2, item, { reverse: isSorted }));
    setSorted(!isSorted);
  };

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle"> বিল রিপোর্ট </h2>
              </FourGround>

              {/* Model start */}

              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    {/* filter selector */}
                    <div className="selectFilteringg">
                      <select
                        className="form-select"
                        onChange={(e) => onChangeArea(e.target.value)}
                      >
                        <option value={JSON.stringify({})} defaultValue>
                          সকল এরিয়া{" "}
                        </option>
                        {allArea.map((area, key) => (
                          <option key={key} value={JSON.stringify(area)}>
                            {area.name}
                          </option>
                        ))}
                      </select>
                      <select
                        className="form-select"
                        onChange={(e) => onChangeSubArea(e.target.value)}
                      >
                        <option value="" defaultValue>
                          সকল সাব এরিয়া{" "}
                        </option>
                        {singleArea?.subAreas?.map((sub, key) => (
                          <option key={key} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>

                      <div className="dateDiv  ">
                        <input
                          className="form-select"
                          type="date"
                          id="start"
                          name="trip-start"
                          value={moment(dateStart).format("YYYY-MM-DD")}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                          }}
                          // value="2018-07-22"

                          // min="2018-01-01"
                          // max="2018-12-31"
                        />
                      </div>
                      <div className="dateDiv">
                        <input
                          className="form-select"
                          type="date"
                          id="end"
                          name="trip-start"
                          value={moment(dateEnd).format("YYYY-MM-DD")}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="submitdiv d-grid gap-2">
                      <button
                        className="btn fs-5 btn-success w-100"
                        type="button"
                        onClick={onClickFilter}
                      >
                        ফিল্টার
                      </button>
                    </div>

                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          বিলঃ
                          <span className="allCollectorSpan">
                            {addAllBills()} টাকা
                          </span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ"
                            onChange={(e) => onSearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* table */}
                  <div className="table-responsive-lg">
                    <table className="table table-striped ">
                      <thead>
                        <tr className="spetialSortingRow">
                          <th
                            onClick={() => toggleSort("customer.customerId")}
                            scope="col"
                          >
                            আইডি
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            onClick={() => toggleSort("customer.name")}
                            scope="col"
                          >
                            গ্রাহক
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th onClick={() => toggleSort("amount")} scope="col">
                            বিল
                            <ArrowDownUp className="arrowDownUp" />
                          </th>

                          <th
                            onClick={() => toggleSort("createdAt")}
                            scope="col"
                          >
                            তারিখ
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {false ? (
                          <tr>
                            <TdLoader colspan={9} />
                          </tr>
                        ) : mainData?.length === undefined ? (
                          ""
                        ) : (
                          mainData.map((val, key) => (
                            <tr key={key} id={val?.id}>
                              <td>{val?.customer?.customerId}</td>
                              <td>{val?.customer?.name}</td>
                              <td>{val?.amount}</td>
                              <td>
                                {moment(val?.createdAt).format(
                                  "DD-MM-YYYY hh:mm:ss A"
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="paginationSection">
                      <select
                        className="form-select paginationFormSelect"
                        aria-label="Default select example"
                        // onChange={(e) => setCustomerPerPage(e.target.value)}
                      >
                        <option value="5">৫ জন</option>
                        <option value="10">১০ জন</option>
                        <option value="100">১০০ জন</option>
                        <option value="200">২০০ জন</option>
                        <option value="500">৫০০ জন</option>
                        <option value="1000">১০০০ জন</option>
                      </select>
                      <Pagination
                      // customerPerPage={customerPerPage}
                      // totalCustomers={Customers.length}
                      // paginate={paginate}
                      />
                    </div>
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
