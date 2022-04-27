import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import "./configmikrotik.css";
import {
  PlugFill,
  ArrowClockwise,
  PencilFill,
  ArrowLeftShort,
  ThreeDots,
  PenFill,
  ArchiveFill,
  PersonSquare,
  PersonCheckFill,
  BagCheckFill,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
// import { Link } from "react-router-dom";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ConfigMikrotikModal from "./configMikrotikModals/ConfigMikrotikModal";
import TdLoader from "../../components/common/TdLoader";
import PPPoEpackageEditModal from "./configMikrotikModals/PPPoEpackageEditModal";

import Loader from "../../components/common/Loader";
import {
  fetchActivepppoeUser,
  fetchMikrotik,
  fetchMikrotikSyncUser,
  fetchpppoePackage,
  fetchpppoeUser,
  fetchPackagefromDatabase,
  deletePPPoEpackage,
} from "../../features/apiCalls";
import { resetMikrotikUserAndPackage } from "../../features/mikrotikSlice";
import apiLink from "../../api/apiLink";
import { clearMikrotik } from "../../features/mikrotikSlice";
import { useLayoutEffect } from "react";
// import TdLoader from "../../components/common/TdLoader";

export default function ConfigMikrotik() {
  const navigate = useNavigate();

  let serial = 0;
  let serial2 = 0;
  let serial3 = 0;
  const { ispOwner, mikrotikId } = useParams();
  const mikrotik = useSelector(
    (state) => state.persistedReducer.mikrotik.mikrotik
  );
  const singleMik = mikrotik.find((item) => item.id === mikrotikId)
    ? mikrotik.find((item) => item.id === mikrotikId)
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
  const mtkIsLoading = useSelector(
    (state) => state.persistedReducer.mikrotik.isLoading
  );
  // const mikrotikSyncUser = useSelector(
  //   state => state.mikrotik.mikrotikSyncUser
  // );

  // const [isLoading, setIsloading] = useState(false);
  const [isLoadingPac, setIsLoadingPac] = useState(false);
  const [isLoadingCus, setIsLoadingCus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [singlePackage, setSinglePackage] = useState("");
  const [whatYouWantToShow, setWhatYouWantToShow] = useState(
    "showMikrotikPackage"
  );
  const [refresh, setRefresh] = useState(0);
  const [refresh2, setRefresh2] = useState(0);
  // const [syncUserRefresh, setSyncUserRefresh] = useState(0);
  const dispatch = useDispatch();

  // fetch single mikrotik

  useEffect(() => {
    const zeroRate = pppoePackage.filter(
      (i) =>
        i.rate === 0 && i.name !== "default-encryption" && i.name !== "default"
    );
    if (zeroRate.length !== 0) {
      toast.warn(`${zeroRate[0].name} প্যাকেজ
      এর রেট আপডেট করুন`);
    }
  }, [pppoePackage]);

  useLayoutEffect(() => {
    const IDs = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
    };
    // dispatch(clearMikrotik());
    // fetchMikrotik(dispatch, ispOwner);

    // fetchpppoeUser(dispatch, IDs);
    // fetchpppoePackage(dispatch, IDs, setIsLoadingPac);
    // fetchMikrotikSyncUser(dispatch, IDs, setIsLoadingCus);
    // fetchActivepppoeUser(dispatch, IDs);
    dispatch(resetMikrotikUserAndPackage());
    fetchPackagefromDatabase(dispatch, IDs, singleMik?.name);
  }, [ispOwner, mikrotikId, dispatch]);

  // get single pppoe package
  const getSpecificPPPoEPackage = (id) => {
    if (pppoePackage.length !== undefined) {
      const temp = pppoePackage.find((val) => {
        return val.id === id;
      });
      setSinglePackage(temp);
    }
  };

  // delete single pppoe package
  const deleteSinglePPPoEpackage = async (mikrotikID, Id) => {
    const con = window.confirm("আপনি কি প্যাকেজ ডিলিট করতে চান?");
    if (con) {
      setIsDeleting(true);
      const IDs = {
        mikrotikId: mikrotikID,
        pppPackageId: Id,
      };

      deletePPPoEpackage(dispatch, IDs, singleMik?.name);
    }
  };

  // fetch Active user

  const gotoAllMiktorik = () => {
    navigate("/mikrotik");
  };

  // const deleteSingleMKHandler = async () => {
  //   if (window.confirm("মাইক্রোটিক ডিলিট করতে চান?") === true) {
  //     const IDs = {
  //       ispOwner: ispOwner,
  //       id: mikrotikId,
  //     };
  //     deleteSingleMikrotik(dispatch, IDs, setIsloading, navigate);
  //   }
  // };

  const MikrotikConnectionTest = async () => {
    setIsChecking(true);

    await apiLink({
      method: "GET",
      url: `/mikrotik/testConnection/${ispOwner}/${mikrotikId}`,
    })
      .then(() => {
        setIsChecking(false);
        toast.success(`${singleMik?.name} এর কানেকশন ঠিক আছে`);
      })
      .catch(() => {
        setIsChecking(false);

        toast.error(`দুঃখিত, ${singleMik?.name} এর কানেকশন ঠিক নেই!`);
      });
  };

  const selectMikrotikOptionsHandler = (e) => {
    const val = e.target.value;

    const IDs = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
    };

    dispatch(resetMikrotikUserAndPackage());

    if (val === "showActiveMikrotikUser") {
      fetchActivepppoeUser(dispatch, IDs, singleMik?.name);
      setWhatYouWantToShow("showActiveMikrotikUser");
    } else if (val === "showAllMikrotikUser") {
      fetchpppoeUser(dispatch, IDs, singleMik?.name);
      setWhatYouWantToShow("showAllMikrotikUser");
    } else if (val === "showMikrotikPackage") {
      fetchPackagefromDatabase(dispatch, IDs, singleMik?.name);
      setWhatYouWantToShow("showMikrotikPackage");
    }

    // setWhatYouWantToShow(val);
  };

  const syncCustomer = () => {
    if (window.confirm("আপনি কি মাইক্রোটিকের গ্রাহক সিংক করতে চান?")) {
      const IDs = {
        ispOwner: ispOwner,
        mikrotikId: mikrotikId,
      };
      fetchMikrotikSyncUser(dispatch, IDs, setIsLoadingCus, singleMik?.name);
    }
  };
  const syncPackage = () => {
    if (window.confirm("আপনি কি মাইক্রোটিকের প্যাকেজ সিংক করতে চান?")) {
      const IDs = {
        ispOwner: ispOwner,
        mikrotikId: mikrotikId,
      };
      fetchpppoePackage(dispatch, IDs, setIsLoadingPac, singleMik?.name);
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
              <ConfigMikrotikModal mik={singleMik} />
              <FourGround>
                <h2 className="collectorTitle">মাইক্রোটিক কনফিগারেশন</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector showMikrotikUpperSection">
                      <div className="LeftSideMikrotik">
                        <p>মাইক্রোটিক কনফিগারেশন</p>

                        {/* Modals */}
                        <PPPoEpackageEditModal singlePackage={singlePackage} />

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
                          <button
                            title="কানেকশন চেক"
                            className="addcutmButton  btnbyEnamul"
                            onClick={MikrotikConnectionTest}
                          >
                            <PlugFill className="rotating" />
                          </button>
                          <button
                            title="মাইক্রোটিক এডিট"
                            data-bs-toggle="modal"
                            data-bs-target="#configMikrotikModal"
                            className="btnbyEnamul addcutmButton"
                          >
                            <PencilFill />
                          </button>

                          {/* <Trash2Fill
                            className="addcutmButton deleteColorBtn"
                            // onClick={deleteSingleMKHandler}
                          /> */}

                          {mtkIsLoading ? (
                            <span>
                              <Loader />
                            </span>
                          ) : (
                            <button
                              disabled={pppoePackage.some(
                                (i) =>
                                  i.rate === 0 &&
                                  i.name !== "default-encryption" &&
                                  i.name !== "default"
                              )}
                              onClick={syncPackage}
                              title="প্যাকেজ সিংক"
                              className="addcutmButton btnbyEnamul"
                            >
                              <BagCheckFill />
                            </button>
                          )}

                          {mtkIsLoading ? (
                            <span>
                              <Loader />
                            </span>
                          ) : (
                            <button
                              onClick={syncCustomer}
                              title="গ্রাহক সিংক"
                              className="addcutmButton btnbyEnamul"
                            >
                              <PersonCheckFill />
                            </button>
                          )}

                          {/* {isLoading ? (
                            <div className="deletingAction">
                              <Loader /> <b>Deleting...</b>
                            </div>
                          ) : (
                            ""
                          )} */}
                        </div>
                        <div className="mikrotikDetails mt-5">
                          <p>
                            নামঃ <b>{singleMik?.name || "..."}</b>
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
                      <div className="rightSideMikrotik">
                        <h4>সিলেক্ট করুন</h4>
                        <select
                          id="selectMikrotikOption"
                          onChange={selectMikrotikOptionsHandler}
                          className="form-select"
                        >
                          <option value="showMikrotikPackage">
                            PPPoE প্যাকেজ
                          </option>
                          <option value="showAllMikrotikUser">
                            সকল গ্রাহক
                          </option>
                          <option value="showActiveMikrotikUser">
                            এক্টিভ গ্রাহক
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="AllMikrotik" onClick={gotoAllMiktorik}>
                      <ArrowLeftShort className="arrowLeftSize" />
                      <span style={{ marginLeft: "3px" }}>সকল মাইক্রোটিক</span>
                    </div>

                    {/* PPPoE Package */}
                    {whatYouWantToShow === "showMikrotikPackage" ? (
                      <>
                        <h2 className="secondaryTitle">প্যাকেজ</h2>
                        <div className="row searchCollector">
                          <div className="col-sm-8">
                            <h4 className="allCollector">
                              প্যাকেজ:{" "}
                              <span>
                                {" "}
                                {mtkIsLoading ? (
                                  <Loader />
                                ) : (
                                  pppoePackage?.length
                                )}{" "}
                              </span>
                            </h4>
                          </div>

                          <div className="col-sm-4">
                            <div className=" collectorSearch">
                              <input
                                type="text"
                                className="search"
                                placeholder="প্যাকেজ সার্চ করুন"
                                onChange={(e) => setSearch3(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        {/* {isDeleting ? (
                          <div className="deletingLoader">
                            <Loader />
                            <span style={{ marginLeft: "10px" }}>
                              Deleting...
                            </span>
                          </div>
                        ) : (
                          ""
                        )} */}

                        <div className="table-responsive-lg">
                          <table className="table table-striped ">
                            <thead>
                              <tr>
                                <th scope="col">সিরিয়াল</th>
                                <th scope="col">প্যাকেজ</th>
                                <th scope="col">রেট</th>
                                <th scope="col" style={{ textAlign: "center" }}>
                                  অ্যাকশন
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {mtkIsLoading ? (
                                <tr>
                                  <TdLoader colspan={4} />
                                </tr>
                              ) : (
                                pppoePackage
                                  .filter((val) => {
                                    return val.name
                                      .toString()
                                      .toLowerCase()
                                      .includes(
                                        search3.toString().toLowerCase()
                                      );
                                  })
                                  .map((val, key) => (
                                    <tr key={key}>
                                      <td style={{ paddingLeft: "30px" }}>
                                        {++serial3}
                                      </td>
                                      <td>{val.name}</td>
                                      <td>{val.rate}</td>
                                      <td style={{ textAlign: "center" }}>
                                        <ThreeDots
                                          className="dropdown-toggle ActionDots"
                                          id="pppoePackageDropdown"
                                          type="button"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        />

                                        {/* modal */}
                                        <ul
                                          className="dropdown-menu"
                                          aria-labelledby="pppoePackageDropdown"
                                        >
                                          <li
                                            data-bs-toggle="modal"
                                            data-bs-target="#pppoePackageEditModal"
                                            onClick={() => {
                                              getSpecificPPPoEPackage(val.id);
                                            }}
                                          >
                                            <div className="dropdown-item">
                                              <div className="customerAction">
                                                <PenFill />
                                                <p className="actionP">এডিট</p>
                                              </div>
                                            </div>
                                          </li>

                                          <li
                                            onClick={() => {
                                              deleteSinglePPPoEpackage(
                                                val.mikrotik,
                                                val.id
                                              );
                                            }}
                                          >
                                            <div className="dropdown-item actionManager">
                                              <div className="customerAction">
                                                <ArchiveFill />
                                                <p className="actionP">ডিলিট</p>
                                              </div>
                                            </div>
                                          </li>
                                        </ul>
                                      </td>
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

                    {/* PPPoE users */}
                    {whatYouWantToShow === "showActiveMikrotikUser" ? (
                      <>
                        <h2 className="secondaryTitle">এক্টিভ গ্রাহক</h2>
                        <div className="row searchCollector">
                          <div className="col-sm-8">
                            <h4 className="allCollector">
                              এক্টিভ গ্রাহক :{" "}
                              <span>
                                {" "}
                                {mtkIsLoading ? (
                                  <Loader />
                                ) : (
                                  activeUser?.length
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
                                activeUser
                                  .filter((val) => {
                                    return val?.name
                                      ?.toString()
                                      ?.toLowerCase()
                                      ?.includes(
                                        search2.toString()?.toLowerCase()
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
                                        {val.name}
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
                                          " MB/s"}
                                      </td>
                                      <td
                                        style={{
                                          padding:
                                            "15px 15px 15px 0 !important",
                                        }}
                                      >
                                        {(val.txByte / 1024 / 1024).toFixed(2) +
                                          " MB/s"}
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
                                    return val.name
                                      .toString()
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
