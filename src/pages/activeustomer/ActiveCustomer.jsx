import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import "../configMikrotik/configmikrotik.css";
import {
  ArrowClockwise,
  WifiOff,
  Wifi,
  ThreeDots,
  PersonFill,
  Server,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";

import Loader from "../../components/common/Loader";
import { fetchMikrotik, fetchpppoeUser } from "../../features/apiCalls";

import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import BandwidthModal from "../Customer/BandwidthModal";
import moment from "moment/moment";

export default function ConfigMikrotik() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get all static customer
  let allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // mikrotik loading state
  const [loading, setIsloading] = useState(false);

  // customer id state
  const [customerId, setCustomerId] = useState("");

  //bandwidth modal state
  const [bandWidthModal, setBandWidthModal] = useState(false);

  // customer loading state
  const [mtkLoading, setMtkLoading] = useState(false);

  // set initialy mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // running status state
  const [runningStatus, setRunningStatus] = useState("");

  // status filter
  const [status, setStatus] = useState(null);

  // customer state
  let [allUsers, setAllUsers] = useState(allMikrotikUsers);

  // find single mikrotik details
  const singleMik = mikrotik.find((item) => item.id === mikrotikId);

  // select mikrotik handler
  const mikrotiSelectionHandler = (event) => {
    setMikrotikId(event.target.value);
  };
  const bandwidthModalController = (customerID) => {
    setCustomerId(customerID);
    setBandWidthModal(true);
  };

  // customer filter state
  const filterIt = (e) => {
    setStatus(e.target.value);
    let temp;
    if (e.target.value === "allCustomer") {
      setAllUsers(allMikrotikUsers);
    } else if (e.target.value === "online") {
      temp = allMikrotikUsers.filter((item) => item.running == true);
      setAllUsers(temp);
    } else if (e.target.value === "offline") {
      temp = allMikrotikUsers.filter((item) => item.running != true);
      setAllUsers(temp);
    }
  };

  const statusFilterHandler = (status) => {
    let statusFilter = [...allMikrotikUsers];
    if (status && status !== "allCustomer") {
      statusFilter = allMikrotikUsers.filter((item) => {
        if (item.status === "active" && status === "active") {
          return true;
        }
        if (item.status === "inactive" && status === "inactive") {
          return true;
        }
        if (
          status === "other" &&
          item.status !== "active" &&
          item.status !== "inactive" &&
          item.running !== true
        ) {
          return true;
        }
      });
    }
    setAllUsers(statusFilter);
  };

  // const filter = allMikrotikUsers.filter((item) => {
  //   if (item.status === "active") {
  //   } else if (item.status === "inactive") {
  //   } else {
  //     console.log(item);
  //   }
  // });

  // if (runningStatus) {
  //   let filterCustomer;

  //   if (runningStatus === "allCustomer") {
  //     setAllUsers(allMikrotikUsers);
  //   }

  //   if (runningStatus === "online") {
  //     filterCustomer = allMikrotikUsers.filter((item) => item.running == true);
  //     setAllUsers(filterCustomer);
  //   }
  //   if (runningStatus === "offline") {
  //     filterCustomer = allMikrotikUsers.filter((item) => item.running != true);
  //     setAllUsers(filterCustomer);
  //   }
  // }

  // if (status && status !== "allCustomer") {
  //   allMikrotikUsers = allMikrotikUsers.filter(
  //     (item) => item.status === status
  //   );
  // }

  // initialize id
  const IDs = {
    ispOwner: ispOwnerId,
    mikrotikId: mikrotikId,
  };

  // reload handler
  const reloadHandler = () => {
    fetchpppoeUser(
      dispatch,
      IDs,
      singleMik?.name,
      setMtkLoading,
      "mikrotikUser"
    );
    fetchMikrotik(dispatch, ispOwnerId, setIsloading);
  };

  // api call for get update static customer
  useEffect(() => {
    fetchMikrotik(dispatch, ispOwnerId, setIsloading);
    if (mikrotikId) {
      fetchpppoeUser(dispatch, IDs, singleMik?.name, setMtkLoading, "user");
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
        width: "8%",
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
        width: "15%",
        Header: "Last Link Up Time",
        accessor: "lastLinkUpTime",
      },
      // {
      //   width: "15%",
      //   Header: "Down Time",
      //   accessor: (data) => {
      //     if (!data.running) {
      //       console.log(data.lastLinkDownTime);
      //       return moment(data.lastLinkDownTime).startOf("hour").fromNow();
      //     }
      //   },
      // },
      // {
      //   width: "15%",
      //   Header: "Down Time",
      //   accessor: "lastLinkUpTime",
      //   Cell:(upTime)=>
      // },
      // {
      //   width: "9%",
      //   Header: () => <div className="text-center">{t("action")}</div>,
      //   id: "option",
      //   Cell: ({ row: { original } }) => (
      //     <div className="d-flex justify-content-center align-items-center">
      //       <div className="dropdown">
      //         <ThreeDots
      //           className="dropdown-toggle ActionDots"
      //           id="areaDropdown"
      //           type="button"
      //           data-bs-toggle="dropdown"
      //           aria-expanded="false"
      //         />
      //         <ul className="dropdown-menu" aria-labelledby="customerDrop">
      //           {(role === "ispOwner" || role === "manager") &&
      //             ispOwnerData.bpSettings.hasMikrotik && (
      //               <li onClick={() => bandwidthModalController(original?.id)}>
      //                 <div className="dropdown-item">
      //                   <div className="customerAction">
      //                     <Server />
      //                     <p className="actionP">{t("bandwidth")}</p>
      //                   </div>
      //                 </div>
      //               </li>
      //             )}
      //         </ul>
      //       </div>
      //     </div>
      //   ),
      // },
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
                    <div>{t("activeCustomer")}</div>
                    <div className="reloadBtn">
                      {mtkLoading ? (
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
                <div className="collectorWrapper mt-2 pt-4 py-2">
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

                    <div className="mikrotik-filter ms-4">
                      <h6 className="mb-0"> {t("selectCustomer")} </h6>
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
                    {/* {status === "offline" && (
                      <div className="mikrotik-filter ms-4">
                        <h6 className="mb-0"> {t("status")} </h6>
                        <select
                          id="selectMikrotikOption"
                          onChange={(event) =>
                            statusFilterHandler(event.target.value)
                          }
                          className="form-select mt-0"
                        >
                          <option value="allCustomer">
                            {t("sokolCustomer")}
                          </option>
                          <option value="active">{t("active")}</option>
                          <option value="inactive">{t("in active")}</option>
                          <option value="other">{t("other")}</option>
                        </select>
                      </div>
                    )} */}
                  </div>

                  {/* Active PPPoE users */}
                  <div className="table-section">
                    <Table
                      isLoading={mtkLoading}
                      columns={columns}
                      data={allUsers}
                    ></Table>
                  </div>
                  <BandwidthModal
                    setModalShow={setBandWidthModal}
                    modalShow={bandWidthModal}
                    customerId={customerId}
                  />
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
