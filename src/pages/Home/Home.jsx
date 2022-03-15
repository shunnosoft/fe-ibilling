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
  //   const ID = userData?.id;
  //   getCharts(dispatch, ID); //ispOwner Id Change with  current user id
  // }, [dispatch,userData]);

  
  useEffect(() => {
    const data = [
      {
        _id: 1,
        total: 18450,
        count: 67,
      },
      {
        _id: 2,
        total: 12150,
        count: 47,
      },
      {
        _id: 3,
        total: 18150,
        count: 68,
      },
      {
        _id: 4,
        total: 13200,
        count: 48,
      },
      {
        _id: 5,
        total: 8450,
        count: 32,
      },
      {
        _id: 6,
        total: 25750,
        count: 100,
      },
      {
        _id: 7,
        total: 19900,
        count: 75,
      },
      {
        _id: 8,
        total: 20730,
        count: 77,
      },
      {
        _id: 9,
        total: 18520,
        count: 74,
      },
      {
        _id: 10,
        total: 17280,
        count: 68,
      },
      {
        _id: 11,
        total: 15270,
        count: 61,
      },
      {
        _id: 12,
        total: 12630,
        count: 52,
      },
      {
        _id: 13,
        total: 11550,
        count: 45,
      },
      {
        _id: 14,
        total: 11630,
        count: 45,
      },
      {
        _id: 15,
        total: 15200,
        count: 61,
      },
      {
        _id: 16,
        total: 5600,
        count: 24,
      },
      {
        _id: 17,
        total: 9500,
        count: 35,
      },
      {
        _id: 18,
        total: 9850,
        count: 36,
      },
      {
        _id: 19,
        total: 6000,
        count: 23,
      },
      {
        _id: 20,
        total: 4150,
        count: 13,
      },
      {
        _id: 21,
        total: 9850,
        count: 35,
      },
      {
        _id: 22,
        total: 10050,
        count: 34,
      },
      {
        _id: 23,
        total: 4520,
        count: 19,
      },
      {
        _id: 24,
        total: 4870,
        count: 20,
      },
      {
        _id: 25,
        total: 4280,
        count: 17,
      },
      {
        _id: 26,
        total: 3750,
        count: 14,
      },
      {
        _id: 27,
        total: 4350,
        count: 20,
      },
    ];
    let tempArr = [],
      tempCollection = [],
      tempCount = [];
    data?.forEach((val) => {
      tempArr.push(val.total);
      tempCollection.push(val._id);
      tempCount.push(val.count);
    });

    setLabel(tempArr);
    setCollection(tempCollection);
    setCount(tempCount);
  }, []);

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
      fetchMikrotik(dispatch, ispOwnerId);
      fetchReseller(dispatch, ispOwnerId);
        
    }
    if (role==="manager") {
      dispatch(managerFetchSuccess(userData))

    }
    
    if (role === "ispOwner" || role === "manager") {
      getCollector(dispatch, ispOwnerId);
      getCharts(dispatch, userData?.id);
      
    }
    
    getArea(dispatch, ispOwnerId);
    
    //problem collector can't access them

    getAllBills(dispatch, ispOwnerId);
    getManger(dispatch, ispOwnerId);

  }, [dispatch, ispOwnerId, role, userData]);

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
