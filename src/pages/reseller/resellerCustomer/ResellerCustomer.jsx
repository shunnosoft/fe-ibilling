import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { FontColor, FourGround } from "../../../assets/js/theme";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { badge } from "../../../components/common/Utils";
import { getResellerCustomer } from "../../../features/resellerCustomerAdminApi";
import useDash from "../../../assets/css/dash.module.css";
import Table from "../../../components/table/Table";

const ResellerCustomer = () => {
  // get id from route
  const { resellerId } = useParams();

  // import dispatch
  const dispatch = useDispatch();

  // loading local state
  const [isLoading, setIsLoading] = useState(false);

  // status local state
  const [filterStatus, setFilterStatus] = useState(null);

  // payment status state
  const [filterPayment, setFilterPayment] = useState(null);

  // get all data from redux state
  let resellerCustomer = useSelector(
    (state) => state?.persistedReducer?.resellerCustomer?.resellerCustomer
  );

  // get all reseller customer api call
  useEffect(() => {
    getResellerCustomer(dispatch, resellerId, setIsLoading);
  }, []);

  // status filter
  if (filterStatus && filterStatus !== "স্ট্যাটাস") {
    resellerCustomer = resellerCustomer.filter(
      (value) => value.status === filterStatus
    );
  }

  // payment status filter
  if (filterPayment && filterPayment !== "পেমেন্ট") {
    resellerCustomer = resellerCustomer.filter(
      (value) => value.paymentStatus === filterPayment
    );
  }

  // table column
  const columns = React.useMemo(
    () => [
      {
        Header: "আইডি",
        accessor: "customerId",
      },
      {
        Header: "নাম",
        accessor: "name",
      },
      {
        Header: "PPPoE",
        accessor: "pppoe.name",
      },
      {
        Header: "মোবাইল",
        accessor: "mobile",
      },

      {
        Header: "স্ট্যাটাস",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        Header: "পেমেন্ট",
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        Header: "মাসিক ফি",
        accessor: "monthlyFee",
      },
      {
        Header: "ব্যালান্স",
        accessor: "balance",
      },
      {
        Header: "বিল সাইকেল",
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("DD-MM-YY hh:mm A");
        },
      },
    ],
    []
  );

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">গ্রাহক </h2>
              </FourGround>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-row justify-content-center">
                    {/* status filter */}
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(event) => setFilterStatus(event.target.value)}
                    >
                      <option selected>স্ট্যাটাস</option>
                      <option value="active">এক্টিভ</option>
                      <option value="inactive">ইন-এক্টিভ</option>
                      <option value="expired">এক্সপায়ার্ড</option>
                    </select>
                    {/* end status filter */}

                    {/* payment status filter */}
                    <select
                      className="form-select ms-4"
                      aria-label="Default select example"
                      onChange={(event) => setFilterPayment(event.target.value)}
                    >
                      <option selected>পেমেন্ট</option>
                      <option value="paid">পেইড</option>
                      <option value="unpaid">আন-পেইড</option>
                    </select>
                    {/* end payment status filter */}
                  </div>
                  {/* call table component */}
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={resellerCustomer}
                  />
                </div>
              </div>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResellerCustomer;
