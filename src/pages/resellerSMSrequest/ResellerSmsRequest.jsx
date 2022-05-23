import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import {
  ThreeDots,
  ArrowRightCircle,
  Eraser,
  Check,
  XCircle,
  CheckCircle,
} from "react-bootstrap-icons";

import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import {
  getSmsRequestHistory,
  acceptedStatus,
} from "../../features/resellerSmsRequestApi";
import Table from "../../components/table/Table";

const ResellerSmsRequest = () => {
  // import dispatch
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer?.auth?.currentUser?.ispOwner?.id
  );

  // get reseller sms all data
  const data = useSelector(
    (state) => state?.persistedReducer?.resellerSmsRequest?.requestSmsHistory
  );
  console.log(data);

  // api call
  useEffect(() => {
    getSmsRequestHistory(ispOwnerId, dispatch);
  }, []);

  // handle submit
  const acceptHandle = (dataId, resellerId, status) => {
    let data;
    if (status === "pending") {
      data = {
        status: "accepted",
      };
    }
    if (status === "rejected") {
      data = {
        status: "rejected",
      };
    }
    // dispatch all data to api call
    acceptedStatus(resellerId, dataId, data, dispatch);
  };

  // table columns
  const columns = React.useMemo(() => [
    {
      Header: "নাম",
      accessor: "reseller.name",
    },
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
    {
      Header: () => <div className="text-center">অ্যাকশন</div>,
      id: "option",

      Cell: ({ row: { original } }) => (
        <div className="text-center">
          {original.status === "pending" && (
            <>
              <button
                className="btn btn-sm bg-success text-white shadow"
                onClick={() => {
                  acceptHandle(
                    original?.id,
                    original?.reseller?.id,
                    original?.status
                  );
                }}
              >
                <CheckCircle />
              </button>
              <button
                className="btn btn-sm bg-danger text-white shadow ms-2"
                onClick={() => {
                  acceptHandle(
                    original?.id,
                    original?.reseller?.id,
                    "rejected"
                  );
                }}
              >
                <XCircle />
              </button>
              {/* <ThreeDots
              className="dropdown-toggle ActionDots"
              id="areaDropdown"
              type="button"
              data-bs-toggle={original.status === "pending" && "dropdown"}
              aria-expanded="false"
            />

            <ul className="dropdown-menu" aria-labelledby="areaDropdown">
              <li
                onClick={() => {
                  acceptHandle(
                    original?.id,
                    original?.reseller?.id,
                    original?.status
                  );
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <ArrowRightCircle />
                    <p className="actionP">একসেপ্ট</p>
                  </div>
                </div>
              </li>

              <li
                onClick={() => {
                  acceptHandle(
                    original?.id,
                    original?.reseller?.id,
                    "rejected"
                  );
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <Eraser />
                    <p className="actionP">রিজেক্ট</p>
                  </div>
                </div>
              </li>
            </ul> */}
            </>
          )}
        </div>
      ),
    },
  ]);

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />

      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">রিসেলার এসএমএস রিকোয়েস্ট</h2>
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
    </>
  );
};

export default ResellerSmsRequest;
