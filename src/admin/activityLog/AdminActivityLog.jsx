import React, { useMemo, useState } from "react";
import { FontColor, FourGround } from "../../assets/js/theme";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import moment from "moment";
import { ArrowClockwise, Eye, FilterCircle } from "react-bootstrap-icons";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import { Accordion } from "react-bootstrap";
import { badge } from "../../components/common/Utils";
import useISPowner from "../../hooks/useISPOwner";
import useDataState from "../../hooks/useDataState";
import { getAdminActivityLog } from "../../features/apiCallAdmin";
import { handleActiveFilter } from "../../pages/common/activeFilter";
import Details from "../../pages/activityLog/modal/Details";
import { useLocation } from "react-router-dom";

const AdminActivityLog = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { state: ispOwner } = useLocation();

  //---> Get user & current user data form useISPOwner hooks
  const { role, userData } = useISPowner();

  // get user data set from useDataState hooks
  const { filterOptions, setFilterOption } = useDataState();

  // initial loading ste
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  // initial comment id state
  const [activityLog, setActivityLog] = useState({});
  const [activityLogData, setActivityLogData] = useState([]);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  //---> Get admin activity log data from redux store
  const data = useSelector((state) => state?.activityLog.activityLog);

  // api call
  useEffect(() => {
    const userId = ispOwner?.role ? ispOwner.id : userData?.id;
    getAdminActivityLog(dispatch, setIsLoading, userId);
  }, []);

  useEffect(() => {
    setActivityLogData(data);
  }, [data]);

  // reload handler
  const reloadHandler = () => {
    getAdminActivityLog(dispatch, setIsLoading, userData?.id);
  };

  // table columns
  const columns = useMemo(
    () => [
      {
        Header: "#",
        id: "row",
        width: "5%",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "30%",
        Header: t("description"),
        accessor: "description",
      },
      {
        width: "10%",
        Header: t("module"),
        accessor: "module",
        Cell: ({ cell: { value } }) => <p>{badge(value.toLowerCase())}</p>,
      },
      {
        width: "10%",
        Header: t("ipAddress"),
        accessor: "ipAddress",
        Cell: ({ value }) => {
          const ipAddress = value.split(":").pop();
          return <p>{ipAddress}</p>;
        },
      },
      {
        width: "10%",
        Header: t("role"),
        accessor: "role",
        Cell: ({ cell: { value } }) => <p>{badge(value)}</p>,
      },
      {
        width: "10%",
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
    [t]
  );

  // filter inputs options
  const filterInputs = [
    {
      name: "action",
      type: "select",
      id: "action",
      value: filterOptions.action,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          action: e.target.value,
        });
      },
      options: [
        {
          text: t("create"),
          value: "CREATE",
        },
        {
          text: t("update"),
          value: "UPDATE",
        },
        {
          text: t("delete"),
          value: "DELETE",
        },
        {
          text: t("recharge"),
          value: "RECHARGE",
        },
      ],
      firstOptions: t("action"),
      textAccessor: "text",
      valueAccessor: "value",
    },
  ];

  // filter reset controller
  const handleFilterReset = () => {
    if (Object.keys(filterOptions).length > 0) {
      // set empty filter option
      setFilterOption(
        Object.fromEntries(filterInputs.map((input) => [input.name, ""]))
      );
      setActivityLogData(data);
    }
  };

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
                        <div className="displayGrid6">
                          {filterInputs?.map(
                            (item) =>
                              item.isVisible && (
                                <select
                                  className="form-select shadow-none mt-0"
                                  onChange={item.onChange}
                                  value={item.value}
                                >
                                  <option value="">{item.firstOptions}</option>
                                  {item.options?.map((opt) => (
                                    <option value={opt[item.valueAccessor]}>
                                      {opt[item.textAccessor]}
                                    </option>
                                  ))}
                                </select>
                              )
                          )}

                          <div className="displayGrid1">
                            <button
                              className="btn btn-outline-primary"
                              type="button"
                              onClick={() =>
                                setActivityLogData(
                                  handleActiveFilter(data, filterOptions)
                                )
                              }
                            >
                              {t("filter")}
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={handleFilterReset}
                            >
                              {t("reset")}
                            </button>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="collectorWrapper pb-2">
                    <Table
                      columns={columns}
                      data={activityLogData}
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

export default AdminActivityLog;
