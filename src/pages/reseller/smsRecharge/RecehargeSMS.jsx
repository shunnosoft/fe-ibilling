import React, { useEffect } from "react";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import useDash from "../../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../../assets/js/theme";
// import
import { ToastContainer } from "react-toastify";
import RechargeModal from "./modal/RechargeModal";
import { useDispatch, useSelector } from "react-redux";
import { getParchaseHistory } from "../../../features/resellerParchaseSmsApi";
import moment from "moment";
import Table from "../../../components/table/Table";
const RecehargeSMS = () => {
  // import dispatch
  const dispatch = useDispatch();

  // ger resller id
  const resellerId = useSelector(
    (state) => state?.persistedReducer?.auth?.currentUser?.reseller?.id
  );

  // get data
  const data = useSelector(
    (state) => state?.persistedReducer?.smsHistory?.smsParchase
  );

  // get accept status
  const acceptStatus = data.filter((item) => item.status === "pending");

  // api call
  useEffect(() => {
    getParchaseHistory(resellerId, dispatch);
  }, []);

  // table columns
  const columns = React.useMemo(() => [
    {
      width: "25%",
      Header: "পরিমান",
      accessor: "smsAmount",
    },
    {
      width: "25%",
      Header: "টাকার পরিমান",
      accessor: "smsCost",
    },
    {
      width: "25%",
      Header: "স্ট্যাটাস",
      accessor: "status",
      Cell: ({ row: { original } }) => (
        <div>
          {original.status === "accepted" && (
            <span className="badge bg-success">{original.status}</span>
          )}
          {original.status === "pending" && (
            <span className="badge bg-warning">{original.status}</span>
          )}
          {original.status === "rejected" && (
            <span className="badge bg-danger">{original.status}</span>
          )}
        </div>
      ),
    },
    {
      width: "25%",
      Header: "তারিখ",
      accessor: "createdAt",
      Cell: ({ row: { original } }) =>
        moment(original.createdAt).format("MMM DD YYYY hh:mm a"),
    },
  ]);

  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied">
          <div className="container homeWrapper">
            <ToastContainer position="top-right" theme="colored" />
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div>এসএমএস হিস্ট্রি</div>
                  <div
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#smsRechargeModal"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-envelope-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
                      <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z" />
                    </svg>
                  </div>
                </div>
              </FourGround>
              <div class="card">
                <div class="card-body">
                  <div className="recdharge_sms">
                    <Table data={data} columns={columns} />
                  </div>
                </div>
              </div>
            </FontColor>
          </div>
        </div>
      </div>
      <RechargeModal status={acceptStatus} />
    </>
  );
};

export default RecehargeSMS;
