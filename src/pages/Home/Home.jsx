// external imports
import React, { useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { ThreeDotsVertical } from "react-bootstrap-icons";

// internal imports
import "./home.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { cardData } from "./homeData";
import { chartsData } from "./homeData";
import { fetchMikrotik, fetchReseller, getArea, getCollector, getManger } from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {

  
  const ispOwnerId  =useSelector(state=>state.auth.currentUser?.ispOwner?.id)
  const dispatch =useDispatch()
   
  useEffect(()=>{
    getManger(dispatch,ispOwnerId);  
    getCollector(dispatch,ispOwnerId)
    getArea(dispatch,ispOwnerId);
    fetchMikrotik(dispatch,ispOwnerId)
    fetchReseller(dispatch,ispOwnerId)
  },[dispatch,ispOwnerId])

  return (
    <div className="container homeWrapper">
      <FontColor>
        <div className="home">
          {/* card section */}
          <div className="row">
            <h2 className="dashboardTitle">Dashboard</h2>
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
          <h2 className="dashboardTitle mt-2">Charts</h2>
          <FourGround>
            <h3 className="chartTitle">Our clients activity</h3>
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

          {/* collector section */}
          <h2 className="dashboardTitle mt-2">Collector</h2>
          <FourGround>
            <div className="table-responsive-lg tableWrapper">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">First</th>
                    <th scope="col">Second</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                    <th scope="col">bundle</th>
                    <th scope="col">Thandle</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                  </tr>
                  <tr>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    <td>@mdo</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FourGround>
        </div>
      </FontColor>
    </div>
  );
}
