// external imports
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ThreeDotsVertical } from "react-bootstrap-icons";
// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { cardData, monthsName } from "./homeData";
import {
  fetchMikrotik,
  fetchReseller,
  getAllBills,
  getArea,
  getCollector,
  getManger,
} from "../../features/apiCalls";
import { getCharts } from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { managerFetchSuccess } from "../../features/managerSlice";

export default function Home() {
  const role = useSelector((state) => state.auth.role);
  const ispOwnerId = useSelector((state) => state.auth.ispOwnerId);
  const allCollector = useSelector((state) => state.collector.collector);
  const manager = useSelector((state) => state.manager.manager);
  const userData = useSelector((state) => state.auth.userData);
  const ChartsData = useSelector((state) => state.chart.charts);
  const [label, setLabel] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [collection, setCollection] = useState([]);
  const [count, setCount] = useState([]);
  const dispatch = useDispatch();

  const date = new Date();

  const [currentCollector, setCurrentCollector] = useState("");
  const [Year, setYear] = useState(date.getFullYear());
  const [Month, setMonth] = useState(date.getMonth());

  const chartsData = {
    // labels: ["Blue", "Yellow", "Green", "Purple", "Orange"],
    labels: collection,
    datasets: [
      {
        label: "বিল",
        data: count,
        backgroundColor: ["purple", "yellow", "green", "blue"],
        borderColor: "#0cc30c",
        borderWidth: 2,
        fill: "origin",
        // backgroundColor: "rgb(110 110 110 / 24%)",
      },
      {
        label: "এমাউন্ট",
        data: label,
        backgroundColor: "rgb(110 110 110 / 24%)",
        borderJoinStyle: "round",
        borderColor: "#00a4e3",
        // borderCapStyle: "bevel" || "round" || "miter",
        fill: "origin",
        borderWidth: 2,
      },
    ],
  };

  // select colloectors
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
  }, [allCollector, manager]);

  useEffect(() => {
    if (role === "ispOwner") {
      getManger(dispatch, ispOwnerId);
      fetchReseller(dispatch, ispOwnerId);
    }
    if (role === "manager") {
      dispatch(managerFetchSuccess(userData));
    }

    if (role === "ispOwner" || role === "manager") {
      getCollector(dispatch, ispOwnerId);
      getAllBills(dispatch, ispOwnerId);
      fetchMikrotik(dispatch, ispOwnerId);
    }

    //for all roles
    getArea(dispatch, ispOwnerId);
    // getArea(dispatch, IDBOpenDBRequest)
    if (role === "collector") {
      getCharts(dispatch, ispOwnerId, Year, Month, userData?.user);
    } else {
      getCharts(dispatch, ispOwnerId, Year, Month);
    }
  }, [dispatch, ispOwnerId, role, userData, Month, Year]);

  useEffect(() => {
    let tempArr = [],
      tempCollection = [],
      tempCount = [];

    ChartsData?.forEach((val) => {
      tempArr.push(val.total);
      tempCollection.push(val._id);
      tempCount.push(val.count);
    });

    setLabel(tempArr);
    setCollection(tempCollection);
    setCount(tempCount);
  }, [ChartsData]);

  const handleFilterHandler = () => {
    if (role === "collector") {
      getCharts(dispatch, ispOwnerId, Year, Month, userData?.user);
    } else {
      getCharts(dispatch, ispOwnerId, Year, Month, currentCollector);
    }
  };

  return (
    <div className="container homeWrapper">
      <ToastContainer position="top-right" theme="colored" />
      <FontColor>
        <div className="home">
          {/* card section */}
          <div className="row">
            <h2 className="dashboardTitle">ড্যাশবোর্ড</h2>
            {cardData.map((val, key) => {
              return (
                <div className="col-md-3" key={key}>
                  <div id={val.classnam} className="dataCard">
                    <ThreeDotsVertical className="ThreeDots" />
                    <div className="cardIcon">{val.icon}</div>
                    <div className="chartSection">
                      <p>{val.title}</p>
                      <h2>{val.balance}</h2>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* chart section */}
          {/* <h2 className="dashboardTitle mt-2">কালেকশন</h2> */}
          <br />
          <FourGround>
            <div className="ChartsHeader">
              <h3 className="chartTitle">কালেকশন</h3>
              <div className="ChartsFilter">
                {role === "collector" ? (
                  ""
                ) : (
                  <select
                    className="form-select"
                    onChange={(e) => setCurrentCollector(e.target.value)}
                  >
                    <option value="">সকল কালেক্টর</option>
                    {collectors?.map((c, key) => (
                      <option key={key} value={c.user}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  className="form-select"
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value={Year}>{Year}</option>
                  <option value={Year - 1}>{Year - 1}</option>
                </select>
                <select
                  className="form-select"
                  value={Month}

                  onChange={(e) => setMonth(e.target.value)}
                >
                  {monthsName.map((val, index) => (
                    <option
                      // selected={index === Month ? true : false}
                      value={index}
                      key={index}
                    >
                      {val}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleFilterHandler}
                >
                  সাবমিট
                </button>
              </div>
            </div>
            <div className="lineChart">
              <Line
                data={chartsData}
                height={400}
                width={600}
                options={{
                  tension: 0.4,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </FourGround>
        </div>
      </FontColor>
    </div>
  );
}
