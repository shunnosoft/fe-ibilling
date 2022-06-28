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
import { fetchActivepppoeUser, fetchpppoeUser } from "../../features/apiCalls";

import { resetMikrotikUserAndPackage } from "../../features/mikrotikSlice";

import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
// import TdLoader from "../../components/common/TdLoader";

export default function ConfigMikrotik() {
  const { t } = useTranslation();
  const mikrotik = useSelector(
    (state) => state.persistedReducer?.mikrotik?.mikrotik
  );
  const mtkIsLoading = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.isLoading
  );
  const [selectedMikrotikId, setMikrotikId] = useState();
  const singleMik = mikrotik.find((item) => item.id === selectedMikrotikId)
    ? mikrotik.find((item) => item.id === selectedMikrotikId)
    : {};

  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");
  const allMikrotikUsers = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoeUser
  );

  const activeUser = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoeActiveUser
  );
  console.log(activeUser);
  const pppoePackage = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoePackage
  );

  const [loading, setLoading] = useState(false);
  // const [isDeleting, setIsDeleting] = useState(false);

  const [whatYouWantToShow, setWhatYouWantToShow] = useState(
    "showActiveMikrotikUser"
  );

  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const mtkId = selectedMikrotikId ? selectedMikrotikId : mikrotik[0]?.id;
    const name = mtkId ? singleMik?.name : "";
    setMikrotikId(mtkId);
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: mtkId,
    };

    if (mtkId) {
      dispatch(resetMikrotikUserAndPackage());
      fetchActivepppoeUser(dispatch, IDs, name, setLoading);
    }
  }, [ispOwnerId, selectedMikrotikId, dispatch, mikrotik]);

  const selectMikrotikOptionsHandler = (e) => {
    const original = e.target.value;

    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: selectedMikrotikId,
    };

    dispatch(resetMikrotikUserAndPackage());

    if (original === "showActiveMikrotikUser") {
      fetchActivepppoeUser(dispatch, IDs, singleMik.name, setLoading);
      setWhatYouWantToShow("showActiveMikrotikUser");
    } else if (original === "showAllMikrotikUser") {
      fetchpppoeUser(dispatch, IDs, singleMik.name, setLoading);
      setWhatYouWantToShow("showAllMikrotikUser");
    }

    // setWhatYouWantToShow(original);
  };
  const mikrotiSelectionHandler = (e) => {
    const original = e.target.value;
    setMikrotikId(original);
  };
  const [isRefrsh, setIsRefrsh] = useState(false);
  const refreshHandler = () => {
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: selectedMikrotikId,
    };

    dispatch(resetMikrotikUserAndPackage());
    if (whatYouWantToShow === "showActiveMikrotikUser") {
      fetchActivepppoeUser(dispatch, IDs, singleMik.name, setLoading);
    } else if (whatYouWantToShow === "showAllMikrotikUser") {
      fetchpppoeUser(dispatch, IDs, singleMik.name, setLoading);
    }
  };
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
        width: "10%",
        Header: "স্ট্যাটাস",
        Cell: <Wifi color="green" />,
      },
      {
        width: "16%",
        Header: "নাম",
        accessor: "name",
        // Cell: ({ row: { original } }) => (
        //   <div
        //     style={{
        //       display: "flex",
        //     }}
        //   >
        //     <div style={{ marginRight: "5px" }}>
        //       <Wifi />
        //     </div>
        //     {original?.name}
        //   </div>
        // ),
      },
      {
        width: "15%",
        Header: "এড্রেস",
        accessor: "address",
      },
      {
        width: "17%",
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
        width: "17%",
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
        width: "17%",
        Header: "আপ টাইম",
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
    []
  );
  const columns3 = React.useMemo(
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
        Header: "স্ট্যাটাস",
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
        Header: "নাম",
        accessor: "name",
      },
      {
        width: "12%",
        Header: "প্যাকেজ",
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
    []
  );
  const [allUsers, setAllUsers] = useState(allMikrotikUsers);
  useEffect(() => {
    setAllUsers(allMikrotikUsers);
  }, [allMikrotikUsers]);

  const filterIt = (e) => {
    let temp;
    if (e.target.value === "") {
      setAllUsers(allMikrotikUsers);
    } else if (e.target.value === "true") {
      temp = allMikrotikUsers.filter((item) => item.running == true);
      setAllUsers(temp);
    } else if (e.target.value === "false") {
      temp = allMikrotikUsers.filter((item) => item.running != true);
      setAllUsers(temp);
    }
  };
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
                <h2 className="collectorTitle"> {t("activeCustomer")} </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="activeuserselection">
                      <div className="LeftSideMikrotik">
                        <h6> {t("selectMikrotik")} </h6>
                        <select
                          id="selectMikrotikOption"
                          onChange={mikrotiSelectionHandler}
                          className="form-select"
                          style={{ marginBottom: "-10px" }}
                        >
                          {mikrotik.map((m) => {
                            return <option value={m.id}>{m.name}</option>;
                          })}
                        </select>
                      </div>
                      <div className="rightSideMikrotik">
                        <h6> {t("selectCustomer")} </h6>
                        <select
                          id="selectMikrotikOption"
                          onChange={selectMikrotikOptionsHandler}
                          className="form-select"
                        >
                          <option value="showActiveMikrotikUser">
                            {t("activeCustomer")}
                          </option>
                          <option value="showAllMikrotikUser">
                            {t("sokolCustomer")}
                          </option>
                        </select>
                      </div>
                      <div className="rightSideMikrotik">
                        <h5> {t("refresh")} </h5>

                        <div className="refreshIcon">
                          {isRefrsh ? (
                            <Loader></Loader>
                          ) : (
                            <ArrowClockwise
                              onClick={() => refreshHandler()}
                            ></ArrowClockwise>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PPPoE users */}
                    <div className="table-section">
                      {whatYouWantToShow === "showActiveMikrotikUser" && (
                        <Table columns={columns2} data={activeUser}></Table>
                      )}
                    </div>

                    {/* Active PPPoE users */}
                    <div className="table-section">
                      {whatYouWantToShow === "showAllMikrotikUser" && (
                        // <>
                        //   <h2
                        //     style={{
                        //       width: "100%",
                        //       textAlign: "center",
                        //       marginTop: "50px",
                        //     }}
                        //   >
                        //     সকল গ্রাহক
                        //   </h2>
                        //   <div
                        //     className="LeftSideMikrotik"
                        //     style={{
                        //       widhth: "100%",
                        //       display: "flex",
                        //       alignItems: "center",
                        //       justifyContent: "flex-end",
                        //     }}
                        //   >
                        //     <select
                        //       id="selectMikrotikOption"
                        //       onChange={filterIt}
                        //       className="form-select"
                        //       style={{ marginBottom: "-10px" }}
                        //     >
                        //       <option value={""}>সকল গ্রাহক</option>;
                        //       <option value={"true"}>অনলাইন</option>;
                        //       <option value={"false"}>অফলাইন</option>;
                        //     </select>
                        //   </div>

                        <Table
                          isLoading={loading}
                          columns={columns3}
                          data={allUsers}
                        ></Table>
                      )}
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
}
