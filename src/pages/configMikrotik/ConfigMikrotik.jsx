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
  PersonLinesFill,
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
  syncMikrotikStaticUser,
  fetchpppoePackage,
  fetchpppoeUser,
  fetchPackagefromDatabase,
  deletePPPoEpackage,
} from "../../features/apiCalls";
import { resetMikrotikUserAndPackage } from "../../features/mikrotikSlice";
import apiLink from "../../api/apiLink";
import { clearMikrotik } from "../../features/mikrotikSlice";
import { useLayoutEffect } from "react";
import Table from "../../components/table/Table";
import CustomerSync from "./configMikrotikModals/CustomerSync";
// import TdLoader from "../../components/common/TdLoader";

export default function ConfigMikrotik() {
  const navigate = useNavigate();

  let serial = 0;
  let serial2 = 0;
  let serial3 = 0;
  const { ispOwner, mikrotikId } = useParams();
  const mikrotik = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.mikrotik
  );
  const singleMik = mikrotik.find((item) => item.id === mikrotikId)
    ? mikrotik.find((item) => item.id === mikrotikId)
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
  const pppoePackage = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.pppoePackage
  );
  const mtkIsLoading = useSelector(
    (state) => state?.persistedReducer?.mikrotik?.isLoading
  );
  // const mikrotikSyncUser = useSelector(
  //   state => state.mikrotik.mikrotikSyncUser
  // );

  const [isLoading, setIsloading] = useState(false);
  const [isLoadingPac, setIsLoadingPac] = useState(false);
  const [isLoadingCus, setIsLoadingCus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [singlePackage, setSinglePackage] = useState("");
  const [customerType, setCustomerType] = useState();
  const [whatYouWantToShow, setWhatYouWantToShow] = useState(
    "showMikrotikPackage"
  );
  const [inActiveCustomer, setInActiveCustomer] = useState(false);
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
    // if (pppoePackage.length !== undefined) {
    //   const temp = pppoePackage.find((original) => {
    //     return original.id === id;
    //   });
    setSinglePackage(id);
    // }
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
    const original = e.target.value;

    const IDs = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
    };

    dispatch(resetMikrotikUserAndPackage());

    if (original === "showActiveMikrotikUser") {
      fetchActivepppoeUser(dispatch, IDs, singleMik?.name, setIsloading);
      setWhatYouWantToShow("showActiveMikrotikUser");
    } else if (original === "showAllMikrotikUser") {
      fetchpppoeUser(dispatch, IDs, singleMik?.name, setIsloading);
      setWhatYouWantToShow("showAllMikrotikUser");
    } else if (original === "showMikrotikPackage") {
      fetchPackagefromDatabase(dispatch, IDs, singleMik?.name);
      setWhatYouWantToShow("showMikrotikPackage");
    }

    // setWhatYouWantToShow(original);
  };

  // const syncCustomer = (PPPoE) => {
  //   console.log(PPPoE);
  //   if (window.confirm("আপনি কি মাইক্রোটিকের গ্রাহক সিংক করতে চান?")) {
  //     const IDs = {
  //       ispOwner: ispOwner,
  //       mikrotikId: mikrotikId,
  //     };
  //     fetchMikrotikSyncUser(dispatch, IDs, setIsLoadingCus, singleMik?.name);
  //   }
  // };

  // const syncStaticCustomer = () => {
  //   if (
  //     window.confirm("আপনি কি মাইক্রোটিকের স্ট্যাটিক গ্রাহক সিংক করতে চান?")
  //   ) {
  //     const IDs = {
  //       ispOwner: ispOwner,
  //       mikrotikId: mikrotikId,
  //     };
  //     syncMikrotikStaticUser(dispatch, IDs, setIsLoadingCus, singleMik?.name);
  //   }
  // };

  const syncPackage = () => {
    if (window.confirm("আপনি কি মাইক্রোটিকের প্যাকেজ সিংক করতে চান?")) {
      const IDs = {
        ispOwner: ispOwner,
        mikrotikId: mikrotikId,
      };
      fetchpppoePackage(dispatch, IDs, setIsLoadingPac, singleMik?.name);
    }
  };
  const columns1 = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "প্যাকেজ",
        accessor: "name",
      },
      {
        Header: "রেট",
        accessor: "rate",
      },

      {
        Header: () => <div className="text-center">অ্যাকশন</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="areaDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul
              className="dropdown-menu"
              aria-labelledby="pppoePackageDropdown"
            >
              <li
                data-bs-toggle="modal"
                data-bs-target="#pppoePackageEditModal"
                onClick={() => {
                  getSpecificPPPoEPackage(original.id);
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
                  deleteSinglePPPoEpackage(original.mikrotik, original.id);
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
          </div>
        ),
      },
    ],
    []
  );
  const columns2 = React.useMemo(
    () => [
      {
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "নাম",
        accessor: "name",
      },
      {
        Header: "এড্রেস",
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
            {(original.rxByte / 1024 / 1024).toFixed(2) + " MB"}
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
            {(original.txByte / 1024 / 1024).toFixed(2) + " MB"}
          </div>
        ),
      },

      {
        Header: "আপ টাইম",
        accessor: "uptime",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {original.uptime
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
        Header: "সিরিয়াল",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: "নাম",
        accessor: "name",
      },
      {
        Header: "কলার আইডি",
        accessor: "callerId",
      },
      {
        Header: "প্যাকেজ",
        accessor: "profile",
      },
    ],
    []
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
              <ConfigMikrotikModal mik={singleMik} />
              <FourGround>
                <h2 className="collectorTitle">মাইক্রোটিক কনফিগারেশন</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="addCollector">
                    <div className="addNewCollector showMikrotikUpperSection mx-auto">
                      <div className="LeftSideMikrotik justify-content-center">
                        {/* <p>মাইক্রোটিক কনফিগারেশন</p> */}

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
                            className="btn btn-outline-primary me-2"
                            onClick={MikrotikConnectionTest}
                          >
                            কানেকশন চেক <PlugFill className="rotating" />
                          </button>
                          <button
                            title="মাইক্রোটিক এডিট"
                            data-bs-toggle="modal"
                            data-bs-target="#configMikrotikModal"
                            className="btn btn-outline-primary me-2  "
                          >
                            এডিট <PencilFill />
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
                              className="btn btn-outline-primary me-2 "
                            >
                              প্যাকেজ সিংক <BagCheckFill />
                            </button>
                          )}

                          {mtkIsLoading ? (
                            <span>
                              <Loader />
                            </span>
                          ) : (
                            <button
                              data-bs-toggle="modal"
                              data-bs-target="#SyncCustomer"
                              onClick={() => {
                                setInActiveCustomer(false);
                                setCustomerType("PPPoE");
                              }}
                              title="PPPoE গ্রাহক সিংক"
                              className="btn btn-outline-primary me-2 "
                            >
                              PPPoE গ্রাহক সিংক <PersonCheckFill />
                            </button>
                          )}

                          {mtkIsLoading ? (
                            <span>
                              <Loader />
                            </span>
                          ) : (
                            <button
                              data-bs-toggle="modal"
                              data-bs-target="#SyncCustomer"
                              onClick={() => {
                                setInActiveCustomer(false);
                                setCustomerType("static");
                              }}
                              title="স্ট্যাটিক গ্রাহক সিংক"
                              className="btn btn-outline-primary me-2 "
                            >
                              স্ট্যাটিক গ্রাহক সিংক <PersonLinesFill />
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
                      </div>

                      <div className="d-flex mt-3">
                        <div className="mikrotikDetails me-5">
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
                        <div className="rightSideMikrotik ms-5">
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
                    </div>

                    <div className="AllMikrotik" onClick={gotoAllMiktorik}>
                      <ArrowLeftShort className="arrowLeftSize" />
                      <span style={{ marginLeft: "3px" }}>সকল মাইক্রোটিক</span>
                    </div>

                    {/* PPPoE Package */}
                    {whatYouWantToShow === "showMikrotikPackage" ? (
                      <>
                        <h2 style={{ width: "100%", textAlign: "center" }}>
                          প্যাকেজ
                        </h2>
                        <Table columns={columns1} data={pppoePackage}></Table>
                      </>
                    ) : (
                      ""
                    )}

                    {/* PPPoE users */}
                    {whatYouWantToShow === "showActiveMikrotikUser" ? (
                      <>
                        <h2 style={{ width: "100%", textAlign: "center" }}>
                          এক্টিভ গ্রাহক
                        </h2>
                        <Table columns={columns2} data={activeUser}></Table>
                      </>
                    ) : (
                      ""
                    )}

                    {/* Active PPPoE users */}
                    {whatYouWantToShow === "showAllMikrotikUser" ? (
                      <>
                        <h2 style={{ width: "100%", textAlign: "center" }}>
                          সকল গ্রাহক
                        </h2>
                        <Table
                          columns={columns3}
                          data={allMikrotikUsers}
                        ></Table>
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
      {/* Modals */}
      <PPPoEpackageEditModal singlePackage={singlePackage} />
      <CustomerSync
        mikrotikId={mikrotikId}
        ispOwner={ispOwner}
        customerType={customerType}
        inActiveCustomer={inActiveCustomer}
        setInActiveCustomer={setInActiveCustomer}
      />
    </>
  );
}
