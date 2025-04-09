import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchpppoeUserForReseller,
  pppoeMACBinding,
  pppoeRemoveMACBinding,
} from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
// get specific customer

import {
  ArrowClockwise,
  FilterCircle,
  Router,
  Server,
  ThreeDots,
  Wifi,
  WifiOff,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import { getMikrotik, getSubAreas } from "../../features/apiCallReseller";
import Footer from "../../components/admin/footer/Footer";
import moment from "moment";
import { Accordion } from "react-bootstrap";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import { badge } from "../../components/common/Utils";
import BandwidthModal from "../../pages/Customer/BandwidthModal";
import useISPowner from "../../hooks/useISPOwner";

const ResellerActiveCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //---> Get user & current user data form useISPOwner hooks
  const { role, bpSettings, userData, currentUser } = useISPowner();

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get all static customer
  let allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);

  //---> Get reseller subAreas from redux store
  const subAreas = useSelector((state) => state?.area?.area);

  //---> Get bulletin route permission from redux store
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // mikrotik loading state
  const [loading, setIsloading] = useState(false);

  // set initialy mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // customer state
  let [allUsers, setAllUsers] = useState(allMikrotikUsers);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  //bandwidth modal state
  const [bandWidthModal, setBandWidthModal] = useState(false);

  // customer id state
  const [bandWidthCustomerData, setBandWidthCustomerData] = useState();

  //set customer type bulk oparation
  const [customerType, setCustomerType] = useState();

  //active customer filter options state
  const [filterOptions, setFilterOptions] = useState({
    mikrotik: "",
    area: "",
    subArea: "",
    customer: "",
    status: "",
  });

  // select mikrotik handler
  const mikrotiSelectionHandler = (mikrotikId) => {
    setFilterOptions({
      ...filterOptions,
      mikrotik: mikrotikId,
    });
    setMikrotikId(mikrotikId);
  };

  // customer bandwidth handler
  const bandwidthModalController = (customer) => {
    setBandWidthCustomerData(customer);
    setBandWidthModal(true);
  };

  // initialize id
  const ids = {
    resellerId: role === "reseller" ? userData.id : userData.reseller,
    mikrotikId,
  };

  //mac-binding handler
  const macBindingCall = (customerId) => {
    pppoeMACBinding(customerId);
  };
  const macBindingRemove = (customerId) => {
    pppoeRemoveMACBinding(customerId);
  };

  //================// API CALL's //================//
  useEffect(() => {
    //---> @Get reseller ispOwner areas sub-area data
    !subAreas.length && getSubAreas(dispatch, ids?.resellerId);

    if (role === "collector") {
      getMikrotik(dispatch, currentUser?.collector.reseller);
    }
    if (role === "reseller") {
      getMikrotik(dispatch, currentUser?.reseller.id);
    }

    //---> @Get netFee bulletin permissions data
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, []);

  // api call for get update static customer
  useEffect(() => {
    if (mikrotikId) {
      fetchpppoeUserForReseller(
        dispatch,
        ids,
        mikrotik[0]?.name,
        setIsloading,
        "user"
      );
    }
  }, [mikrotikId]);

  // set mikrotik and customer into state
  useEffect(() => {
    setAllUsers(allMikrotikUsers);
    !mikrotikId && setMikrotikId(mikrotik[0]?.id);
  }, [allMikrotikUsers, mikrotik]);

  // reload handler
  const reloadHandler = () => {
    fetchpppoeUserForReseller(dispatch, ids, mikrotik[0].name, setIsloading);
  };

  // table column
  const columns = useMemo(
    () => [
      {
        width: "4%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "5%",
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
        width: "10%",
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
        width: "10%",
        Header: "Last Link Up",
        accessor: "lastLinkUpTime",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.lastLinkUpTime &&
              moment(original.lastLinkUpTime).format("YYYY/MM/DD hh:mm A")}
          </div>
        ),
      },
      {
        width: "10%",
        Header: "Last Logout",
        accessor: "lastLogoutTime",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.lastLogoutTime &&
              moment(original.lastLogoutTime).format("YYYY/MM/DD hh:mm A")}
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("status"),
        accessor: (data) => `${data.status}`,
        Cell: ({ row: { original } }) => <div>{badge(original?.status)}</div>,
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
                  {role !== "collector" &&
                    bpSettings?.hasMikrotik &&
                    original?.running && (
                      <li>
                        {!original?.macBinding ? (
                          <div
                            className="dropdown-item"
                            onClick={() => macBindingCall(original.id)}
                          >
                            <div className="customerAction">
                              <Router />
                              <p className="actionP">{t("macBinding")}</p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="dropdown-item"
                            onClick={() => macBindingRemove(original.id)}
                          >
                            <div className="customerAction">
                              <Router />
                              <p className="actionP">{t("removeMACBinding")}</p>
                            </div>
                          </div>
                        )}
                      </li>
                    )}

                  {bpSettings?.hasMikrotik && original?.running === true && (
                    <li onClick={() => bandwidthModalController(original)}>
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

  //---> Active customer filter input options
  const filterInput = [
    {
      type: "select",
      name: "mikrotik",
      id: "mikrotik",
      value: filterOptions.mikrotik,
      isVisible: true,
      disabled: false,
      onChange: (e) => mikrotiSelectionHandler(e.target.value),
      options: mikrotik,
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      type: "select",
      name: "subArea",
      id: "subArea",
      value: filterOptions.subArea,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          subArea: e.target.value,
        });
      },
      options: subAreas,
      firstOptions: t("subArea"),
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      type: "select",
      name: "customer",
      id: "customer",
      value: filterOptions.customer,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          customer: e.target.value,
        });
      },
      options: [
        { text: t("online"), value: "online" },
        { text: t("ofline"), value: "ofline" },
      ],
      firstOptions: t("sokolCustomer"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      type: "select",
      name: "status",
      id: "status",
      value: filterOptions.status,
      isVisible: true,
      disabled: filterOptions.customer !== "ofline",
      onChange: (e) => {
        setFilterOptions({
          ...filterOptions,
          status: e.target.value,
        });
      },
      options: [
        { text: t("activeOffline"), value: "active" },
        { text: t("inactiveOffline"), value: "inactive" },
        { text: t("expiredOffline"), value: "expired" },
      ],
      firstOptions: t("status"),
      textAccessor: "text",
      valueAccessor: "value",
    },
  ];

  // area subarea handler
  const handleActiveFilter = () => {
    let tempCustomers = allMikrotikUsers.reduce((acc, c) => {
      // inport filter option state name
      const { area, subArea, customer, status } = filterOptions;

      // find area all subareas
      let allSubarea = [];
      if (area) {
        allSubarea = subAreas.filter((val) => val.area === area);
      }

      // set customer type
      setCustomerType(customer);

      // make possible conditions objects if the filter value not selected thats return true
      //if filter value exist then compare

      const condition = {
        area: area ? allSubarea.some((sub) => sub.id === c.subArea) : true,
        subArea: subArea ? subArea === c.subArea : true,
        online: customer === "online" ? c.running === true : true,
        ofline: customer === "ofline" ? c.running !== true : true,
        status: status ? status === c.status : true,
      };

      //check if condition pass got for next step or is fail stop operation
      //if specific filter option value not exist it will return true

      let isPass = false;

      isPass = condition["area"];
      if (!isPass) return acc;

      isPass = condition["subArea"];
      if (!isPass) return acc;

      if (customer) {
        isPass = condition[customer];
        if (!isPass) return acc;
      }

      isPass = condition["status"];
      if (!isPass) return acc;

      if (isPass) acc.push(c);
      return acc;
    }, []);

    // set filter customer in customer state
    setAllUsers(tempCustomers);
  };

  // filter reset controller
  const handleFilterReset = () => {
    setFilterOptions({
      area: "",
      subArea: "",
      customer: "",
      status: "",
    });
    setAllUsers(allMikrotikUsers);
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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="d-flex">
                    <div>{t("activeCustomer")}</div>
                  </div>

                  <div className="d-flex justify-content-center align-items-center">
                    <div
                      onClick={() => {
                        if (!activeKeys) {
                          setActiveKeys("filter");
                        } else {
                          setActiveKeys("");
                        }
                      }}
                      title={t("filter")}
                    >
                      <FilterCircle className="addcutmButton" />
                    </div>

                    <div className="reloadBtn">
                      {loading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          title={t("refresh")}
                          className="arrowClock"
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="displayGrid6">
                          {filterInput?.map(
                            (item) =>
                              item.isVisible && (
                                <select
                                  className="form-select shadow-none mt-0"
                                  onChange={item.onChange}
                                  value={item.value}
                                  disabled={item.disabled}
                                >
                                  {item?.firstOptions && (
                                    <option value="">
                                      {item?.firstOptions}
                                    </option>
                                  )}

                                  {item.options?.map((option) => (
                                    <option value={option[item.valueAccessor]}>
                                      {option[item.textAccessor]}
                                    </option>
                                  ))}
                                </select>
                              )
                          )}

                          <div className="displayGrid1 mt-0">
                            <button
                              className="btn btn-outline-primary"
                              type="button"
                              onClick={handleActiveFilter}
                            >
                              {t("filter")}
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={handleFilterReset}
                            >
                              {t("reset")}
                            </button>
                          </div>
                        </div>

                        {/* <div className="d-flex justify-content-center">
                          <div className="mikrotik-filter">
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
                            <select
                              id="selectMikrotikOption"
                              onChange={subAreaFilterHandler}
                              className="form-select mt-0"
                            >
                              <option value="">{t("allSubArea")}</option>
                              {subAreas.map((item) => (
                                <option value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </div>

                          <div className="mikrotik-filter ms-4">
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

                          {offline && (
                            <div className="mikrotik-filter ms-4">
                              <select
                                id="selectOfflineOption"
                                onChange={filterIt}
                                className="form-select mt-0"
                              >
                                <option value="offline">{t("status")}</option>
                                <option value="offlineActive">
                                  {t("activeOffline")}
                                </option>
                                <option value="offlineInactive">
                                  {t("inactiveOffline")}
                                </option>
                              </select>
                            </div>
                          )}
                        </div> */}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="collectorWrapper pb-2">
                    <div className="table-section">
                      <Table
                        isLoading={loading}
                        columns={columns}
                        data={allUsers}
                      ></Table>
                    </div>
                  </div>
                </div>

                {(butPermission?.activeCustomer || butPermission?.allPage) && (
                  <NetFeeBulletin />
                )}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* Customer live bandwidth modal */}
      <BandwidthModal
        setModalShow={setBandWidthModal}
        modalShow={bandWidthModal}
        customer={bandWidthCustomerData}
      />
    </>
  );
};

export default ResellerActiveCustomer;
