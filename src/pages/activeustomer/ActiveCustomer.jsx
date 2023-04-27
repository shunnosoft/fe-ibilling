import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import "../configMikrotik/configmikrotik.css";
import {
  ArrowClockwise,
  WifiOff,
  Wifi,
  ThreeDots,
  ArchiveFill,
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
import moment from "moment";
import CustomerDelete from "../Customer/customerCRUD/CustomerDelete";

export default function ConfigMikrotik() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get all static customer
  let allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );
  console.log(bpSettings);

  // mikrotik loading state
  const [loading, setIsloading] = useState(false);

  // customer id state
  const [customerId, setCustomerId] = useState("");

  // customer loading state
  const [mtkLoading, setMtkLoading] = useState(false);

  // set initialy mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // customer state
  let [allUsers, setAllUsers] = useState(allMikrotikUsers);

  // customer id state
  const [customerDeleteId, setCustomerDeleteId] = useState("");

  // customer id state
  const [bandWidthCustomerId, setBandWidthCustomerId] = useState("");

  //bandwidth modal state
  const [bandWidthModal, setBandWidthModal] = useState(false);

  // check uncheck mikrotik state when delete customer
  const [checkMikrotik, setMikrotikCheck] = useState(false);

  // customer filter state
  const [customerIt, setCustomerIt] = useState("");

  // offline customer state
  const [customerItData, setCustomerItData] = useState("");

  // find single mikrotik details
  const singleMik = mikrotik.find((item) => item.id === mikrotikId);

  // select mikrotik handler
  const mikrotiSelectionHandler = (event) => {
    setMikrotikId(event.target.value);
  };

  // customer filter state
  const filterIt = (e) => {
    let temp;
    if (e.target.value === "allCustomer") {
      setAllUsers(allMikrotikUsers);
      setCustomerIt("");
    } else if (e.target.value === "online") {
      temp = allMikrotikUsers.filter((item) => item.running == true);
      setAllUsers(temp);
      setCustomerIt("");
    } else if (e.target.value === "offline") {
      temp = allMikrotikUsers.filter((item) => item.running != true);
      setAllUsers(temp);
      setCustomerIt("offline");
    }
    setCustomerItData(temp);
  };

  // customer online offline filter handler
  const customerItFilter = (e) => {
    let customer;
    if (e.target.value === "All") {
      setAllUsers(customerItData);
    } else if (e.target.value === "activeOffline") {
      customer = customerItData.filter((item) => item.status == "active");
      setAllUsers(customer);
    } else if (e.target.value === "inactiveOffline") {
      customer = customerItData.filter((item) => item.status === "inactive");
      setAllUsers(customer);
    }
  };

  // customer delete controller
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);
    setCustomerDeleteId(customerId);
  };

  // customer bandwidth handler
  const bandwidthModalController = (customerID) => {
    setBandWidthCustomerId(customerID);
    setBandWidthModal(true);
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
        width: "5%",
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
        width: "12%",
        Header: t("PPPoEName"),
        accessor: "pppoe.name",
      },
      {
        width: "10%",
        Header: t("ip"),
        accessor: "ip",
      },
      {
        width: "10%",
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
        width: "12%",
        Header: "Last Link Up",
        accessor: "lastLinkUpTime",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.lastLinkUpTime &&
              moment(original.lastLinkUpTime).format("MMM DD YYYY hh:mm A")}
          </div>
        ),
      },
      {
        width: "12%",
        Header: "Last Logout",
        accessor: "lastLogoutTime",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.lastLogoutTime &&
              moment(original.lastLogoutTime).format("MMM DD YYYY hh:mm A")}
          </div>
        ),
      },
      {
        width: "5%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => {
          return (
            <div className="text-center">
              <div className="dropdown">
                <ThreeDots
                  className="dropdown-toggle ActionDots"
                  id="areaDropdown"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />

                <ul className="dropdown-menu" aria-labelledby="areaDropdown">
                  {bpSettings?.inActiveCustomerDelete &&
                    original?.running !== true && (
                      <li
                        data-bs-toggle="modal"
                        data-bs-target="#customerDelete"
                        onClick={() => {
                          customerDelete(original.id);
                        }}
                      >
                        <div className="dropdown-item">
                          <div className="customerAction">
                            <ArchiveFill />
                            <p className="actionP">{t("delete")}</p>
                          </div>
                        </div>
                      </li>
                    )}

                  {(role === "ispOwner" || role === "manager") &&
                    bpSettings?.hasMikrotik &&
                    original?.running === true && (
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
          );
        },
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

                    {customerIt && customerIt === "offline" ? (
                      <div className="mikrotik-filter ms-4">
                        <h6 className="mb-0"> {t("selectStatus")} </h6>
                        <select
                          id="selectMikrotikOption"
                          className="form-select mt-0"
                          onChange={customerItFilter}
                        >
                          <option value="All">{t("status")}</option>
                          <option value="activeOffline">
                            {t("activeOffline")}
                          </option>
                          <option value="inactiveOffline">
                            {t("inactiveOffline")}
                          </option>
                        </select>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>

                  {/* Active PPPoE users */}
                  <div className="table-section">
                    <Table
                      isLoading={mtkLoading}
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
      <CustomerDelete
        single={customerDeleteId}
        mikrotikCheck={checkMikrotik}
        setMikrotikCheck={setMikrotikCheck}
        status="customerDelete"
      />

      <BandwidthModal
        setModalShow={setBandWidthModal}
        modalShow={bandWidthModal}
        customerId={bandWidthCustomerId}
      />
    </>
  );
}
