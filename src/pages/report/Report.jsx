import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import moment from "moment";

import TdLoader from "../../components/common/TdLoader";
import Pagination from "../../components/Pagination";
import Footer from "../../components/admin/footer/Footer";
import "../Customer/customer.css";
import "./report.css";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import arraySort from "array-sort";
import { ArrowDownUp } from "react-bootstrap-icons";

export default function Report() {
  // const cus = useSelector((state) => state.customer.customer);
  // console.log(cus.length)

  const allArea = useSelector((state) => state.area.area);
  const allCollector = useSelector((state) => state.collector.collector);
  const manager = useSelector((state) => state.manager.manager);

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  const allBills = useSelector((state) => state.payment.allBills);

  const [singleArea, setArea] = useState({});
  const [subAreaIds, setSubArea] = useState([]);
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const [mainData, setMainData] = useState(allBills);
  const [mainData2, setMainData2] = useState(allBills);
  const [collectors, setCollectors] = useState([]);
  const [collectorIds, setCollectorIds] = useState([]);
  // const [cusSearch, setCusSearch] = useState("");
  // const ispOwnerId = useSelector((state) => state.auth?.ispOwnerId);
  const [isSorted, setSorted] = useState(false);
  // const [totalBill,setTotalBill]= useState("")
  const [currentPage, setCurrentPage] = useState(1);

  const [customerPerPage, setCustomerPerPage] = useState(50);
  const lastIndex = currentPage * customerPerPage;
  const firstIndex = lastIndex - customerPerPage;

  const currentCustomers = mainData.slice(firstIndex, lastIndex);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const keys = ["amount", "name", "customerId", "createdAt"];

  //   setMainData(
  //     allBills.filter((item) =>
  //       keys.some((key) =>
  //         item[key]
  //           ? typeof item[key] === "string"
  //             ? item[key]?.toLowerCase().includes(cusSearch)
  //             : item[key]?.toString().includes(cusSearch)
  //           : typeof item["customer"][key] === "string"
  //           ? item["customer"][key]?.toLowerCase().includes(cusSearch)
  //           : item["customer"][key]?.toString().includes(cusSearch)
  //       )
  //     )
  //   );
  // }, [cusSearch, allBills]);

  useEffect(() => {
    let collectors = [];

    allCollector.map((item) =>
      collectors.push({ name: item.name, user: item.user, id: item.id })
    );

    if (collectors.length === allCollector.length) {
      const { user, name, id } = manager;
      collectors.unshift({ name, user, id });
    }

    setCollectors(collectors);

    let collectorUserIdsArr = [];
    collectors.map((item) => collectorUserIdsArr.push(item.user));
    setCollectorIds(collectorUserIdsArr);
  }, [allCollector, manager]);

  // useEffect(() => {
  //   getAllBills(dispatch, ispOwnerId);
  // }, [ispOwnerId, dispatch]);

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
      allBills.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );

    // Temp varialbe for search
    setMainData2(
      allBills.filter(
        (item) =>
          Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
          Date.parse(item.createdAt) <= Date.parse(initialToday)
      )
    );
  }, [allBills]);

  const onChangeCollector = (userId) => {
    // console.log("collector id", collectorId);

    if (userId) {
      setCollectorIds([userId]);
    } else {
      let collectorUserIdsArr = [];
      collectors.map((item) => collectorUserIdsArr.push(item.user));
      setCollectorIds(collectorUserIdsArr);
    }
  };

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
    console.log("filter data");

    let arr = allBills;

    if (subAreaIds.length) {
      arr = allBills.filter((bill) =>
        subAreaIds.includes(bill.customer.subArea)
      );
    }
    if (collectorIds.length) {
      arr = arr.filter((bill) => collectorIds.includes(bill.user));
    }

    arr = arr.filter(
      (item) =>
        Date.parse(item.createdAt) >= Date.parse(dateStart) &&
        Date.parse(item.createdAt) <= Date.parse(dateEnd)
    );

    setMainData(arr);
    setMainData2(arr);
  };

  // const addAllBills = ()=>{
  //   var total=0;
  //    mainData.forEach((item)=>{
  //      console.log(item.amount)
  //      total=total+item.amount

  //    })
  //    return total.toString() ;

  // }
  const addAllBills = useCallback(() => {
    var count = 0;
    mainData.forEach((item) => {
      count = count + item.amount;
    });
    return count.toString();
    // mainData.reudce((preval,nextval)=>{
    //  const res = preval+nextval.amount ;
    //  return res.toString()
    // },0)
  }, [mainData]);
  // console.log(addAllBills())

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
                <h2 className="collectorTitle">বিল রিপোর্ট </h2>
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
                      {userRole !== "collector" ? (
                        <select
                          className="form-select"
                          onChange={(e) => onChangeCollector(e.target.value)}
                        >
                          <option value="" defaultValue>
                            সকল কালেক্টর{" "}
                          </option>
                          {collectors?.map((c, key) => (
                            <option key={key} value={c.user}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        ""
                      )}

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

                          // value="2018-07-22"

                          // min="2018-01-01"
                          // max="2018-12-31"
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
                          {/* <Search className="serchingIcon" /> */}
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
                            bill
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
                        ) : currentCustomers?.length === undefined ? (
                          ""
                        ) : (
                          currentCustomers.map((val, key) => (
                            <tr key={key} id={val?.id}>
                              <td>{val?.customer?.customerId}</td>
                              <td>{val?.customer?.name}</td>
                              <td>{val?.amount}</td>
                              <td>
                                {moment(val?.createdAt).format("DD-MM-YYYY")}
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
                        onChange={(e) => setCustomerPerPage(e.target.value)}
                      >
                        <option value="50">৫০</option>
                        <option value="100">১০০</option>
                        <option value="200">২০০</option>
                        <option value="500">৫০০</option>
                        <option value="1000">১০০০</option>
                      </select>
                      <Pagination
                        customerPerPage={customerPerPage}
                        totalCustomers={allBills?.length}
                        paginate={paginate}
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
