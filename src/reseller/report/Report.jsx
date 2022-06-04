import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import arraySort from "array-sort";
import { ArrowDownUp } from "react-bootstrap-icons";
import { getAllBills } from "../../features/apiCallReseller";
import FormatNumber from "../../components/common/NumberFormat";
import Table from "../../components/table/Table";

export default function Report() {
  // const cus = useSelector(state => state.customer.customer);
  // console.log(cus.length)

  const subAreas = useSelector((state) => state.persistedReducer.area.area);
  const allCollector = useSelector(
    (state) => state.persistedReducer.collector.collector
  );

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);
  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);

  const allBills = useSelector(
    (state) => state.persistedReducer.payment.allBills
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  // const [singleArea, setArea] = useState({});
  const [subAreaIds, setSubArea] = useState([]);
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const [mainData, setMainData] = useState(allBills);
  const [mainData2, setMainData2] = useState(allBills);
  const [collectors, setCollectors] = useState([]);
  const [collectorIds, setCollectorIds] = useState([]);
  // const [cusSearch, setCusSearch] = useState("");
  // const ispOwnerId = useSelector(state => state.auth?.ispOwnerId);
  const [isSorted, setSorted] = useState(false);
  // const [totalBill,setTotalBill]= useState("")
  const [currentPage, setCurrentPage] = useState(1);

  const [customerPerPage, setCustomerPerPage] = useState(50);
  const lastIndex = currentPage * customerPerPage;
  const firstIndex = lastIndex - customerPerPage;

  const currentCustomers = mainData.slice(firstIndex, lastIndex);
  const dispatch = useDispatch();

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    getAllBills(dispatch, userData.id);
    setSubArea(subAreas.map((i) => i.id));

    if (collectors.length === allCollector.length) {
      const { user, name, id } = userData;
      collectors.unshift({ name, user, id });
    }
  }, [dispatch, userData, subAreas, allCollector, collectors]);

  useEffect(() => {
    let collectors = [];

    allCollector.map((item) =>
      collectors.push({ name: item.name, user: item.user, id: item.id })
    );

    setCollectors(collectors);

    let collectorUserIdsArr = [];
    collectors.map((item) => collectorUserIdsArr.push(item.user));
    setCollectorIds(collectorUserIdsArr);
  }, [allCollector]);

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

  const onChangeSubArea = (id) => {
    if (!id) {
      setSubArea(subAreas.map((i) => i.id));
    } else {
      setSubArea([id]);
    }
  };

  const onClickFilter = () => {
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
                        onChange={(e) => onChangeSubArea(e.target.value)}
                      >
                        <option value="" defaultValue>
                          সকল এরিয়া{" "}
                        </option>
                        {subAreas?.map((sub, key) => (
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
                  </div>
                  {/* table */}

                  <Table columns={columns} data={currentCustomers}></Table>
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
