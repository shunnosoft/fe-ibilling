import React, { useEffect, useMemo, useState } from "react";
import "../collector/collector.css";
import "./configmikrotik.css";
import {
  PlugFill,
  PencilFill,
  ArrowLeftShort,
  ThreeDots,
  PenFill,
  ArchiveFill,
  PersonCheckFill,
  BagCheckFill,
  PersonLinesFill,
  WifiOff,
  Wifi,
  Check2Circle,
  FileExcelFill,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import ConfigMikrotikModal from "./configMikrotikModals/ConfigMikrotikModal";
import PPPoEpackageEditModal from "./configMikrotikModals/PPPoEpackageEditModal";

import Loader from "../../components/common/Loader";
import {
  fetchActivepppoeUser,
  fetchpppoePackage,
  fetchpppoeUser,
  fetchPackagefromDatabase,
  deletePPPoEpackage,
  fetchReseller,
  fetchMikrotik,
} from "../../features/apiCalls";
import { resetMikrotikUserAndPackage } from "../../features/mikrotikSlice";
import apiLink from "../../api/apiLink";
import { useLayoutEffect } from "react";
import Table from "../../components/table/Table";
import CustomerSync from "./configMikrotikModals/CustomerSync";
import { useTranslation } from "react-i18next";
import { CSVLink } from "react-csv";
import { getHotspotPackage } from "../../features/hotspotApi";
import { Tab, Tabs } from "react-bootstrap";
import Hotspot from "./hotspot/Hotspot";

export default function ConfigMikrotik() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { ispOwner, mikrotikId } = useParams();

  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  const singleMik = mikrotik.find((item) => item.id === mikrotikId);

  const allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  let [allUsers, setAllUsers] = useState(allMikrotikUsers);
  let pppoePackage = useSelector((state) => state?.mikrotik?.pppoePackage);
  const mtkIsLoading = useSelector((state) => state?.mikrotik?.isLoading);

  const [isLoading, setIsloading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [isLoadingPac, setIsLoadingPac] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [singlePackage, setSinglePackage] = useState("");

  const [customerType, setCustomerType] = useState();
  const [whatYouWantToShow, setWhatYouWantToShow] = useState(
    "showMikrotikPackage"
  );

  const [inActiveCustomer, setInActiveCustomer] = useState(false);
  const dispatch = useDispatch();

  //get Reseller
  useEffect(() => {
    fetchReseller(dispatch, ispOwner, setIsloading);
    fetchMikrotik(dispatch, ispOwner, setIsloading);
  }, []);

  // fetch single mikrotik

  useEffect(() => {
    const zeroRate = pppoePackage.filter(
      (i) =>
        i.rate === 0 && i.name !== "default-encryption" && i.name !== "default"
    );
    if (zeroRate.length !== 0) {
      toast.warn(`${zeroRate[0].name}  ${t("updateMikrotikRate")}`);
    }
  }, [pppoePackage]);

  useLayoutEffect(() => {
    const IDs = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
    };
    dispatch(resetMikrotikUserAndPackage());
    fetchPackagefromDatabase(dispatch, IDs, setIsloading, singleMik?.name);

    fetchpppoeUser(
      dispatch,
      IDs,
      singleMik?.name,
      setUserLoading,
      "mikrotikUser"
    );
  }, [ispOwner, mikrotikId]);

  // get single pppoe package
  const getSpecificPPPoEPackage = (id) => {
    setSinglePackage(id);
  };

  // delete single pppoe package
  const deleteSinglePPPoEpackage = async (mikrotikID, Id) => {
    const con = window.confirm(t("doWantDeletePackage"));
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

  const syncPackage = () => {
    if (window.confirm(t("syncMikrotikPackage"))) {
      const IDs = {
        ispOwner: ispOwner,
        mikrotikId: mikrotikId,
      };
      fetchpppoePackage(dispatch, IDs, setIsLoadingPac, singleMik?.name);
    }
  };

  // status filter
  const filterIt = (e) => {
    let temp;
    if (e.target.value === "allCustomer") {
      setAllUsers(allMikrotikUsers);
    } else if (e.target.value === "true") {
      temp = allMikrotikUsers.filter((item) => item.disabled == true);
      setAllUsers(temp);
    } else if (e.target.value === "false") {
      temp = allMikrotikUsers.filter((item) => item.disabled != true);
      setAllUsers(temp);
    }
  };

  // const sortedArr = [...pppoePackage].sort((a, b) => {
  //   if (a.name.includes("M") && b.name.includes("M")) {
  //     return parseInt(b.name) - parseInt(a.name);
  //   } else if (a.name.includes("k") && b.name.includes("k")) {
  //     return parseInt(b.name) - parseInt(a.name);
  //   }

  //   // return parseInt(b.name) - parseInt(a.name);
  // });

  useEffect(() => {
    setAllUsers(allMikrotikUsers);
  }, [allMikrotikUsers]);

  const columns1 = React.useMemo(
    () => [
      {
        width: "15%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("package"),
        accessor: "name",
      },
      {
        width: "20%",
        Header: t("rate"),
        accessor: "rate",
      },
      {
        width: "20%",
        Header: t("packageAliasName"),
        accessor: "aliasName",
      },

      {
        width: "20%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="dropdown">
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
                      <p className="actionP">{t("edit")}</p>
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
                      <p className="actionP">{t("delete")}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

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
            {original?.disabled ? (
              <Check2Circle color="red" />
            ) : (
              <Check2Circle color="green" />
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

  //export customer data
  let customerForCsVTableInfo = useMemo(
    () =>
      allUsers.map((customer) => {
        return {
          name: customer?.name,
          package: customer?.profile,
          status: customer?.running ? "Active" : "In Active",
          rxByte: customer?.rxByte
            ? (customer?.rxByte / 1024 / 1024).toFixed(2) + " MB"
            : "",
          txByte: customer?.txByte
            ? (customer?.txByte / 1024 / 1024).toFixed(2) + " MB"
            : "",
          lastLinkUpTime: customer?.lastLinkUpTime,
          lastLoggedOut: customer?.lastLoggedOut,
        };
      }),
    [allUsers]
  );

  // csv table header
  const customerForCsVTableInfoHeader = [
    { label: "name_of_client", key: "name" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "status", key: "status" },
    { label: "Rx Byte", key: "rxByte" },
    { label: "Tx Byte", key: "txByte" },
    { label: "Last Link UP Time", key: "lastLinkUpTime" },
    { label: "Last Logged Out", key: "lastLoggedOut" },
  ];
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
                <div className="d-flex collectorTitle px-4">
                  <div className="AllMikrotik mt-1" onClick={gotoAllMiktorik}>
                    <ArrowLeftShort className="arrowLeftSize" />
                    <span style={{ marginLeft: "3px" }}> {t("mikrotik")} </span>
                  </div>

                  <div className="mx-auto"> {t("mikrotikConfiguration")} </div>
                  {whatYouWantToShow === "showAllMikrotikUser" && (
                    <div className="addAndSettingIcon">
                      <CSVLink
                        data={customerForCsVTableInfo}
                        filename={ispOwnerData.company}
                        headers={customerForCsVTableInfoHeader}
                        title={t("mikrotikCustomerCsvDownload")}
                      >
                        <FileExcelFill className="addcutmButton" />
                      </CSVLink>
                    </div>
                  )}
                </div>
              </FourGround>

              <FourGround>
                <Tabs
                  defaultActiveKey={"pppoe"}
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="pppoe" title={t("PPPoE")}>
                    <div className="collectorWrapper mt-2 py-2">
                      <div className="addCollector">
                        <div className="addNewCollector showMikrotikUpperSection mx-auto">
                          <div className="LeftSideMikrotik justify-content-center">
                            {/* <p>মাইক্রোটিক কনফিগারেশন</p> */}

                            {isChecking ? (
                              <div className="CheckingClass">
                                <Loader />{" "}
                                <h6 style={{ paddingTop: "2px" }}>
                                  {t("checkConnection")}
                                </h6>{" "}
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="addAndSettingIcon">
                              <button
                                title={t("checkConnection")}
                                className="btn btn-outline-primary me-2"
                                onClick={MikrotikConnectionTest}
                              >
                                {t("checkConnection")}{" "}
                                <PlugFill className="rotating" />
                              </button>
                              <button
                                title={t("editMkrotik")}
                                data-bs-toggle="modal"
                                data-bs-target="#configMikrotikModal"
                                className="btn btn-outline-primary me-2  "
                              >
                                {t("edit")} <PencilFill />
                              </button>

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
                                  title={t("packageSync")}
                                  className="btn btn-outline-primary me-2 "
                                >
                                  {t("packageSync")} <BagCheckFill />
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
                                  title={t("PPPoECustomerSync")}
                                  className="btn btn-outline-primary me-2 "
                                >
                                  {t("PPPoECustomerSync")} <PersonCheckFill />
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
                                  title={t("staticCustomerSync")}
                                  className="btn btn-outline-primary me-2 "
                                >
                                  {t("staticCustomerSync")} <PersonLinesFill />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="d-flex mt-3">
                            <div className="mikrotikDetails me-5">
                              <p>
                                {t("name")} : <b>{singleMik?.name || "..."}</b>
                              </p>
                              <p>
                                {t("ip")} : <b>{singleMik?.host || "..."}</b>
                              </p>
                              <p>
                                {t("userName")} :{" "}
                                <b>{singleMik?.username || "..."}</b>
                              </p>
                              <p>
                                {t("port")} : <b>{singleMik?.port || "..."}</b>
                              </p>
                            </div>
                            <div className="rightSideMikrotik ms-5">
                              <h4> {t("select")} </h4>
                              <select
                                id="selectMikrotikOption"
                                className="form-select mt-0"
                                onChange={(event) =>
                                  setWhatYouWantToShow(event.target.value)
                                }
                              >
                                <option value="showMikrotikPackage">
                                  {t("PPPoEPackage")}
                                </option>
                                <option value="showAllMikrotikUser">
                                  {t("sokolCustomer")}
                                </option>
                              </select>
                            </div>

                            {whatYouWantToShow === "showAllMikrotikUser" && (
                              <div className="rightSideMikrotik ms-5">
                                <h4> {t("status")} </h4>
                                <select
                                  id="selectMikrotikOption"
                                  onChange={filterIt}
                                  className="form-select mt-0"
                                >
                                  <option value={"allCustomer"}>
                                    {t("sokolCustomer")}
                                  </option>
                                  <option value={"false"}>{t("active")}</option>
                                  <option value={"true"}>
                                    {t("in active")}
                                  </option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* PPPoE Package */}
                        {whatYouWantToShow === "showMikrotikPackage" ? (
                          <>
                            <h2 style={{ width: "100%", textAlign: "center" }}>
                              {t("package")}
                            </h2>
                            <Table
                              isLoading={isLoading}
                              columns={columns1}
                              data={pppoePackage}
                            ></Table>
                          </>
                        ) : (
                          ""
                        )}

                        {/* Active PPPoE users */}
                        {whatYouWantToShow === "showAllMikrotikUser" ? (
                          <>
                            <h2 style={{ width: "100%", textAlign: "center" }}>
                              {t("customer")}
                            </h2>
                            <Table
                              isLoading={userLoading}
                              columns={columns}
                              data={allUsers}
                            ></Table>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="hotspot" title={t("hotspot")}>
                    <Hotspot />
                  </Tab>
                </Tabs>
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
