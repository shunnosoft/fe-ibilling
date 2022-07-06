import React, { useState } from "react";
import { FontColor, FourGround } from "../../assets/js/theme";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getActvityLog } from "../../features/activityLogApi";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";
import moment from "moment";
import { Eye } from "react-bootstrap-icons";
import Details from "./modal/Details";
import Table from "../../components/table/Table";

const ActivityLog = () => {
  // import dispatch
  const dispatch = useDispatch();

  // initial loading state
  const [isLoading, setIsLoading] = useState(false);

  // initial comment id state
  const [activityLogId, setActivityLogId] = useState();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  // get all data from redux
  const data = useSelector(
    (state) => state?.persistedReducer?.activityLog?.activityLog
  );

  console.log(data);

  // get owner users
  const ownerUsers = useSelector(
    (state) => state?.persistedReducer?.ownerUsers?.ownerUser
  );

  // api call
  useEffect(() => {
    getOwnerUsers(dispatch, ispOwnerId);
    getActvityLog(dispatch, setIsLoading, ispOwnerId);
  }, []);

  // table columns
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        id: "row",
        width: "8%",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "name",
        width: "20%",
        accessor: "user",
        Cell: ({ cell: { value } }) => {
          const performer = ownerUsers.find((item) => item[value]);

          return <div>{performer && performer[value].name}</div>;
        },
      },

      {
        Header: "অ্যাকশন",
        width: "62%",
        accessor: (value) => {
          return (
            <div>
              <span>{value.action}</span>
              <span className="text-primary"> at </span>
              <small className="text-secondary">
                {moment(value.createdAt).format("MMM DD YYYY hh:mm A")}
              </small>
            </div>
          );
        },
      },
      {
        Header: () => <div className="text-center">ভিউ</div>,
        width: "10%",
        id: "option",

        Cell: ({ row: { original } }) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setActivityLogId(original.id)}
                data-bs-toggle="modal"
                data-bs-target="#showActivityLogDetails"
                className="btn btn-sm btn-outline-primary"
              >
                <Eye />
              </button>
            </div>
          );
        },
      },
    ],
    [ownerUsers]
  );

  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">এক্টিভিটি</h2>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper">
                  <Table columns={columns} data={data} isLoading={isLoading} />
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
      <Details activityId={activityLogId} />
    </>
  );
};

export default ActivityLog;
