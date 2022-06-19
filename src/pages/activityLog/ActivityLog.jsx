import React, { useState } from "react";
import { FontColor, FourGround } from "../../assets/js/theme";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getActvityLog } from "../../features/activityLogApi";
import moment from "moment";
import { Eye } from "react-bootstrap-icons";
import Table from "../../components/table/Table";

const ActivityLog = () => {
  // import dispatch
  const dispatch = useDispatch();

  // initial loading state
  const [isLoading, setIsLoading] = useState(false);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );

  const data = useSelector(
    (state) => state?.persistedReducer?.activityLog?.activityLog
  );
  console.log(data);

  useEffect(() => {
    getActvityLog(dispatch, setIsLoading, ispOwnerId);
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Serial",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },

      {
        accessor: "action",
        Header: "অ্যাকশন",
      },
      {
        Header: "সময়",
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
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
            <button className="btn btn-sm btn-primary">
              {" "}
              <Eye />{" "}
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
    </>
  );
};

export default ActivityLog;
