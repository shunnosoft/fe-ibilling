import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import useDash from "../../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../../assets/js/theme";
import {
  ArrowClockwise,
  FilterCircle,
  PeopleFill,
} from "react-bootstrap-icons";
import Loader from "../../../components/common/Loader";
import Table from "../../../components/table/Table";
import { Accordion } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getNetFeeCronLog } from "../../../features/apiCallAdmin";
import { badge } from "../../../components/common/Utils";
import moment from "moment";
import UserCronLog from "./UserCronLog";

const CronLog = () => {
  const dispatch = useDispatch();

  //---> Get netFee cron log from redux store
  const cronJobLog = useSelector((state) => state.adminNetFeeSupport?.cronLog);

  //===============|| Local State ||===============//
  const [isLoading, setIsLoading] = useState(false);
  const [activeKeys, setActiveKeys] = useState("");
  const [cronLogData, setCronLogData] = useState({});
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    getNetFeeCronLog(dispatch, setIsLoading);
  }, []);

  const reloadHandler = () => {
    getNetFeeCronLog(dispatch, setIsLoading);
  };

  const columns = useMemo(
    () => [
      {
        width: "3%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "Job Name",
        width: "15%",
        accessor: "jobName",
      },
      {
        Header: "Owner",
        width: "8%",
        accessor: "ispOwnerCount",
      },
      {
        Header: "Reseller",
        width: "8%",
        accessor: "resellerCount",
      },
      {
        Header: "Duration",
        width: "7%",
        accessor: "duration",
      },
      {
        width: "7%",
        Header: "Job",
        accessor: "jobType",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "7%",
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "15%",
        Header: "Start Date",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
      {
        width: "15%",
        Header: "End Date",
        accessor: "updatedAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
      {
        width: "5%",
        Header: "Action",
        id: "option",
        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <button
              className="btn btn-sm btn-outline-info p-1"
              title="Users"
              onClick={() => {
                setShow(true);
                setCronLogData(original);
                setModalStatus("userCronLog");
              }}
            >
              <PeopleFill size={19} />
            </button>
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
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="component_name">Cron Log</div>

                  <div className="d-flex align-items-center">
                    <div
                      onClick={() => {
                        if (!activeKeys) {
                          setActiveKeys("filter");
                        } else {
                          setActiveKeys("");
                        }
                      }}
                      title="Filter"
                    >
                      <FilterCircle className="addcutmButton" />
                    </div>

                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title="Refresh"
                          onClick={reloadHandler}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="displayGrid6">
                          <div className="displayGrid1">
                            <button
                              className="btn btn-outline-primary"
                              type="button"
                              //   onClick={handleActiveFilter}
                            >
                              Filter
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              //   onClick={handleFilterReset}
                            >
                              Reset
                            </button>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="collectorWrapper pb-2">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={cronJobLog}
                    />
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>

      {/* User Cron Job Log Dialog */}
      {modalStatus === "userCronLog" && (
        <UserCronLog {...{ show, setShow, cron: cronLogData }} />
      )}
    </>
  );
};

export default CronLog;
