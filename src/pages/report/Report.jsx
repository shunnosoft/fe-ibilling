import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import moment from "moment";
import ReactToPrint from "react-to-print";
import PrintReport from "./ReportPDF";

import Footer from "../../components/admin/footer/Footer";
import "../Customer/customer.css";
import "./report.css";
// import { useDispatch } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

import { PrinterFill } from "react-bootstrap-icons";
import { getAllBills } from "../../features/apiCalls";
import Table from "../../components/table/Table";
export default function Report() {
  const componentRef = useRef();

  // const cus = useSelector(state => state.customer.customer);
  // console.log(cus.length)
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  const dispatch = useDispatch();
  const allArea = useSelector((state) => state?.persistedReducer?.area?.area);

  const allCollector = useSelector(
    (state) => state?.persistedReducer?.collector?.collector
  );
  const manager = useSelector(
    (state) => state?.persistedReducer?.manager?.manager
  );
  const currentUser = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser
  );
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  const allBills = useSelector(
    (state) => state?.persistedReducer?.payment?.allBills
  );

  const [singleArea, setArea] = useState({});
  const [subAreaIds, setSubArea] = useState([]);
  const userRole = useSelector((state) => state?.persistedReducer?.auth?.role);
  const [mainData, setMainData] = useState(allBills);
  // const [mainData2, setMainData2] = useState(allBills);
  const [collectors, setCollectors] = useState([]);
  const [collectorIds, setCollectorIds] = useState([]);
  const [billType, setBillType] = useState("");

  useEffect(() => {
    getAllBills(dispatch, ispOwnerId);
    let collectors = [];

    allCollector.map((item) =>
      collectors.push({ name: item.name, user: item.user, id: item.id })
    );
    if (collectors.length === allCollector.length) {
      if (userRole === "ispOwner") {
        // const { user, name, id } = manager;
        const manager1 = {
          user: manager.user,
          name: manager.name + " (ম্যানেজার)",
          id: manager.id,
        };
        const isp = {
          user: currentUser.user.id,
          name: currentUser.ispOwner.name + " (এডমিন)",
          id: currentUser.ispOwner.id,
        };

        collectors.unshift(manager1);
        collectors.unshift(isp);
      } else {
        // const { user, name, id } = manager;
        const manager1 = {
          user: manager.user,
          name: manager.name + "(Manager)",
          id: manager.id,
        };

        collectors.unshift(manager1);
      }
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
    // setMainData2(
    //   allBills.filter(
    //     (item) =>
    //       Date.parse(item.createdAt) >= Date.parse(initialFirst) &&
    //       Date.parse(item.createdAt) <= Date.parse(initialToday)
    //   )
    // );
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
    // console.log("filter data");

    let arr = [...allBills];

    if (subAreaIds.length) {
      arr = allBills.filter((bill) =>
        subAreaIds.includes(bill.customer?.subArea)
      );
    }
    if (collectorIds.length) {
      arr = arr.filter((bill) => collectorIds.includes(bill.user));
    }
    if (billType) {
      arr = arr.filter((bill) => bill.billType === billType);
    }

    arr = arr.filter(
      (item) =>
        Date.parse(item.createdAt) >= Date.parse(dateStart) &&
        Date.parse(item.createdAt) <= Date.parse(dateEnd)
    );

    setMainData(arr);
    // setMainData2(arr);
  };

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

  let subArea, collector;
  if (singleArea && subAreaIds.length === 1) {
    subArea = singleArea?.subAreas?.find((item) => item.id === subAreaIds[0]);
  }

  if (collectorIds.length === 1 && collectors.length > 0) {
    collector = collectors.find((item) => item.user === collectorIds[0]);
  }

  const filterData = {
    area: singleArea?.name ? singleArea.name : "সকল",
    subArea: subArea ? subArea.name : "সকল",
    collector: collector?.name ? collector.name : "সকল",
    startDate: dateStart,
    endDate: dateEnd,
    totalBill: mainData.reduce((prev, current) => prev + current.amount, 0),
  };

  const columns = useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "আইডি",
        accessor: "customer.customerId",
      },
      {
        Header: "গ্রাহক",
        accessor: "customer.name",
      },
      {
        Header: "প্যাকেজ",
        accessor: "customer.mikrotikPackage.name",
      },
      {
        Header: "বিল",
        accessor: "amount",
      },

      {
        Header: "তারিখ",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YYYY hh:mm:ss A");
        },
      },
    ],
    []
  );

  const customComponent = (
    <div style={{ fontSize: "20px" }}>মোট বিলঃ {addAllBills()} টাকা</div>
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
                  <div>বিল রিপোর্ট</div>
                  <ReactToPrint
                    documentTitle="বিল রিপোর্ট"
                    trigger={() => (
                      <button
                        className="header_icon border-0"
                        type="button"
                        title="ডাউনলোড পিডিএফ"
                      >
                        <PrinterFill />
                      </button>
                    )}
                    content={() => componentRef.current}
                  />
                </div>
              </FourGround>

              {/* Model start */}

              {/* Model finish */}

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    {/* filter selector */}
                    <div className="selectFilteringg">
                      <div style={{ margin: "0 5px" }} className="dateDiv">
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
                      </div>

                      <div style={{ margin: "0 5px" }} className="dateDiv">
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
                      </div>

                      {userRole !== "collector" && (
                        <div style={{ margin: "0 5px" }} className="dateDiv  ">
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
                        </div>
                      )}

                      <div style={{ margin: "0 5px" }} className="dateDiv">
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
                      <div style={{ margin: "0 5px" }} className="dateDiv">
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
                      <div style={{ margin: "0 5px" }} className="dateDiv  ">
                        <select
                          className="form-select mw-100"
                          onChange={(e) => setBillType(e.target.value)}
                        >
                          <option value="" defaultValue>
                            বিল টাইপ{" "}
                          </option>

                          <option value="connectionFee">সংযোগ ফি</option>
                          <option value="bill">মাসিক বিল</option>
                        </select>
                      </div>
                      <div>
                        <button
                          className="btn btn-outline-primary w-140 mt-2"
                          type="button"
                          onClick={onClickFilter}
                        >
                          ফিল্টার
                        </button>
                      </div>
                    </div>
                    <div className="submitdiv d-flex justify-content-end">
                      {/* <ReactToPrint
                        documentTitle="বিল রিপোর্ট"
                        trigger={() => (
                          <button
                            className="btn fs-5 btn-primary"
                            type="button"
                            title="ডাউনলোড পিডিএফ"
                          >
                            <PrinterFill />
                          </button>
                        )}
                        content={() => componentRef.current}
                      /> */}
                      {/* print report */}
                      <div style={{ display: "none" }}>
                        <PrintReport
                          filterData={filterData}
                          currentCustomers={mainData}
                          ref={componentRef}
                        />
                      </div>
                      {/* print report end*/}
                    </div>
                  </div>
                  {/* table */}

                  <Table
                    customComponent={customComponent}
                    columns={columns}
                    data={mainData}
                  ></Table>
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
