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
      Header: "পরিমান",
      accessor: "smsAmount",
    },
    {
      Header: "টাকার পরিমান",
      accessor: "smsCost",
    },
    {
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
      Header: "তারিখ",
      accessor: "createdAt",
      Cell: ({ row: { original } }) =>
        moment(original.createdAt).format("DD-MM-YYYY"),
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
                <h2 className="collectorTitle">এসএমএস হিস্ট্রি</h2>
              </FourGround>
              <div class="card">
                <div class="card-body">
                  <div className="parchase-btn d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#smsRechargeModal"
                    >
                      এসএমএস কিনুন
                    </button>
                  </div>
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
