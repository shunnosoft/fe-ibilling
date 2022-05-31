import moment from "moment";
import React, { useEffect, useState } from "react";
import apiLink from "../../../api/apiLink";
// import TdLoader from "../../../components/common/TdLoader";
// import Pagination from "../../../components/Pagination";
// import TdLoader from "../../../components/common/TdLoader";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";

export default function CustomerReport({ single }) {
  console.log(single);
  const [customerReport, setCustomerReport] = useState([]);

  useEffect(() => {
    const getCustoemrReport = async () => {
      try {
        const res = await apiLink(`/bill/customer/${single?.id}`);
        const data = await res.data;
        setCustomerReport(data);
      } catch (err) {
        console.log("Error to get report: ", err);
      }
    };
    single?.id && getCustoemrReport();
  }, [single]);

  return (
    <div>
      <div
        className="modal fade"
        id="showCustomerReport"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog">
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
                      <th scope="col">প্যাকেজ</th>
                      <th scope="col">বিল</th>
                      <th scope="col">তারিখ</th>
                      <th scope="col">সময়</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerReport?.map((val, index) => (
                      <tr className="spetialSortingRow" key={index}>
                        <td>{single.pppoe.profile}</td>
                        <td>{FormatNumber(val.amount)}</td>
                        <td>{moment(val.createdAt).format("DD-MM-YYYY")}</td>
                        <td>{moment(val.createdAt).format("hh:mm:ss A")}</td>
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
