import moment from "moment";
import React, { useEffect, useState } from "react";
import apiLink from "../../../api/apiLink";
import TdLoader from "../../../components/common/TdLoader";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { toast } from "react-toastify";
import { TrashFill } from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import { editCustomerSuccess } from "../../../features/customerSlice";

export default function CustomerReport({ single }) {
  const [customerReport, setCustomerReport] = useState([]);
  const [canDelete, setDelete] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
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

  const deletReport = async (reportId) => {
    if (canDelete) {
      try {
        const res = await apiLink.delete(`/bill/monthlyBill/${reportId}`);
        console.log(res);
        const updatedState = customerReport.filter(
          (item) => item.id !== reportId
        );
        setCustomerReport(updatedState);
        dispatch(editCustomerSuccess(res.data.customer));
        toast.success("রিপোর্ট ডিলিট সফল হয়েছে");
        setDelete(false);
        setTimeout(() => {
          setDelete(true);
        }, 1000 * 60 * 2);
      } catch (error) {
        toast.error(error.response?.data?.message);
        console.log(error);
      }
    } else {
      toast.error("একটু পরে আবার চেষ্টা করুন");
    }
  };

  // customer:
  // address: "raj"
  // autoDisable: true
  // balance: -5800
  // billPayType: "prepaid"
  // billingCycle: "2022-06-25T17:59:00.590Z"
  // createdAt: "2022-04-27T08:56:18.024Z"
  // customerId: "1023"
  // email: "bashar@gmail.com"
  // id: "62690532d496062499b52c47"
  // ispOwner: {reference: {…}, settings: {…}, bpSettings: {…}, billCollectionType: 'prepaid', status: 'new', …}
  // mikrotik: "6252fa5d182934438bad188e"
  // mikrotikPackage: "628e6a29f6603aaa468f5968"
  // mobile: "01789213930"
  // monthlyFee: 5000
  // name: "hojafia"
  // nid: "123456789987654"
  // paymentStatus: "paid"
  // pppoe: {service: 'pppoe', disabled: false, name: 'bashar', password: 'hojaifa', comment: 'hello', …}
  // queue: {type: 'simple-queue', disabled: false}
  // status: "inactive"
  // subArea: "6268e21f8c1b12154e4963ed"
  // user: "6298c88d5f58bb76d578b9ad"
  // userType: "pppoe"

  // monthlyBill:
  // amount: 1300
  // billType: "bill"
  // collectedBy: "ispOwner"
  // collectorId: "624061bbaae58479466259a8"
  // createdAt: "2022-05-26T18:47:36.058Z"
  // customer: "62690532d496062499b52c47"
  // id: "628fcb483b28b86bcd83ef21"
  // ispOwner: "624061bbaae58479466259a8"
  // user: "624061b9aae58479466259a4"

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

                          {moment()
                            .subtract(7, "d")
                            .isBefore(moment(val.createdAt)) && (
                            <td className="text-center">
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
                            </td>
                          )}
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
