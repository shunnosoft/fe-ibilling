import React, { useEffect, useState } from "react";
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
  PersonPlusFill,
  ThreeDots,
  Wallet,
} from "react-bootstrap-icons";
import TdLoader from "../../components/common/TdLoader";
import Pagination from "../../components/Pagination";
import Footer from "../../components/admin/footer/Footer";
import "../Customer/customer.css";
import "./report.css";
import { useDispatch } from "react-redux";
import { getAllBills } from "../../features/apiCalls";
import { useSelector } from "react-redux";

export default function Report() {
  const allArea = useSelector((state) => state.area.area);
  const allCollector = useSelector((state) => state.collector.collector);
  const manager = useSelector((state) => state.manager.manager);

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  const allBills = useSelector((state) => state.payment.allBills);

  const [singleArea, setArea] = useState({});
  const [subAreaIds, setSubArea] = useState([]);

  const [dateStart, setStartDate] = useState(firstDay);
  const [dateEnd, setEndDate] = useState(today);
  const [mainData, setMainData] = useState(allBills);
  const [mainData2, setMainData2] = useState(allBills);
  const [collectors, setCollectors] = useState([]);
  const [collectorIds, setCollectorIds] = useState([]);
  const [cusSearch, setCusSearch] = useState("");
  const ispOwnerId = useSelector((state) => state.auth?.ispOwnerId);

  const dispatch = useDispatch();

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

  useEffect(() => {
    getAllBills(dispatch, ispOwnerId);
  }, [ispOwnerId, dispatch]);

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

    console.log(arr);

    setMainData(arr);
    setMainData2(arr);
  };

  const onSearch = (e) => {
    console.log(e);
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

                      <div className="dateDiv">
                        <label htmlFor="start">শুরুর তারিখ</label>
                        <input
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
                        <label htmlFor="end">শেষের তারিখ</label>
                        <input
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
                          বিলঃ<span className="allCollectorSpan">{0} টাকা</span>
                          আদায়ঃ
                          <span className="allCollectorSpan">{10} টাকা</span>
                          বকেয়াঃ
                          <span className="allCollectorSpan">{10} টাকা</span>
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
                            // onClick={() => toggleSort("customerId")}
                            scope="col"
                          >
                            আইডি
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            //   onClick={() => toggleSort("name")}
                            scope="col"
                          >
                            গ্রাহক
                            <ArrowDownUp className="arrowDownUp" />
                          </th>
                          <th
                            //    onClick={() => toggleSort("mobile")}
                            scope="col"
                          >
                            bill
                            <ArrowDownUp className="arrowDownUp" />
                          </th>

                          <th
                            // onClick={() => toggleSort("pppoe.profile")}
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
                            <tr key={key} id={val.id}>
                              <td>{val.customer.customerId}</td>
                              <td>{val.customer.name}</td>
                              <td>{val.amount}</td>
                              <td>
                                {moment(val.createdAt).format("DD-MM-YYYY")}
                              </td>

                              <td className="centeringTD">
                                <ThreeDots
                                  className="dropdown-toggle ActionDots"
                                  id="customerDrop"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                />

                                {/* modal */}
                                <ul
                                  className="dropdown-menu"
                                  aria-labelledby="customerDrop"
                                >
                                  <li
                                    data-bs-toggle="modal"
                                    data-bs-target="#showCustomerDetails"
                                    onClick={() => {
                                      //   getSpecificCustomer(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <PersonFill />
                                        <p className="actionP">প্রোফাইল</p>
                                      </div>
                                    </div>
                                  </li>
                                  {7 === "ispOwner" ? (
                                    ""
                                  ) : (
                                    <li
                                      data-bs-toggle="modal"
                                      data-bs-target="#collectCustomerBillModal"
                                      onClick={() => {
                                        // getSpecificCustomer(val.id);
                                      }}
                                    >
                                      <div className="dropdown-item">
                                        <div className="customerAction">
                                          <Wallet />
                                          <p className="actionP">বিল গ্রহণ</p>
                                        </div>
                                      </div>
                                    </li>
                                  )}

                                  <li
                                    data-bs-toggle="modal"
                                    data-bs-target="#customerEditModal"
                                    onClick={() => {
                                      //   getSpecificCustomer(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item">
                                      <div className="customerAction">
                                        <PenFill />
                                        <p className="actionP">এডিট</p>
                                      </div>
                                    </div>
                                  </li>

                                  <li
                                    onClick={() => {
                                      //   deleteCustomer(val.id);
                                    }}
                                  >
                                    <div className="dropdown-item actionManager">
                                      <div className="customerAction">
                                        <ArchiveFill />
                                        <p className="actionP">ডিলিট</p>
                                      </div>
                                    </div>
                                  </li>
                                </ul>

                                {/* end */}
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
