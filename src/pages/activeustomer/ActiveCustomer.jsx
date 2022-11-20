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

  // initialize id
  const IDs = {
    ispOwner: ispOwnerId,
    mikrotikId: mikrotikId,
  };

  // reload handler
  const reloadHandler = () => {
    fetchpppoeUser(dispatch, IDs, singleMik?.name, setMtkLoading, "user");
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
        width: "10%",
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
        width: "13%",
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
        Header: t("package"),
        accessor: "profile",
      },
      {
        width: "9%",
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
        width: "9%",
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
        width: "18%",
        Header: "Last Link Up Time",
        accessor: "lastLinkUpTime",
      },
      {
        width: "9%",
        Header: t("action"),
        // accessor: "lastLinkUpTime",
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
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                {(role === "ispOwner" || role === "manager") &&
                  ispOwnerData.bpSettings.hasMikrotik && (
                    <li onClick={() => bandwidthModalController(original.id)}>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <Server />
                          <p className="actionP">{t("bandwidth")}</p>
                        </div>
                      </div>
                    </li>
                  )}
              </ul>
            </div>
          </div>
        ),
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
                <div className="collectorWrapper mt-2 pt-4">
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
