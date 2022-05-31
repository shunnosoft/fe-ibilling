import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { badge } from "../../components/common/Utils";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getStaticCustomer } from "../../features/apiCalls";
import moment from "moment";
import CustomerDetails from "../staticCustomer/customerCRUD/CustomerDetails";
import CustomerBillCollect from "../staticCustomer/customerCRUD/CustomerBillCollect";
import CustomerReport from "../staticCustomer/customerCRUD/showCustomerReport";
import CustomerEdit from "../staticCustomer/customerCRUD/CustomerEdit";
import Table from "../../components/table/Table";
// get specific customer

import {
  Wallet,
  ThreeDots,
  PenFill,
  PersonFill,
  CashStack,
} from "react-bootstrap-icons";

const StaticActiveCustomer = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const [singleCustomer, setSingleCustomer] = useState("");
  const [customerReportData, setId] = useState([]);

  // get user role
  const role = useSelector((state) => state?.persistedReducer?.auth?.role);

  // get user permission
  const permission = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.permissions
  );

  // get all static customer
  const staticActiveCustomer = useSelector(
    (state) => state?.persistedReducer?.customer?.staticCustomer
  );

  console.log(staticActiveCustomer);

  // get active static customer
  const data = staticActiveCustomer.filter((item) => item.queue.target);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  // api call for get update static customer
  useEffect(() => {
    getStaticCustomer(dispatch, ispOwner, setIsloading);
  }, []);

  // get specific customer
  const getSpecificCustomer = (id) => {
    setSingleCustomer(id);
  };

  // customer report handle
  const getSpecificCustomerReport = (reportData) => {
    setId(reportData);
  };

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
        Header: "IP",
        Cell: ({ row: { original } }) => (
          <>
            {original.userType === "simple-queue"
              ? original.queue.target
              : original.queue.name}
          </>
        ),
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
      {
        Header: () => <div className="text-center">অ্যাকশন</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="areaDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul className="dropdown-menu" aria-labelledby="customerDrop">
              <li
                data-bs-toggle="modal"
                data-bs-target="#showCustomerDetails"
                onClick={() => {
                  getSpecificCustomer(original.id);
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <PersonFill />
                    <p className="actionP">প্রোফাইল</p>
                  </div>
                </div>
              </li>
              {permission?.billPosting || role === "ispOwner" ? (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#collectCustomerBillModal"
                  onClick={() => {
                    getSpecificCustomer(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <Wallet />
                      <p className="actionP">বিল গ্রহণ</p>
                    </div>
                  </div>
                </li>
              ) : (
                ""
              )}

              {permission?.customerEdit || role === "ispOwner" ? (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#customerEditModal"
                  onClick={() => {
                    getSpecificCustomer(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">এডিট</p>
                    </div>
                  </div>
                </li>
              ) : (
                ""
              )}

              <li
                data-bs-toggle="modal"
                data-bs-target="#showCustomerReport"
                onClick={() => {
                  getSpecificCustomerReport(original);
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <CashStack />
                    <p className="actionP">রিপোর্ট</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        ),
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
              {/* modals */}
              <FourGround>
                <h2 className="collectorTitle">স্ট্যাটিক এক্টিভ গ্রাহক</h2>
              </FourGround>

              <Table isLoading={isLoading} columns={columns} data={data} />
            </FontColor>
          </div>
        </div>
      </div>
      <CustomerEdit single={singleCustomer} />
      <CustomerBillCollect single={singleCustomer} />
      <CustomerDetails single={singleCustomer} />
      <CustomerReport single={customerReportData} />
    </>
  );
};

export default StaticActiveCustomer;
