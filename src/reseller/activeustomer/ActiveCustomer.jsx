import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActivepppoeUserForReseller,
  fetchpppoeUserForReseller,
} from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
// get specific customer

import { ArrowClockwise, Wifi, WifiOff } from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import { getMikrotik } from "../../features/apiCallReseller";

const ResellserActiveCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("active");

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // set initialy mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  //get reseller active customer
  let activeUser = useSelector((state) => state?.mikrotik?.pppoeActiveUser);

  //get reseller active customer
  let allUserFromMikrotic = useSelector((state) => state?.mikrotik?.pppoeUser);

  // get reseller id
  let userData = useSelector((state) => state.persistedReducer.auth.userData);

  //get collector
  const currentUser = useSelector(
    (state) => state.persistedReducer.auth?.currentUser
  );

  //get role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // select mikrotik handler
  const mikrotiSelectionHandler = (event) => {
    setMikrotikId(event.target.value);
  };

  // // filter
  // if (filterStatus && filterStatus !== t("sokolCustomer")) {
  //   activeUser = activeUser.filter(
  //     (value) => value.complete === JSON.parse(filterStatus)
  //   );
  // }

  // reload handler
  const reloadHandler = () => {
    fetchActivepppoeUserForReseller(
      dispatch,
      userData.id,
      mikrotikId,
      setIsloading
    );
  };

  useEffect(() => {
    setMikrotikId(mikrotik[0]?.id);
  }, [mikrotik]);

  useEffect(() => {
    if (role === "collector") {
      getMikrotik(dispatch, currentUser?.collector.reseller);
    }
    if (role === "reseller") {
      getMikrotik(dispatch, currentUser?.reseller.id);
    }
  }, [currentUser, userData]);

  //fetch reseller active customer
  useEffect(() => {
    if (mikrotikId) {
      if (filterStatus === "active") {
        fetchActivepppoeUserForReseller(
          dispatch,
          userData.id,
          mikrotikId,
          setIsloading
        );
      }
      const ids = {
        resellerId: userData.id,
        mikrotikId,
      };
      fetchpppoeUserForReseller(dispatch, ids, mikrotik[0].name, setIsloading);
    }
  }, [mikrotikId, filterStatus]);
  console.log({ allUserFromMikrotic });

  if (filterStatus === "inactive") {
    allUserFromMikrotic = allUserFromMikrotic.filter((item) => item.disabled);
  }

  const columns = React.useMemo(
    () => [
      {
        Header: t("serial"),
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "11%",
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
        Header: t("address"),
        accessor: "address",
      },
      {
        Header: "RX",
        accessor: "rxByte",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {(original?.rxByte / 1024 / 1024).toFixed(2) + " MB"}
          </div>
        ),
      },
      {
        Header: "TX",
        accessor: "txByte",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {(original?.txByte / 1024 / 1024).toFixed(2) + " MB"}
          </div>
        ),
      },

      {
        Header: t("upTime"),
        accessor: "uptime",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {original?.uptime
              .replace("w", "w ")
              .replace("d", "d ")
              .replace("h", "h ")
              .replace("m", "m ")
              .replace("s", "s")}
          </div>
        ),
      },
    ],
    [t]
  );

  const columns2 = React.useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "11%",
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
        width: "20%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "12%",
        Header: t("package"),
        accessor: "profile",
      },
      {
        width: "12%",
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
        width: "12%",
        Header: "TX",
        accessor: "txByte",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {original?.txByte
              ? (original?.txByte / 1024 / 1024).toFixed(2) + " MB"
              : ""}
          </div>
        ),
      },
      {
        width: "25%",
        Header: "Last Link Up Time",
        accessor: "lastLinkUpTime",
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2>{t("active PPPoE")}</h2>
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
                  <div className="d-flex justify-content-center">
                    <div className="mikrotik-filter">
                      <h6 className="mb-0"> {t("selectMikrotik")} </h6>
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
                    <div className="customer-filter ms-4">
                      <h6 className="mb-0"> {t("selectCustomer")} </h6>
                      <select
                        className="form-select mt-0"
                        aria-label="Default select example"
                        onChange={(event) =>
                          setFilterStatus(event.target.value)
                        }
                      >
                        <option selected value="active">
                          {t("active")}
                        </option>
                        <option value="allCustomer">
                          {t("sokolCustomer")}
                        </option>
                        <option value="inactive"> {t("in active")} </option>
                      </select>
                    </div>
                  </div>
                  {filterStatus === "active" && (
                    <div className="table-section">
                      <Table
                        isLoading={isLoading}
                        columns={columns}
                        data={activeUser}
                      />
                    </div>
                  )}

                  {filterStatus === "allCustomer" && (
                    <Table
                      isLoading={isLoading}
                      columns={columns2}
                      data={allUserFromMikrotic}
                    />
                  )}
                  {filterStatus === "inactive" && (
                    <Table
                      isLoading={isLoading}
                      columns={columns2}
                      data={allUserFromMikrotic}
                    />
                  )}
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResellserActiveCustomer;
