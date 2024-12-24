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
import { ArrowClockwise, Eye, FilterCircle } from "react-bootstrap-icons";
import Details from "./modal/Details";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import { Accordion } from "react-bootstrap";
import { badge } from "../../components/common/Utils";

const ActivityLog = () => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // initial loading state
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  // initial comment id state
  const [activityLog, setActivityLog] = useState({});

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get all data from redux
  const data = useSelector((state) => state?.activityLog?.activityLog);

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  // api call
  useEffect(() => {
    getOwnerUsers(dispatch, ispOwnerId);
    getActvityLog(dispatch, setIsLoading, ispOwnerId);
  }, []);

  // reload handler
  const reloadHandler = () => {
    getActvityLog(dispatch, setIsLoading, ispOwnerId);
  };

  // table columns
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        id: "row",
        width: "3%",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "27%",
        Header: t("description"),
        accessor: "description",
      },
      {
        width: "15%",
        Header: t("ipAddress"),
        accessor: "ipAddress",
        Cell: ({ value }) => {
          const ipAddress = value.split(":").pop();
          return <p>{ipAddress}</p>;
        },
      },
      {
        width: "15%",
        Header: t("role"),
        accessor: "role",
        Cell: ({ cell: { value } }) => <p>{badge(value)}</p>,
      },
      {
        width: "15%",
        Header: t("action"),
        accessor: "action",
        Cell: ({ cell: { value } }) => <p>{badge(value)}</p>,
      },
      {
        width: "15%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY-MM-DD hh:mm A");
        },
      },
      {
        Header: () => <div className="text-center">{t("view")}</div>,
        width: "10%",
        id: "option",
        Cell: ({ row: { original } }) => {
          return (
            <div className="d-flex justify-content-center align-items-center">
              <button
                onClick={() => {
                  setShow(true);
                  setActivityLog(original);
                }}
                className="btn btn-sm btn-outline-primary"
              >
                <Eye />
              </button>
            </div>
          );
        },
      },
    ],
    [ownerUsers, t]
  );

  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <h2 className="component_name">{t("activityLog")}</h2>

                  <div
                    style={{ height: "45px" }}
                    className="d-flex align-items-center"
                  >
                    <div
                      onClick={() => {
                        if (!activeKeys) {
                          setActiveKeys("filter");
                        } else {
                          setActiveKeys("");
                        }
                      }}
                      title={t("filter")}
                    >
                      <FilterCircle className="addcutmButton" />
                    </div>

                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
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
                        {/* <DataFilter
                          page="pppoe"
                          customers={customers}
                          setCustomers={setPPPoeCustomers}
                          filterOptions={filterOptions}
                          setFilterOption={setFilterOption}
                        /> */}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="collectorWrapper pb-2">
                    <Table
                      columns={columns}
                      data={data}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>

      {/* Activity log details modal */}
      <Details
        {...{
          show,
          setShow,
          activityLog,
        }}
      />
    </>
  );
};

export default ActivityLog;
