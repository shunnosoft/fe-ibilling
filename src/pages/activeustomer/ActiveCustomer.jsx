import React, { useEffect, useState } from "react";

import "../collector/collector.css";
import "../configMikrotik/configmikrotik.css";
import { ArrowClockwise, WifiOff, Wifi } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";

import Loader from "../../components/common/Loader";
import { fetchMikrotik, fetchpppoeUser } from "../../features/apiCalls";

import { resetMikrotikUserAndPackage } from "../../features/mikrotikSlice";

import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
// import TdLoader from "../../components/common/TdLoader";

export default function ConfigMikrotik() {
  const { t } = useTranslation();
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  const [selectedMikrotikId, setMikrotikId] = useState();

  const singleMik = mikrotik.find((item) => item.id === selectedMikrotikId)
    ? mikrotik.find((item) => item.id === selectedMikrotikId)
    : {};

  let allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);
  console.log(allMikrotikUsers);

  const [loading, setLoading] = useState(false);

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const dispatch = useDispatch();

  useEffect(() => {
    !mikrotik.length && fetchMikrotik(dispatch, ispOwnerId, setLoading);
    const mtkId = selectedMikrotikId ? selectedMikrotikId : mikrotik[0]?.id;
    const name = mtkId ? singleMik?.name : "";
    setMikrotikId(mtkId);
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: mtkId,
    };

    if (mtkId) {
      dispatch(resetMikrotikUserAndPackage());
      fetchpppoeUser(dispatch, IDs, name, setLoading);
    }
  }, [ispOwnerId, selectedMikrotikId, mikrotik]);

  const filterIt = (e) => {
    let temp;
    if (e.target.value === "allCustomer") {
      setAllUsers(allMikrotikUsers);
    } else if (e.target.value === "true") {
      temp = allMikrotikUsers.filter((item) => item.running == true);
      setAllUsers(temp);
    } else if (e.target.value === "false") {
      temp = allMikrotikUsers.filter((item) => item.running != true);
      setAllUsers(temp);
    }
  };

  const mikrotiSelectionHandler = (e) => {
    const original = e.target.value;
    setMikrotikId(original);
  };

  const refreshHandler = () => {
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: selectedMikrotikId,
    };

    dispatch(resetMikrotikUserAndPackage());
    // fetchActivepppoeUser(dispatch, IDs, singleMik.name, setLoading);

    fetchpppoeUser(dispatch, IDs, singleMik.name, setLoading, "user");
  };

  const columns = React.useMemo(
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
  let [allUsers, setAllUsers] = useState(allMikrotikUsers);
  useEffect(() => {
    setAllUsers(allMikrotikUsers);
  }, [allMikrotikUsers]);

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
                    <div>{t("activeCustomer")}</div>
                    <div className="reloadBtn">
                      {loading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => refreshHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 pt-4">
                  <div className="d-flex justify-content-center">
                    <div className="mikrotik-filter">
                      <h6 className="mb-0"> {t("selectMikrotik")} </h6>
                      <select
                        id="selectMikrotikOption"
                        onChange={mikrotiSelectionHandler}
                        className="form-select mt-0"
                      >
                        {mikrotik.map((m) => {
                          return <option value={m.id}>{m.name}</option>;
                        })}
                      </select>
                    </div>

                    <div className="mikrotik-filter ms-4">
                      <h6 className="mb-0"> {t("selectCustomer")} </h6>
                      <select
                        id="selectMikrotikOption"
                        onChange={filterIt}
                        className="form-select mt-0"
                      >
                        <option
                          selected={loading === true}
                          value={"allCustomer"}
                        >
                          {t("sokolCustomer")}
                        </option>
                        <option value={"true"}>{t("online")}</option>
                        <option value={"false"}>{t("ofline")}</option>
                      </select>
                    </div>
                    {/* )} */}
                  </div>

                  {/* Active PPPoE users */}
                  <div className="table-section">
                    <Table
                      isLoading={loading}
                      columns={columns}
                      data={allUsers}
                    ></Table>
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
}
