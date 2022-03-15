import moment from "moment";
import React, { useEffect, useState } from "react";
import apiLink from "../../../api/apiLink";
// import TdLoader from "../../../components/common/TdLoader";
// import Pagination from "../../../components/Pagination";
import "../customer.css";

export default function CustomerReport({ single }) {
  console.log("Single: ", single);
  const [mainData ,setMaindata] =useState([])

  console.log(mainData)

  useEffect(()=>{
    const getReport = async () =>{
      try {
        const res = await apiLink.get(`/v1/bill/customer/${"6209346cf896731c26ecca51"}`)
        console.log(res.data)
        setMaindata(res.data)

        
      } catch (error) {
        console.log(error)
        
      }
    }
    getReport()
  },[single])
  //todo
  return (
    <div>
      <div
        className="modal fade"
        id="showCustomerReport"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                {single?.name} - রিপোর্ট
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive-lg">
                <table className="table table-striped ">
                  <thead>
                    <tr className="spetialSortingRow">
                      <th scope="col">বিল</th>

                      <th scope="col">তারিখ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mainData.map((val, key) => (
                      <tr key={key} id={val.id}>
                        <td>{val.amount}</td>
                        <td>{moment(val.createdAt).format("DD-MM-YYYY")}</td>

                        <td className="centeringTD"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
