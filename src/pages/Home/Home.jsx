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
  getArea,
  getCollector,
  getManger,
} from "../../features/apiCalls";
import { getCharts } from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const role = useSelector((state) => state.auth.role);
  const ispOwnerId = useSelector((state) => state.auth.ispOwnerId);
  const userData = useSelector((state) => state.auth.userData);
  const ChartsData = useSelector((state) => state.chart.charts);
  const [labelsData, setLabelsData] = useState([]);
  const [currUserData, setCurrUserData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const ID = userData?.id;
    getCharts(dispatch, ID); //ispOwner Id Change with  current user id
  }, []);

  useEffect(() => {
    let tempArr = [];
    let tempUser = [];
    ChartsData?.forEach((val) => {
      tempArr.push(val.amount);
      tempUser.push(val.collectedBy);
    });
    console.log(tempArr, tempUser);
    setLabelsData(tempArr);
    setCurrUserData(tempUser);
  }, []);

  const chartsData = {
    // labels: ["Blue", "Yellow", "Green", "Purple", "Orange"],
    labels: currUserData,
    datasets: [
      // {
      //   label: "Users",
      //   data: [45, 221, 100, 83, 20, 150],
      //   backgroundColor: ["purple", "yellow", "green", "blue"],
      //   borderColor: "#0cc30c",
      //   borderWidth: 2,
      // },
      {
        label: "এক্টিভিটি",
        data: labelsData,
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
      fetchMikrotik(dispatch, ispOwnerId);
      fetchReseller(dispatch, ispOwnerId);
    }
    if (role === "ispOwner" || role === "manager") {
      getCollector(dispatch, ispOwnerId);
    }
    getArea(dispatch, ispOwnerId);
  }, [dispatch, ispOwnerId, role]);

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
          <h2 className="dashboardTitle mt-2">চার্ট</h2>
          <FourGround>
            <h3 className="chartTitle">এক্টিভিটি</h3>
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
