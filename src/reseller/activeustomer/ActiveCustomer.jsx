import React, { useEffect, useState } from "react";

import "../collector/collector.css";
// import "../configMikrotik/configmikrotik.css";
import "../../pages/configMikrotik/configmikrotik.css";
import { ArrowClockwise, WifiOff, Wifi } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";

import Loader from "../../components/common/Loader";
import {
  fetchActivepppoeUser,
  fetchActivepppoeUserForReseller,
  fetchpppoeUser,
  fetchpppoeUserForReseller,
} from "../../features/apiCalls";

import { resetMikrotikUserAndPackage } from "../../features/mikrotikSlice";

import Table from "../../components/table/Table";
import { getMikrotik } from "../../features/apiCallReseller";
// import TdLoader from "../../components/common/TdLoader";
import { useTranslation } from "react-i18next";

export default function RActiveCustomer() {
  const { t } = useTranslation();
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const mikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );

  const mtkIsLoading = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.isLoading
  );
  const [selectedMikrotikId, setMikrotikId] = useState();
  const [singleMik, setSingleMik] = useState({});

  console.log(singleMik);
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");
  const allMikrotikUsers = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoeUser
  );

  const activeUser = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoeActiveUser
  );

  const pppoePackage = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoePackage
  );

  const [loading, setLoading] = useState(false);
  // const [isDeleting, setIsDeleting] = useState(false);

  const [whatYouWantToShow, setWhatYouWantToShow] = useState("customerSelect");

  const ispOwnerId = useSelector(
    (state) => state?.persistedReducer?.auth?.ispOwnerId
  );
  const dispatch = useDispatch();
  useEffect(() => {
    getMikrotik(dispatch, userData?.id);
  }, [dispatch, userData?.id]);
  // useEffect(() => {
  //   const mtkId = selectedMikrotikId ? selectedMikrotikId : mikrotik[0]?.id;
  //   console.log(mtkId);
  //   const name = mtkId ? singleMik?.name : "";
  //   setMikrotikId(mtkId);
  //   const IDs = {
  //     resellerId: userData?.id,
  //     mikrotikId: selectedMikrotikId,
  //   };

  //   if (mtkId) {
  //     dispatch(resetMikrotikUserAndPackage());
  //     // fetchActivepppoeUser();
  //     fetchActivepppoeUserForReseller(
  //       dispatch,
  //       IDs,
  //       singleMik?.name,
  //       setLoading
  //     );
  //   }
  // }, []);

  const selectMikrotikOptionsHandler = (e) => {
    const original = e.target.value;
    if (!selectedMikrotikId) {
      return 0;
    }
    const IDs = {
      resellerId: userData.id,
      mikrotikId: selectedMikrotikId,
    };

    dispatch(resetMikrotikUserAndPackage());

    if (original === "showActiveMikrotikUser") {
      // fetchActivepppoeUser(dispatch, IDs, singleMik.name, setLoading);
      fetchActivepppoeUserForReseller(
        dispatch,
        IDs,
        singleMik?.name,
        setLoading
      );
      setWhatYouWantToShow("showActiveMikrotikUser");
    } else if (original === "showAllMikrotikUser") {
      // fetchpppoeUser(dispatch, IDs, singleMik.name, setLoading);
      fetchpppoeUserForReseller(dispatch, IDs, singleMik?.name, setLoading);
      setWhatYouWantToShow("showAllMikrotikUser");
    }

    setWhatYouWantToShow(original);
  };
  const mikrotiSelectionHandler = (e) => {
    const original = e.target.value;
    setMikrotikId(original);
    if (e) {
      const singleMikTemp = mikrotik.find((item) => item.id === original)
        ? mikrotik.find((item) => item.id === original)
        : {};
      setSingleMik(singleMikTemp);
    } else {
      setSingleMik({});
    }
  };
  const [isRefrsh, setIsRefrsh] = useState(false);
  const refreshHandler = () => {
    if (!selectedMikrotikId) {
      toast.warn(t("selectMikrotik"));
      return 0;
    } else if (whatYouWantToShow === "customerSelect") {
      toast.warn(t("selectCustomer"));
      return 0;
    }
    const IDs = {
      resellerId: userData.id,
      mikrotikId: singleMik?.id,
    };

    dispatch(resetMikrotikUserAndPackage());
    if (whatYouWantToShow === "showActiveMikrotikUser") {
      // fetchActivepppoeUser(dispatch, IDs, singleMik.name, setLoading);
      fetchActivepppoeUserForReseller(
        dispatch,
        IDs,
        singleMik?.name,
        setLoading
      );
    } else if (whatYouWantToShow === "showAllMikrotikUser") {
      // fetchpppoeUser(dispatch, IDs, singleMik.name, setLoading);
      fetchpppoeUserForReseller(dispatch, IDs, singleMik?.name, setLoading);
    }
  };
  const columns2 = React.useMemo(
    () => [
      {
        Header: t("serial"),
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: t("status"),
        Cell: <Wifi color="green" />,
      },
      {
        Header: t("name"),
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
  const columns3 = React.useMemo(
    () => [
      {
        Header: t("serial"),
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
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
        Header: t("name"),
        accessor: "name",
      },
      {
        Header: t("package"),
        accessor: "profile",
      },
      // {
      //   Header: "RX",
      //   accessor: "rxByte",
      //   Cell: ({ row: { original } }) => (
      //     <div
      //       style={{
      //         padding: "15px 15px 15px 0 !important",
      //       }}
      //     >
      //       {original?.rxByte
      //         ? (original?.rxByte / 1024 / 1024).toFixed(2) + " MB"
      //         : ""}
      //     </div>
      //   ),
      // },
      // {
      //   Header: "TX",
      //   accessor: "txByte",
      //   Cell: ({ row: { original } }) => (
      //     <div
      //       style={{
      //         padding: "15px 15px 15px 0 !important",
      //       }}
      //     >
      //       {original?.txByte
      //         ? (original?.txByte / 1024 / 1024).toFixed(2) + " MB"
      //         : ""}
      //     </div>
      //   ),
      // },
      // {
      //   Header: "Last Link Up Time",
      //   accessor: "lastLinkUpTime",
      // },
    ],
    [t]
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
                <h2 className="collectorTitle">{t("activeCustomer")}</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="activeuserselection">
                      <div className="LeftSideMikrotik">
                        {/* <h6>মাইক্রোটিক সিলেক্ট করুন</h6> */}
                        <select
                          id="selectMikrotikOption"
                          onChange={mikrotiSelectionHandler}
                          className="form-select"
                          style={{ marginBottom: "-10px" }}
                        >
                          <option value={""}>{t("selectMikrotik")}</option>
                          {mikrotik.map((m) => {
                            return (
                              <option
                                selected={singleMik?.id === m.id}
                                value={m.id}
                              >
                                {m.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="rightSideMikrotik">
                        {/* <h6>গ্রাহক সিলেক্ট করুন</h6> */}
                        <select
                          id="selectMikrotikOption"
                          onChange={selectMikrotikOptionsHandler}
                          className="form-select"
                        >
                          <option value="customerSelect">
                            {t("selectCustomer")}
                          </option>
                          <option value="showActiveMikrotikUser">
                            {t("activeCustomer")}
                          </option>
                          <option value="showAllMikrotikUser">
                            {t("sokolCustomer")}
                          </option>
                        </select>
                      </div>
                      <div className="rightSideMikrotik">
                        {/* <h5>রিফ্রেশ করুন</h5> */}

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
                    {(whatYouWantToShow === "showActiveMikrotikUser" ||
                      whatYouWantToShow === "customerSelect") && (
                      <Table
                        isLoading={loading}
                        columns={columns2}
                        data={activeUser}
                      ></Table>
                    )}

                    {/* Active PPPoE users */}
                    {whatYouWantToShow === "showAllMikrotikUser" && (
                      <Table
                        isLoading={loading}
                        columns={columns3}
                        data={allUsers}
                      ></Table>
                    )}
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
