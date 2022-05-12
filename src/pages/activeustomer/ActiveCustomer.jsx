import React, { useEffect, useState } from "react";
import moment from "moment";

import "../collector/collector.css";
import "../configMikrotik/configmikrotik.css";
import { ArrowClockwise } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
// import { Link } from "react-router-dom";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import TdLoader from "../../components/common/TdLoader";

import Loader from "../../components/common/Loader";
import { fetchActivepppoeUser, fetchpppoeUser } from "../../features/apiCalls";

import { resetMikrotikUserAndPackage } from "../../features/mikrotikSlice";

import { useLayoutEffect } from "react";
// import TdLoader from "../../components/common/TdLoader";

export default function ConfigMikrotik() {
  const navigate = useNavigate();

  let serial = 0;
  let serial2 = 0;
  let serial3 = 0;
  const mikrotik = useSelector(
    (state) => state.persistedReducer.mikrotik.mikrotik
  );
  const mtkIsLoading = useSelector(
    (state) => state.persistedReducer.mikrotik.isLoading
  );
  const [selectedMikrotikId, setMikrotikId] = useState();
  const singleMik = mikrotik.find((item) => item.id === selectedMikrotikId)
    ? mikrotik.find((item) => item.id === selectedMikrotikId)
    : {};

  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [search3, setSearch3] = useState("");
  const allMikrotikUsers = useSelector(
    (state) => state.persistedReducer.mikrotik.pppoeUser
  );

  const activeUser = useSelector(
    (state) => state.persistedReducer.mikrotik.pppoeActiveUser
  );
  const pppoePackage = useSelector(
    (state) => state.persistedReducer.mikrotik.pppoePackage
  );

  const [isLoading, setIsLoading] = useState(true);
  // const [isDeleting, setIsDeleting] = useState(false);

  const [whatYouWantToShow, setWhatYouWantToShow] = useState(
    "showActiveMikrotikUser"
  );

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const mtkId = selectedMikrotikId ? selectedMikrotikId : mikrotik[0]?.id;
    const name = mtkId ? singleMik?.name : "";
    setMikrotikId(mtkId);
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: mtkId,
    };

    if (mtkId) {
      dispatch(resetMikrotikUserAndPackage());
      fetchActivepppoeUser(dispatch, IDs, name);
    }
  }, [ispOwnerId, selectedMikrotikId, dispatch, mikrotik]);

  const selectMikrotikOptionsHandler = (e) => {
    const val = e.target.value;

    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: selectedMikrotikId,
    };

    dispatch(resetMikrotikUserAndPackage());

    if (val === "showActiveMikrotikUser") {
      fetchActivepppoeUser(dispatch, IDs, singleMik.name);
      setWhatYouWantToShow("showActiveMikrotikUser");
    } else if (val === "showAllMikrotikUser") {
      fetchpppoeUser(dispatch, IDs, singleMik.name);
      setWhatYouWantToShow("showAllMikrotikUser");
    }

    // setWhatYouWantToShow(val);
  };
  const mikrotiSelectionHandler = (e) => {
    const val = e.target.value;
    setMikrotikId(val);
  };
  const [isRefrsh, setIsRefrsh] = useState(false);
  const refreshHandler = () => {
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: selectedMikrotikId,
    };

    dispatch(resetMikrotikUserAndPackage());
    if (whatYouWantToShow === "showActiveMikrotikUser") {
      fetchActivepppoeUser(dispatch, IDs, singleMik.name);
    } else if (whatYouWantToShow === "showAllMikrotikUser") {
      fetchpppoeUser(dispatch, IDs, singleMik.name);
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
                <h2 className="collectorTitle">এক্টিভ গ্রাহক</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="activeuserselection">
                      <div className="LeftSideMikrotik">
                        <h4>মাইক্রোটিক সিলেক্ট করুন</h4>
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
                        <h4>গ্রাহক সিলেক্ট করুন</h4>
                        <select
                          id="selectMikrotikOption"
                          onChange={selectMikrotikOptionsHandler}
                          className="form-select"
                        >
                          <option value="showActiveMikrotikUser">
                            এক্টিভ গ্রাহক
                          </option>
                          <option value="showAllMikrotikUser">
                            সকল গ্রাহক
                          </option>
                        </select>
                      </div>
                      <div className="rightSideMikrotik">
                        <h4>রিফ্রেশ করুন</h4>

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
                    {whatYouWantToShow === "showActiveMikrotikUser" ? (
                      <>
                        <h2 className="secondaryTitle">এক্টিভ গ্রাহক</h2>

                        <div className="row searchCollector">
                          <div className="col-sm-8">
                            <h4 className="allCollector">
                              এক্টিভ গ্রাহক :{" "}
                              <span>{activeUser.length || "0"}</span>
                            </h4>
                          </div>

                          <div className="col-sm-4">
                            <div className="pppoeRefresh">
                              {/* Refresh: {refresh} */}

                              <div className=" collectorSearch">
                                <input
                                  type="text"
                                  className="search"
                                  placeholder="সার্চ"
                                  onChange={(e) => setSearch2(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="table-responsive-lg">
                          <table className="table table-striped ">
                            <thead>
                              <tr>
                                <th scope="col">সিরিয়াল</th>
                                <th scope="col">নাম</th>
                                <th scope="col">এড্রেস</th>
                                <th scope="col">RX</th>
                                <th scope="col">TX</th>
                                <th scope="col">আপ টাইম</th>
                                {/* <th scope="col" style={{ textAlign: "center" }}>
                              অ্যাকশন
                            </th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {mtkIsLoading ? (
                                <tr>
                                  <TdLoader colspan={6} />
                                </tr>
                              ) : (
                                activeUser.length &&
                                activeUser
                                  .filter((val) => {
                                    return val?.name
                                      .toString()
                                      .toLowerCase()
                                      .includes(
                                        search2.toString().toLowerCase()
                                      );
                                  })
                                  .map((val, key) => (
                                    <tr key={key}>
                                      <td style={{ paddingLeft: "30px" }}>
                                        {++serial}
                                      </td>
                                      <td
                                        style={{
                                          padding:
                                            "15px 15px 15px 0 !important",
                                        }}
                                      >
                                        {val?.name}
                                      </td>
                                      <td
                                        style={{
                                          padding:
                                            "15px 15px 15px 0 !important",
                                        }}
                                      >
                                        {val.address}
                                      </td>
                                      <td
                                        style={{
                                          padding:
                                            "15px 15px 15px 0 !important",
                                        }}
                                      >
                                        {(val.rxByte / 1024 / 1024).toFixed(2) +
                                          " MB"}
                                      </td>
                                      <td
                                        style={{
                                          padding:
                                            "15px 15px 15px 0 !important",
                                        }}
                                      >
                                        {(val.txByte / 1024 / 1024).toFixed(2) +
                                          " MB"}
                                      </td>
                                      <td
                                        style={{
                                          padding:
                                            "15px 15px 15px 0 !important",
                                        }}
                                      >
                                        {val.uptime
                                          .replace("w", "w ")
                                          .replace("d", "d ")
                                          .replace("h", "h ")
                                          .replace("m", "m ")
                                          .replace("s", "s")}
                                      </td>
                                      {/* <td style={{ textAlign: "center" }}>
                                    <ThreeDots className="dropdown-toggle ActionDots" />
                                  </td> */}
                                    </tr>
                                  ))
                              )}
                            </tbody>
                          </table>
                        </div>
                        <br />
                      </>
                    ) : (
                      ""
                    )}

                    {/* Active PPPoE users */}
                    {whatYouWantToShow === "showAllMikrotikUser" ? (
                      <>
                        <h2 className="secondaryTitle">সকল গ্রাহক</h2>
                        <div className="row searchCollector">
                          <div className="col-sm-8">
                            <h4 className="allCollector">
                              সকল গ্রাহক :{" "}
                              <span>
                                {" "}
                                {mtkIsLoading ? (
                                  <Loader />
                                ) : (
                                  allMikrotikUsers?.length
                                )}{" "}
                              </span>
                            </h4>
                          </div>

                          <div className="col-sm-4">
                            <div className="pppoeRefresh">
                              {/* Refresh: {refresh} */}

                              <div className=" collectorSearch">
                                <input
                                  type="text"
                                  className="search"
                                  placeholder="সার্চ"
                                  onChange={(e) => setSearch(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="table-responsive-lg">
                          <table className="table table-striped ">
                            <thead>
                              <tr>
                                <th scope="col">সিরিয়াল</th>
                                <th scope="col">নাম</th>
                                <th scope="col">কলার আইডি</th>
                                <th scope="col">প্যাকেজ</th>
                                {/* <th scope="col" style={{ textAlign: "center" }}>
                              অ্যাকশন
                            </th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {mtkIsLoading ? (
                                <tr>
                                  <TdLoader colspan={4} />
                                </tr>
                              ) : (
                                allMikrotikUsers
                                  .filter((val) => {
                                    return val?.name
                                      .toString()
                                      .toLowerCase()
                                      .includes(
                                        search.toString().toLowerCase()
                                      );
                                  })
                                  .map((val, key) => (
                                    <tr key={key}>
                                      <td style={{ paddingLeft: "30px" }}>
                                        {++serial2}
                                      </td>
                                      <td>{val?.name}</td>
                                      <td>{val.callerId}</td>
                                      <td>{val.profile}</td>
                                    </tr>
                                  ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      ""
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
