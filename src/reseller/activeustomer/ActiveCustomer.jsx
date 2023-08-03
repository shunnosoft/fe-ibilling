import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchpppoeUserForReseller } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
// get specific customer

import {
  ArrowClockwise,
  FilterCircle,
  Wifi,
  WifiOff,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import { getMikrotik } from "../../features/apiCallReseller";
import Footer from "../../components/admin/footer/Footer";
import moment from "moment";
import { Accordion } from "react-bootstrap";

const ResellserActiveCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get reseller id
  let userData = useSelector((state) => state.persistedReducer.auth.userData);

  //get collector
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get all static customer
  let allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);

  //get subAreas
  const subAreas = useSelector((state) => state?.area?.area);

  // mikrotik loading state
  const [loading, setIsloading] = useState(false);

  // set initialy mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // customer state
  let [allUsers, setAllUsers] = useState(allMikrotikUsers);

  // offline state
  let [offline, setOffline] = useState(false);

  // offline state
  let [allOfflineUsers, setAllOfflineUsers] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // select mikrotik handler
  const mikrotiSelectionHandler = (event) => {
    setMikrotikId(event.target.value);
  };

  // customer filter state
  const filterIt = (e) => {
    let temp;
    if (e.target.value === "allCustomer") {
      setAllUsers(allMikrotikUsers);
      setOffline(false);
    } else if (e.target.value === "online") {
      temp = allMikrotikUsers.filter((item) => item.running == true);
      setAllUsers(temp);
      setOffline(false);
    } else if (e.target.value === "offline") {
      setOffline(true);
      temp = allMikrotikUsers.filter((item) => item.running != true);
      setAllUsers(temp);
      setAllOfflineUsers(temp);
    } else if (e.target.value === "offlineActive") {
      temp = allOfflineUsers.filter((item) => item.status === "active");
      setAllUsers(temp);
    } else if (e.target.value === "offlineInactive") {
      temp = allOfflineUsers.filter((item) => item.status === "inactive");
      setAllUsers(temp);
    }
  };

  const subAreaFilterHandler = (e) => {
    if (e.target.value !== "") {
      const subAreaUser = allMikrotikUsers.filter(
        (item) => item.subArea === e.target.value
      );
      setAllUsers(subAreaUser);
    } else {
      setAllUsers(allMikrotikUsers);
    }
  };

  // initialize id
  const ids = {
    resellerId: role === "reseller" ? userData.id : userData.reseller,
    mikrotikId,
  };

  // reload handler
  const reloadHandler = () => {
    fetchpppoeUserForReseller(dispatch, ids, mikrotik[0].name, setIsloading);
  };

  // api call for get update static customer
  useEffect(() => {
    if (role === "collector") {
      getMikrotik(dispatch, currentUser?.collector.reseller);
    }
    if (role === "reseller") {
      getMikrotik(dispatch, currentUser?.reseller.id);
    }
    if (mikrotikId) {
      fetchpppoeUserForReseller(dispatch, ids, mikrotik[0]?.name, setIsloading);
    }
  }, [mikrotikId]);

  // set mikrotik and customer into state
  useEffect(() => {
    setAllUsers(allMikrotikUsers);
    setMikrotikId(mikrotik[0]?.id);
  }, [allMikrotikUsers, mikrotik]);

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "6%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "7%",
        Header: t("status"),
        accessor: "running",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.running ? (
              <Wifi color="green" />
            ) : (
              <WifiOff color="red" />
            )}
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "13%",
        Header: t("PPPoEName"),
        accessor: "pppoe.name",
      },
      {
        width: "12%",
        Header: t("ip"),
        accessor: "ip",
      },
      {
        width: "12%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "8%",
        Header: "RX",
        accessor: "rxByte",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {original?.rxByte
              ? (original?.rxByte / 1024 / 1024).toFixed(2) + " MB"
              : ""}
          </div>
        ),
      },
      {
        width: "8%",
        Header: "TX",
        accessor: "txByte",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.txByte &&
              (original?.txByte / 1024 / 1024).toFixed(2) + " MB"}
          </div>
        ),
      },
      {
        width: "12%",
        Header: "Last Link Up",
        accessor: "lastLinkUpTime",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.lastLinkUpTime &&
              moment(original.lastLinkUpTime).format("YYYY/MM/DD hh:mm A")}
          </div>
        ),
      },
      {
        width: "12%",
        Header: "Last Logout",
        accessor: "lastLogoutTime",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.lastLogoutTime &&
              moment(original.lastLogoutTime).format("YYYY/MM/DD hh:mm A")}
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
              {/* modals */}
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="d-flex">
                    <div>{t("activeCustomer")}</div>
                  </div>

                  <div className="d-flex justify-content-center align-items-center">
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
                      {loading ? (
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
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="d-flex justify-content-center">
                          <div className="mikrotik-filter">
                            <select
                              id="selectMikrotikOption"
                              onChange={mikrotiSelectionHandler}
                              className="form-select mt-0"
                            >
                              {mikrotik.map((item) => (
                                <option value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="mikrotik-filter ms-4">
                            <select
                              id="selectMikrotikOption"
                              onChange={subAreaFilterHandler}
                              className="form-select mt-0"
                            >
                              <option value="">{t("allSubArea")}</option>
                              {subAreas.map((item) => (
                                <option value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="mikrotik-filter ms-4">
                            <select
                              id="selectMikrotikOption"
                              onChange={filterIt}
                              className="form-select mt-0"
                            >
                              <option value="allCustomer">
                                {t("sokolCustomer")}
                              </option>
                              <option value="online">{t("online")}</option>
                              <option value="offline">{t("ofline")}</option>
                            </select>
                          </div>

                          {offline && (
                            <div className="mikrotik-filter ms-4">
                              <select
                                id="selectOfflineOption"
                                onChange={filterIt}
                                className="form-select mt-0"
                              >
                                <option value="offline">{t("status")}</option>
                                <option value="offlineActive">
                                  {t("activeOffline")}
                                </option>
                                <option value="offlineInactive">
                                  {t("inactiveOffline")}
                                </option>
                              </select>
                            </div>
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="collectorWrapper pb-2">
                    <div className="table-section">
                      <Table
                        isLoading={loading}
                        columns={columns}
                        data={allUsers}
                      ></Table>
                    </div>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResellserActiveCustomer;
