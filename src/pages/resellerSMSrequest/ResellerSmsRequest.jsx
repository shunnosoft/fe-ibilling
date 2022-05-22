import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import {
  getSmsRequestHistory,
  acceptedStatus,
} from "../../features/resellerSmsRequestApi";
import {
  PersonBoundingBox,
  PersonFill,
  PenFill,
  ThreeDots,
} from "react-bootstrap-icons";
import moment from "moment";
import Table from "../../components/table/Table";

const ResellerSmsRequest = () => {
  const dispatch = useDispatch();

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer?.auth?.currentUser?.ispOwner?.id
  );

  const data = useSelector(
    (state) => state?.persistedReducer?.resellerSmsRequest?.requestSmsHistory
  );
  console.log(data);

  useEffect(() => {
    getSmsRequestHistory(ispOwnerId, dispatch);
  }, []);

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
    console.log(data);
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
      Header: () => <div className="text-center">Action</div>,
      id: "option",

      Cell: ({ row: { original } }) => (
        <div className="text-center">
          <>
            {original.status === "pending" && (
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
            )}

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
                    <PersonFill />
                    <p className="actionP">Accept</p>
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
                    <PenFill />
                    <p className="actionP">Reject</p>
                  </div>
                </div>
              </li>
            </ul>
          </>
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
