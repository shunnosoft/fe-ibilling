import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { badge } from "../../components/common/Utils";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getStaticCustomer } from "../../features/apiCalls";
import moment from "moment";
import CustomerDetails from "../Customer/customerCRUD/CustomerDetails";
import CustomerBillCollect from "../Customer/customerCRUD/CustomerBillCollect";
import CustomerReport from "../Customer/customerCRUD/showCustomerReport";
import CustomerEdit from "../Customer/customerCRUD/CustomerEdit";
import Table from "../../components/table/Table";
// get specific customer

import {
  PersonPlusFill,
  Wallet,
  ThreeDots,
  ArchiveFill,
  PenFill,
  PersonFill,
  ArrowDownUp,
  ArrowRightShort,
  CashStack,
  FileExcelFill,
  PrinterFill,
} from "react-bootstrap-icons";

const StaticActiveCustomer = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const [singleCustomer, setSingleCustomer] = useState("");
  const [customerReportData, setId] = useState([]);
  const role = useSelector((state) => state?.persistedReducer?.auth?.role);
  const permission = useSelector(
    (state) => state?.persistedReducer?.auth?.userData?.permissions
  );
  const staticActiveCustomer = useSelector(
    (state) => state?.persistedReducer?.customer?.staticCustomer
  );
  console.log(staticActiveCustomer);

  const data = staticActiveCustomer.filter((item) => item.queue.target);
  console.log(data);

  const ispOwner = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  console.log(ispOwner);

  useEffect(() => {
    getStaticCustomer(dispatch, ispOwner, setIsloading);
  }, []);

  // get specific customer
  const getSpecificCustomer = (id) => {
    if (data.length !== undefined) {
      const temp = data.find((original) => {
        return original.id === id;
      });
      setSingleCustomer(temp);
    }
  };

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
