import moment from "moment";
import React, { useEffect, useState } from "react";
import apiLink from "../../../api/apiLink";
// import TdLoader from "../../../components/common/TdLoader";
// import Pagination from "../../../components/Pagination";
import TdLoader from "../../../components/common/TdLoader";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { toast } from "react-toastify";

import { TrashFill } from "react-bootstrap-icons";
export default function CustomerReport({ single }) {
  const [customerReport, setCustomerReport] = useState([]);
  const [canDelete, setDelete] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCustoemrReport = async () => {
      setIsLoading(true);
      try {
        const res = await apiLink(`/bill/customer/${single?.id}`);
        const data = await res.data;
        setCustomerReport(data);
        setIsLoading(false);
      } catch (err) {
        console.log("Error to get report: ", err);
        setIsLoading(false);
      }
    };
    single?.id && getCustoemrReport();
  }, [single]);

  // useEffect(() => {
  //   const getDeleteStatus = localStorage.getItem("canDeleteReport");
  //   if (getDeleteStatus == "false") {
  //     setTimeout(() => {
  //       setDelete(true);
  //       localStorage.setItem("canDeleteReport", true);
  //     }, 1000 * 60 * 5);
  //   }
  // }, []);

  const deletReport = async (reportId) => {
    if (canDelete) {
      try {
        // const res = await apiLink(`/bill/customer/${single?.id}/${reportId}`);
        // const updatedState = customerReport.filter(
        //   (item) => item.id !== res.data.id
        // );
        // setCustomerReport(updatedState);
        // toast.error("রিপোর্ট ডিলিট সফল হয়েছে");
        setDelete(false);
        setTimeout(() => {
          setDelete(true);
        }, 1000 * 60 * 5);
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.log(error);
      }
    } else {
      toast.error("একটু পরে আবার চেষ্টা করুন");
    }
  };

  // const date = new Date(new Date(Date.now()).toLocaleDateString());
  // const prevDays = moment().subtract(7, "d");
  // const r = moment().isAfter(moment().subtract(7, "d"));

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
                <table className="table table-striped text-center">
                  <thead>
                    <tr className="spetialSortingRow">
                      <th scope="col">প্যাকেজ</th>
                      <th scope="col">বিল</th>
                      <th scope="col">তারিখ</th>
                      <th scope="col">সময়</th>
                      <th scope="col">একশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <TdLoader colspan={5} />
                    ) : customerReport.length > 0 ? (
                      customerReport.map((val, index) => (
                        <tr className="spetialSortingRow" key={index}>
                          <td>{single.pppoe.profile}</td>
                          <td>{FormatNumber(val.amount)}</td>
                          <td>{moment(val.createdAt).format("DD-MM-YYYY")}</td>
                          <td>{moment(val.createdAt).format("hh:mm:ss A")}</td>

                          {/* <td className="text-center">
                            <div title="ডিলিট রিপোর্ট">
                              <button
                                className="border-0 bg-transparent"
                                onClick={() => deletReport(val.id)}
                              >
                                <TrashFill
                                  color="#dc3545"
                                  style={{ cursor: "pointer" }}
                                />
                              </button>
                            </div>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <td colSpan={5}>
                        <h5 className="text-center">কোন ডাটা পাওয়া যাই নি !</h5>
                      </td>
                    )}
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
