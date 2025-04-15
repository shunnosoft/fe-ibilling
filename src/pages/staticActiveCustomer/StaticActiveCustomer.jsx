import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMikrotik,
  getArea,
  getStaticActiveCustomer,
  staticMACBinding,
} from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
// get specific customer

import {
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  FileExcelFill,
  FilterCircle,
  PrinterFill,
  Router,
  Server,
  ThreeDots,
  Wifi,
  WifiOff,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import Footer from "../../components/admin/footer/Footer";
import { CSVLink } from "react-csv";
import moment from "moment";
import { Accordion, Card, Collapse } from "react-bootstrap";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import ReactToPrint from "react-to-print";
import ActiveCustomerPDF from "../Customer/ActiveCustomerPrint";
import ActiveCustomerPrint from "../Customer/ActiveCustomerPrint";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import { badge } from "../../components/common/Utils";
import useISPowner from "../../hooks/useISPOwner";
import useSelectorState from "../../hooks/useSelectorState";
import BandwidthModal from "../Customer/BandwidthModal";

const StaticActiveCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  //---> Get user & current user data form useISPOwner hooks
  const { role, ispOwnerData, ispOwnerId, bpSettings } = useISPowner();

  //---> Get redux store state data from useSelectorState hooks
  const { areas, subAreas, mikrotiks, bulletinPermission } = useSelectorState();

  const [isLoading, setIsLoading] = useState(false);
  const [mtkLoading, setMtkLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState();
  const [open, setOpen] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // set initial mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // get all static customer
  let staticActiveCustomer = useSelector(
    (state) => state?.customer?.staticActiveCustomer
  );

  // static customer state
  const [staticCustomers, setStaticCustomers] = useState([]);

  // inactive customer state
  const [inactiveCustomers, setInactiveCustomers] = useState([]);

  // area & subarea name
  const [areaName, setAreaName] = useState("");
  const [subareaName, setSubareaName] = useState("");

  // subArea ids state
  const [areaId, setAreaId] = useState();

  //active customer filter options state
  const [filterOptions, setFilterOptions] = useState({
    mikrotik: "",
    area: "",
    subArea: "",
    customer: "",
    status: "",
  });

  // customer id state
  const [bandWidthCustomerData, setBandWidthCustomerData] = useState();
  const [show, setShow] = useState(false);

  //================// API CALL's //================//
  useEffect(() => {
    //===========================================================> FIRST API

    //---> @Get ispOwner areas sub-area data
    !subAreas.length && getSubAreasApi(dispatch, ispOwnerId);

    //===========================================================> LAST API

    //---> @Get ispOwner areas data
    !areas?.length && getArea(dispatch, ispOwnerId, setIsLoading);

    //---> @Get ispOwner mikrotiks data
    !mikrotiks?.length && fetchMikrotik(dispatch, ispOwnerId, setIsLoading);

    //---> @Get bulletin permissions data
    Object.keys(bulletinPermission)?.length === 0 &&
      getBulletinPermission(dispatch);
  }, []);

  useEffect(() => {
    setMikrotikId(mikrotik[0]?.id);
  }, [mikrotik]);

  useEffect(() => {
    mikrotikId &&
      getStaticActiveCustomer(dispatch, ispOwnerId, mikrotikId, setIsLoading);
  }, [mikrotikId]);

  useEffect(() => {
    setStaticCustomers(staticActiveCustomer);
  }, [staticActiveCustomer]);

  // select mikrotik handler
  const mikrotiSelectionHandler = (event) => {
    setMikrotikId(event.target.value);
  };

  // reload handler
  const reloadHandler = () => {
    getStaticActiveCustomer(dispatch, ispOwnerId, mikrotikId, setIsLoading);
  };

  // csv table header
  const activeCustomerForCsvInfoHeader = [
    { label: "name_of_client", key: "name" },
    { label: "address", key: "address" },
    { label: "macAddress", key: "macAddress" },
    { label: "client_phone", key: "mobile" },
    { label: "payment_status", key: "paymentStatus" },
    { label: "billing_cycle", key: "billingCycle" },
  ];

  //export customer data
  let activeCustomerCsvInfo = useMemo(
    () =>
      staticCustomers.map((customer) => {
        return {
          name: customer.name,
          address: customer.address,
          macAddress: customer.macAddress,
          mobile: customer?.mobile.slice(1) || "",
          paymentStatus: customer.paymentStatus,
          billingCycle: moment(customer.billingCycle).format("MMM-DD-YYYY"),
        };
      }),
    [staticCustomers]
  );

  // mikrotik find in select mikrotik id
  const mikrotikName = mikrotik.find((val) => val.id === mikrotikId);

  const filterData = {
    mikrotik: mikrotikName?.name,
    customer: filterStatus,
  };

  // customer bandwidth handler
  const bandwidthModalController = (customer) => {
    setBandWidthCustomerData(customer);
    setShow(true);
  };

  const columns = useMemo(
    () => [
      {
        width: "5%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "5%",
        Header: <Wifi />,
        accessor: "complete",
        Cell: ({ value }) => (
          <div>
            {value === true ? <Wifi color="green" /> : <WifiOff color="red" />}
          </div>
        ),
      },
      {
        width: "15%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "10%",
        Header: t("ipAddress"),
        accessor: (data) => data?.ipAddress,
        Cell: ({ row: { original } }) => (
          <div style={{ cursor: "pointer" }}>
            <p
              onClick={() =>
                window.open(`http://${original?.ipAddress}`, "_blank")
              }
              style={{
                cursor: "pointer",
                textDecoration: "none",
                color: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
                e.currentTarget.classList.add("text-primary");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
                e.currentTarget.classList.remove("text-primary");
              }}
            >
              {original?.ipAddress}
            </p>
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("macAddress"),
        accessor: "macAddress",
      },
      {
        width: "8%",
        Header: "Upload",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {original?.bytes?.split("/")?.[0]
              ? original?.bytes?.split("/")?.[0] / 1024 / 1024 <= 1024
                ? (original?.bytes?.split("/")?.[0] / 1024 / 1024).toFixed(2) +
                  " MB"
                : (
                    original?.bytes?.split("/")?.[0] /
                    1024 /
                    1024 /
                    1024
                  ).toFixed(2) + " GB"
              : ""}
          </div>
        ),
      },
      {
        width: "8%",
        Header: "Download",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.bytes?.split("/")?.[1]
              ? original?.bytes?.split("/")?.[1] / 1024 / 1024 <= 1024
                ? (original?.bytes?.split("/")?.[1] / 1024 / 1024).toFixed(2) +
                  " MB"
                : (
                    original?.bytes?.split("/")?.[1] /
                    1024 /
                    1024 /
                    1024
                  ).toFixed(2) + " GB"
              : ""}
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("status"),
        accessor: (data) => data.status,
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
                  {bpSettings?.hasMikrotik && original?.complete === true && (
                    <li onClick={() => bandwidthModalController(original)}>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <Server />
                          <p className="actionP">{t("bandwidth")}</p>
                        </div>
                      </div>
                    </li>
                  )}
                  {/* {(role === "ispOwner" || role === "manager") &&
                    bpSettings?.hasMikrotik && (
                      <li onClick={() => macBindingCall(original)}>
                        <div className="dropdown-item">
                          <div className="customerAction">
                            <Router />
                            <p className="actionP">{t("macBinding")}</p>
                          </div>
                        </div>
                      </li>
                    )} */}
                </ul>
              </div>
            </div>
          );
        },
      },
    ],
    [t]
  );

  // manual filter options
  const filterInput = [
    {
      type: "select",
      name: "mikrotik",
      id: "mikrotik",
      value: filterOptions.mikrotik,
      isVisible: true,
      disabled: false,
      onChange: (e) => mikrotiSelectionHandler(e.target.value),
      options: mikrotiks,
      textAccessor: "name",
      valueAccessor: "id",
    },
    {
      type: "select",
      name: "area",
      id: "area",
      value: filterOptions.area,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setAreaId(e.target.value);
        setAreaName(e.target.name);
        setFilterOptions({
          ...filterOptions,
          area: e.target.value,
        });
      },
      options: areas,
      firstOptions: t("allArea"),
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
        setSubareaName(e.target.name);
        setFilterOptions({
          ...filterOptions,
          subArea: e.target.value,
        });
      },
      options: subAreas.filter((sub) => sub.area === areaId),
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
        { text: t("offline"), value: "offline" },
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
      disabled: filterOptions.customer !== "offline",
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
    let tempCustomers = staticActiveCustomer.reduce((acc, c) => {
      // inport filter option state name
      const { area, subArea, customer, status } = filterOptions;

      // find area all subareas
      let allSubarea = [];
      if (area) {
        allSubarea = subAreas.filter((val) => val.area === area);
      }

      // make possible conditions objects if the filter value not selected thats return true
      //if filter value exist then compare

      const condition = {
        area: area ? allSubarea.some((sub) => sub.id === c.subArea) : true,
        subArea: subArea ? subArea === c.subArea : true,
        online: customer === "online" ? c.complete === true : true,
        offline: customer === "offline" ? c.complete !== true : true,
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
    setStaticCustomers(tempCustomers);
  };

  // filter reset controller
  const handleFilterReset = () => {
    setFilterOptions({
      area: "",
      subArea: "",
      customer: "",
      status: "",
    });
    setStaticCustomers(staticActiveCustomer);
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
                  <div>{t("activeStaticCustomer")}</div>

                  <div
                    style={{ height: "45px" }}
                    className="d-flex align-items-center"
                  >
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
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            <CSVLink
                              data={activeCustomerCsvInfo}
                              filename={ispOwnerData.company}
                              headers={activeCustomerForCsvInfoHeader}
                              title="Active Customer BTRC Report"
                            >
                              <FileExcelFill className="addcutmButton" />
                            </CSVLink>

                            <div className="addAndSettingIcon">
                              <ReactToPrint
                                documentTitle={t("CustomerList")}
                                trigger={() => (
                                  <PrinterFill
                                    title={t("print")}
                                    className="addcutmButton"
                                  />
                                )}
                                content={() => componentRef.current}
                              />
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Collapse>
                    {!open && (
                      <ArrowBarLeft
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}
                    {open && (
                      <ArrowBarRight
                        className="ms-1"
                        size={34}
                        style={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                      />
                    )}
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
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="collectorWrapper pb-2">
                    <div style={{ display: "none" }}>
                      <ActiveCustomerPrint
                        filterData={filterData}
                        currentCustomers={staticCustomers}
                        ref={componentRef}
                        status="static"
                      />
                    </div>
                    <div className="table-section">
                      <Table
                        isLoading={isLoading}
                        columns={columns}
                        data={staticCustomers}
                      />
                    </div>
                  </div>
                </div>

                {(bulletinPermission?.activeCustomer ||
                  bulletinPermission?.allPage) && <NetFeeBulletin />}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      <BandwidthModal
        modalShow={show}
        setModalShow={setShow}
        customer={{ ...bandWidthCustomerData, page: "Static" }}
      />
    </>
  );
};

export default StaticActiveCustomer;
