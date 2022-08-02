import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ToastContainer } from "react-toastify";
import { XCircle, CheckCircle, ArrowClockwise } from "react-bootstrap-icons";

import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import {
  getSmsRequestHistory,
  acceptedStatus,
} from "../../features/resellerSmsRequestApi";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";

const ResellerSmsRequest = () => {
  const { t } = useTranslation();
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

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // reload handler
  const reloadHandler = () => {
    getSmsRequestHistory(ispOwnerId, dispatch, setIsLoading);
  };

  // api call
  useEffect(() => {
    if (data.length === 0)
      getSmsRequestHistory(ispOwnerId, dispatch, setIsLoading);
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
  const columns = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("name"),
        accessor: "reseller.name",
      },
      {
        width: "12%",
        Header: t("amount"),
        accessor: "smsAmount",
      },
      {
        width: "15%",
        Header: t("moneyAmount"),
        accessor: "smsCost",
      },
      {
        width: "15%",
        Header: t("status"),
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
        width: "23%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ row: { original } }) =>
          moment(original.createdAt).format("MMM DD YYYY hh:mm a"),
      },
      {
        width: "10%",
        Header: () => <div className="text-center">{t("action")}</div>,
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
              </>
            )}
          </div>
        ),
      },
    ],
    [t]
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("resellerSmsRequest")}</div>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div className="table-section">
                      <Table
                        isLoading={isLoading}
                        data={data}
                        columns={columns}
                      />
                    </div>
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResellerSmsRequest;
