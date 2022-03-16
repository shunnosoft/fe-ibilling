// external imports
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ThreeDotsVertical } from "react-bootstrap-icons";
// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { cardData } from "./homeData";
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
import { Formik, Form } from "formik";

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

  const chartsData = {
    // labels: ["Blue", "Yellow", "Green", "Purple", "Orange"],
    labels: collection,
    datasets: [
      {
        label: "Count",
        data: count,
        backgroundColor: ["purple", "yellow", "green", "blue"],
        borderColor: "#0cc30c",
        borderWidth: 2,
        fill: "origin",
        backgroundColor: "rgb(110 110 110 / 24%)",
      },
      {
        labels: "এমাউন্ট",
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
    getCharts(dispatch, ispOwnerId);
  }, [dispatch, ispOwnerId, role, userData]);

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
  }, []);

  const currentYear = new Date().getFullYear();

  const handleFilterHandler = () => {
    const collectorValue = document.getElementById("filterCollector").value;
    const YearValue = document.getElementById("filterYear").value;
    const MonthValue = document.getElementById("filterMonth").value;

    if (collectorValue && YearValue && MonthValue) {
      const filterData = {
        Collector: collectorValue,
        Year: YearValue,
        Month: MonthValue,
      };
      console.log("Data: ", filterData);
    } else {
      toast.warning("সকল ফিল্টার  সিলেক্ট করুন");
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
                <select className="form-select" id="filterCollector">
                  <option value="">সকল কালেক্টর</option>
                  {collectors?.map((c, key) => (
                    <option key={key} value={c.user}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select className="form-select" id="filterYear">
                  <option value="">বছর</option>
                  <option value={currentYear - 1}>{currentYear - 1}</option>
                  <option value={currentYear}>{currentYear}</option>
                </select>
                <select className="form-select" id="filterMonth">
                  <option value="">মাস</option>
                  <option value="0">জানুয়ারি</option>
                  <option value="1">ফেব্রুয়ারি</option>
                  <option value="2">মার্চ</option>
                  <option value="3">এপ্রিল</option>
                  <option value="4">মে</option>
                  <option value="5">জুন</option>
                  <option value="6">জুলাই</option>
                  <option value="7">আগস্ট</option>
                  <option value="8">সেপ্টেম্বর</option>
                  <option value="9">অক্টোবর</option>
                  <option value="10">নভেম্বর</option>
                  <option value="11">ডিসেম্বর</option>
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
