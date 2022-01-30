import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import "./configmikrotik.css";
import {
  ArrowClockwise,
  PencilFill,
  ArrowLeftShort,
  Trash2Fill,
  // ThreeDots
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
// import { Link } from "react-router-dom";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ConfigMikrotikModal from "./configMikrotikModals/ConfigMikrotikModal";
import TdLoader from "../../components/common/TdLoader";

import {
  fetchMikrotik,
  fetchSingleMikrotik,
  getSingleMikrotik,
  deleteSingleMikrotik,
  fetchpppoeUser,
  mikrotikTesting,
  getPPPoEuser,
  fetchActivepppoeUser,
  getActiveUser,
} from "../../features/mikrotikSlice";
import Loader from "../../components/common/Loader";
// import TdLoader from "../../components/common/TdLoader";

export default function ConfigMikrotik() {
  const navigate = useNavigate();

  let serial = 0;
  let serial2 = 0;
  const { ispOwner, mikrotikId } = useParams();
  const singleMik = useSelector(getSingleMikrotik);
  const [search, setSearch] = useState("");
  const pppoeUser = useSelector(getPPPoEuser);
  const activeUser = useSelector(getActiveUser);
  const [isLoading, setIsloading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [refresh2, setRefresh2] = useState(0);
  const dispatch = useDispatch();

  console.log("active user: ", activeUser);

  // fetch single mikrotik
  useEffect(() => {
    const IDs = {
      ispOwner: ispOwner,
      id: mikrotikId,
    };
    dispatch(fetchSingleMikrotik(IDs));
  }, [ispOwner, mikrotikId, dispatch]);

  // fetch pppoe user
  useEffect(() => {
    const IDs = {
      ispOwner: ispOwner,
      id: mikrotikId,
    };
    dispatch(fetchpppoeUser(IDs));
  }, [ispOwner, mikrotikId, dispatch, refresh]);

  // fetch Active user
  useEffect(() => {
    const IDs = {
      ispOwner: ispOwner,
      id: mikrotikId,
    };
    dispatch(fetchActivepppoeUser(IDs));
  }, [ispOwner, mikrotikId, dispatch, refresh2]);

  const gotoAllMiktorik = () => {
    navigate("/mikrotik");
  };

  const deleteSingleMKHandler = async () => {
    if (window.confirm("মাইক্রোটিক ডিলিট করতে চান?") === true) {
      setIsloading(true);
      const IDs = {
        ispOwner: ispOwner,
        id: mikrotikId,
      };
      const res = await dispatch(deleteSingleMikrotik(IDs));
      if (res) {
        setIsloading(false);
        dispatch(fetchMikrotik(ispOwner));
        navigate("/mikrotik");
      }
    }
  };

  const MikrotikConnectionTest = async () => {
    setIsChecking(true);
    const IDs = {
      ispOwner: ispOwner,
      id: mikrotikId,
    };
    const response = await dispatch(mikrotikTesting(IDs));
    if (response) {
      setIsChecking(false);
    }
  };
  return (
    <>
      <Sidebar />
      <ToastContainer
        toastStyle={{
          backgroundColor: "#677078",
          color: "white",
          fontWeight: "500",
        }}
      />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              {/* modals */}
              <ConfigMikrotikModal mik={singleMik} />
              <FourGround>
                <h2 className="collectorTitle">মাইক্রোটিক কনফিগারেশন</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector">
                      <p>মাইক্রোটিক কনফিগারেশন</p>

                      {isChecking ? (
                        <div className="CheckingClass">
                          <Loader />{" "}
                          <h6 style={{ paddingTop: "2px" }}>
                            কানেকশন চেক করা হচ্ছে ....
                          </h6>{" "}
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="addAndSettingIcon">
                        <PencilFill
                          className="addcutmButton"
                          data-bs-toggle="modal"
                          data-bs-target="#configMikrotikModal"
                        />
                        <ArrowClockwise
                          className="addcutmButton rotating"
                          onClick={MikrotikConnectionTest}
                        />
                        <Trash2Fill
                          className="addcutmButton deleteColorBtn"
                          onClick={deleteSingleMKHandler}
                        />
                        {isLoading ? (
                          <div className="deletingAction">
                            <Loader /> <b>Deleting...</b>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="mikrotikDetails mt-5">
                        <p>
                          নামঃ <b>{singleMik.name || "..."}</b>
                        </p>
                        <p>
                          আইপিঃ <b>{singleMik.host || "..."}</b>
                        </p>
                        <p>
                          ইউজারনেমঃ <b>{singleMik.username || "..."}</b>
                        </p>
                        <p>
                          পোর্টঃ <b>{singleMik.port || "..."}</b>
                        </p>
                      </div>
                    </div>

                    <div className="AllMikrotik" onClick={gotoAllMiktorik}>
                      <ArrowLeftShort className="arrowLeftSize" />
                      <span style={{ marginLeft: "3px" }}>সকল মাইক্রোটিক</span>
                    </div>

                    {/* PPPoE Package */}
                    <h2 className="secondaryTitle">PPPoE প্যাকেজ</h2>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          PPPoE প্যাকেজ: <span>1</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className=" collectorSearch">
                          <input
                            type="text"
                            className="search"
                            placeholder="সার্চ এর জন্য নাম টাইপ করুন"
                            // onChange={(e) => setMsearch(e.target.value)}
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
                          <th scope="col">হোস্ট</th>
                          <th scope="col">পোর্ট</th>
                          <th scope="col" style={{ textAlign: "center" }}>
                            অ্যাকশন
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ paddingLeft: "30px" }}>Td</td>
                          <td>Td</td>
                          <td>Td</td>
                          <td>Td</td>
                          <td style={{ textAlign: "center" }}>Td</td>
                        </tr>
                      </tbody>
                    </table>
                    <br />

                    {/* PPPoE users */}
                    <h2 className="secondaryTitle">PPPoE গ্রাহক</h2>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          PPPoE গ্রাহক :{" "}
                          <span>{pppoeUser.length || "NULL"}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className="pppoeRefresh">
                          {/* Refresh: {refresh} */}
                          <ArrowClockwise
                            className="addcutmButton"
                            onClick={() => setRefresh(refresh + 1)}
                          />
                          <div className=" collectorSearch">
                            <input
                              type="text"
                              className="search"
                              placeholder="সার্চ এর জন্য নাম টাইপ করুন"
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
                            <th scope="col">প্যাকেজ</th>
                            <th scope="col">সার্ভিস</th>
                            {/* <th scope="col" style={{ textAlign: "center" }}>
                              অ্যাকশন
                            </th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {pppoeUser.length === undefined ? (
                            <tr>
                              <TdLoader colspan={4} />
                            </tr>
                          ) : (
                            pppoeUser
                              .filter((val) => {
                                return val.name
                                  .toLowerCase()
                                  .includes(search.toLowerCase());
                              })
                              .map((val, key) => (
                                <tr key={key}>
                                  <td style={{ paddingLeft: "30px" }}>
                                    {++serial}
                                  </td>
                                  <td>{val.name}</td>
                                  <td>{val.profile}</td>
                                  <td>{val.service}</td>
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

                    {/* Active PPPoE users */}
                    <h2 className="secondaryTitle">এক্টিভ গ্রাহক</h2>
                    <div className="row searchCollector">
                      <div className="col-sm-8">
                        <h4 className="allCollector">
                          এক্টিভ গ্রাহক :{" "}
                          <span>{activeUser.length || "NULL"}</span>
                        </h4>
                      </div>

                      <div className="col-sm-4">
                        <div className="pppoeRefresh">
                          {/* Refresh: {refresh} */}
                          <ArrowClockwise
                            className="addcutmButton"
                            onClick={() => setRefresh2(refresh2 + 1)}
                          />
                          <div className=" collectorSearch">
                            <input
                              type="text"
                              className="search"
                              placeholder="সার্চ এর জন্য নাম টাইপ করুন"
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
                            <th scope="col">কলার ID</th>
                            <th scope="col">এড্রেস</th>
                            {/* <th scope="col" style={{ textAlign: "center" }}>
                              অ্যাকশন
                            </th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {activeUser.length === undefined ? (
                            <tr>
                              <TdLoader colspan={4} />
                            </tr>
                          ) : (
                            activeUser
                              .filter((val) => {
                                return val.name
                                  .toLowerCase()
                                  .includes(search.toLowerCase());
                              })
                              .map((val, key) => (
                                <tr key={key}>
                                  <td style={{ paddingLeft: "30px" }}>
                                    {++serial2}
                                  </td>
                                  <td>{val.name}</td>
                                  <td>{val.callerId}</td>
                                  <td>{val.address}</td>
                                  {/* <td style={{ textAlign: "center" }}>
                                    <ThreeDots className="dropdown-toggle ActionDots" />
                                  </td> */}
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
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
