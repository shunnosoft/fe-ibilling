// external imports
import React, { useState, useEffect } from "react";
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

export default function Home() {
  const role = useSelector((state) => state.auth.role);
  const ispOwnerId = useSelector((state) => state.auth.ispOwnerId);
  const userData = useSelector((state) => state.auth.userData);
  const ChartsData = useSelector((state) => state.chart.charts);
  const [label, setLabel] = useState([]);
  const [collection, setCollection] = useState([]);
  const [count, setCount] = useState([]);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   getCharts(dispatch, ispOwnerId);
  // }, [dispatch]);

  const chartsData = {
    // labels: ["Blue", "Yellow", "Green", "Purple", "Orange"],
    labels: collection,
    datasets: [
      // {
      //   label: "Users",
      //   data: [45, 221, 100, 83, 20, 150],
      //   backgroundColor: ["purple", "yellow", "green", "blue"],
      //   borderColor: "#0cc30c",
      //   borderWidth: 2,
      //   fill: "origin",
      //   backgroundColor: "rgb(110 110 110 / 24%)",
      // },
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

  return (
    <div className="container homeWrapper">
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
          <FourGround>
            <h3 className="chartTitle">কালেকশন</h3>
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
