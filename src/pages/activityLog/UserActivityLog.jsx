import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { badge } from "../../components/common/Utils";
import moment from "moment";
import { ArrowClockwise, Eye, FilterCircle } from "react-bootstrap-icons";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FontColor, FourGround } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import { Accordion } from "react-bootstrap";
import Table from "../../components/table/Table";
import Details from "./modal/Details";
import useDash from "../../assets/css/dash.module.css";
import { getUserActivityLog } from "../../features/activityLogApi";
import { useLocation, useParams } from "react-router-dom";
import { handleActiveFilter } from "../common/activeFilter";
import useISPowner from "../../hooks/useISPOwner";
import { getOwnerUsers, userStaffs } from "../../features/getIspOwnerUsersApi";
import useDataState from "../../hooks/useDataState";
import {
  fetchMikrotik,
  getAllPackages,
  getArea,
} from "../../features/apiCalls";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import {
  getResellerPackages,
  getResellerUsers,
  getSubAreas,
} from "../../features/apiCallReseller";
import useSelectorState from "../../hooks/useSelectorState";

const UserActivityLog = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const { state: user } = useLocation();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId, userData } = useISPowner();

  //---> Get redux store state data from useSelectorState hooks
  const { mikrotiks, packages, allPackages, areas, subAreas, ownerUsers } =
    useSelectorState();

  // get user data set from useDataState hooks
  const { filterOptions, setFilterOption } = useDataState();

  // admin staff user role permission
  const adminUser =
    role === "ispOwner" ||
    role === "manager" ||
    (role === "collector" && !userData.reseller);

  //---> Reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  // initial loading state
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  // initial comment id state
  const [activityLog, setActivityLog] = useState({});
  const [activityLogData, setActivityLogData] = useState([]);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // get all data from redux
  const data = useSelector((state) => state?.activityLog?.customerActivityLog);

  // get user staff data from redux store
  const staffs = useSelector((state) => state?.ownerUsers?.userStaff);

  useEffect(() => {
    getUserActivityLog(dispatch, setIsLoading, user?.role, userId);

    if (adminUser) {
      //---> @Get ispOwner areas data
      !areas?.length && getArea(dispatch, ispOwnerId, setIsLoading);

      //---> @Get ispOwner areas sub-area data
      !subAreas.length && getSubAreasApi(dispatch, ispOwnerId);

      //---> @Get ispOwner mikrotiks data
      !mikrotiks?.length && fetchMikrotik(dispatch, ispOwnerId, setIsLoading);

      //---> @Get ispOwner all mikrotik packages data
      !allPackages.length && getAllPackages(dispatch, ispOwnerId, setIsLoading);

      //---> @Get ispOwner user data
      !ownerUsers?.length && getOwnerUsers(dispatch, ispOwnerId);
    } else {
      //---> @Get reseller ispOwner areas sub-area data
      !subAreas.length && getSubAreas(dispatch, resellerId);

      //---> @Get reseller with and withOut mikrotik package data
      !packages.length && getResellerPackages(dispatch, resellerId);
    }

    // get user staffs api
    if (role === "ispOwner") {
      staffs.length === 0 && userStaffs(dispatch);
    } else {
      staffs.length === 0 && getResellerUsers(dispatch, userData?.id);
    }
  }, []);

  useEffect(() => {
    setActivityLogData(data);
  }, [data]);

  // reload handler
  const reloadHandler = () => {
    getUserActivityLog(dispatch, setIsLoading, user, userId);
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
        width: "25%",
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
    [t]
  );

  // filter inputs options
  const filterInputs = [
    {
      name: "createdBy",
      type: "select",
      id: "createdBy",
      value: filterOptions.createdBy,
      isVisible: true,
      disabled: false,
      onChange: (e) =>
        setFilterOption({
          ...filterOptions,
          createdBy: e.target.value,
        }),
      options: staffs,
      firstOptions: t("createdBy"),
      textAccessor: "name",
      valueAccessor: "user",
    },
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
                  <p>{user?.name}</p>
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

export default UserActivityLog;
