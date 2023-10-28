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

const StaticActiveCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const [isLoading, setIsloading] = useState(false);
  const [mtkLoading, setMtkLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState();
  const [open, setOpen] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // set initial mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // get all static customer
  let staticActiveCustomer = useSelector(
    (state) => state?.customer?.staticActiveCustomer
  );

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get ispOwner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth?.userData
  );

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  //get all areas
  const areas = useSelector((state) => state.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  // static customer state
  const [staticCustomers, setStaticCustomers] = useState([]);

  // inactive customer state
  const [inactiveCustomers, setInactiveCustomers] = useState([]);

  // area & subarea name
  const [areaName, setAreaName] = useState("");
  const [subareaName, setSubareaName] = useState("");

  // subArea ids state
  const [subareaIds, setSubareaIds] = useState([]);

  // api call for get update static customer
  useEffect(() => {
    // get area api
    if (areas.length === 0) getArea(dispatch, ispOwnerId, setIsloading);

    // get sub area api
    if (subAreas.length === 0) getSubAreasApi(dispatch, ispOwnerId);

    mikrotik.length === 0 && fetchMikrotik(dispatch, ispOwnerId, setMtkLoading);
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, []);

  useEffect(() => {
    setMikrotikId(mikrotik[0]?.id);
  }, [mikrotik]);

  useEffect(() => {
    mikrotikId &&
      getStaticActiveCustomer(dispatch, ispOwnerId, mikrotikId, setIsloading);
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
    getStaticActiveCustomer(dispatch, ispOwnerId, mikrotikId, setIsloading);
  };

  // customer filter state
  const customerStatusFilter = (e) => {
    let temp;

    if (e.target.value === "online") {
      temp = staticActiveCustomer.filter((item) => item.complete == true);
      setInactiveCustomers([]);
    } else if (e.target.value === "offline") {
      temp = staticActiveCustomer.filter((item) => item.complete != true);
      setInactiveCustomers(temp);
    } else {
      temp = staticActiveCustomer;
    }

    setStaticCustomers(temp);
  };

  // area subarea handler
  const areaSubareaHandler = (e) => {
    setAreaName(e.target.name);
    let tempCustomers = staticActiveCustomer.reduce((acc, c) => {
      // find area all subareas
      let allSub = [];
      if (e.target.value !== "") {
        allSub = subAreas.filter((val) => val.area === e.target.value);
      }
      setSubareaIds(allSub);

      const condition = {
        area:
          e.target.value !== ""
            ? allSub.some((sub) => sub.id === c.subArea)
            : true,
      };

      let isPass = false;
      isPass = condition["area"];
      if (!isPass) return acc;

      if (isPass) acc.push(c);
      return acc;
    }, []);

    setStaticCustomers(tempCustomers);
  };

  // subarea handle
  const subAreasHandler = (e) => {
    setSubareaName(e.target.name);
    let subAreaCustomers = staticActiveCustomer.reduce((acc, c) => {
      const condition = {
        subArea: e.target.value !== "" ? c.subArea === e.target.value : true,
      };

      let isPass = false;
      isPass = condition["subArea"];
      if (!isPass) return acc;

      if (isPass) acc.push(c);
      return acc;
    }, []);

    setStaticCustomers(subAreaCustomers);
  };

  // inactive customer filter handler
  const inactiveCustomerHandler = (e) => {
    let customer;

    if (e.target.value === "activeOffline") {
      customer = inactiveCustomers.filter((item) => item.status == "active");
    } else if (e.target.value === "inactiveOffline") {
      customer = inactiveCustomers.filter((item) => item.status === "inactive");
    } else if (e.target.value === "expiredOffline") {
      customer = inactiveCustomers.filter((item) => item.status === "expired");
    }

    setStaticCustomers(customer);
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

  const columns = useMemo(
    () => [
      {
        width: "10%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "20%",
        Header: t("status"),
        accessor: "running",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.complete === true ? (
              <Wifi color="green" />
            ) : (
              <WifiOff color="red" />
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
        width: "20%",
        Header: t("address"),
        accessor: "address",
      },
      {
        width: "30%",
        Header: t("macAddress"),
        accessor: "macAddress",
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
                          <select
                            id="selectMikrotikOption"
                            onChange={mikrotiSelectionHandler}
                            className="form-select mt-0"
                          >
                            {mikrotik.map((item) => (
                              <option value={item.id}>{item.name}</option>
                            ))}
                          </select>

                          <select
                            id="selectMikrotikOption"
                            className="form-select mt-0"
                            onChange={areaSubareaHandler}
                          >
                            <option value="">{t("allArea")}</option>
                            {areas.map((item) => (
                              <option name={item.name} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>

                          <select
                            id="selectMikrotikOption"
                            className="form-select mt-0"
                            onChange={subAreasHandler}
                          >
                            <option value="">{t("subArea")}</option>
                            {subareaIds.map((item) => (
                              <option name={item.name} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>

                          <select
                            className="form-select mt-0"
                            aria-label="Default select example"
                            onChange={customerStatusFilter}
                          >
                            <option selected value="">
                              {t("sokolCustomer")}
                            </option>
                            <option value="online"> {t("online")} </option>
                            <option value="offline">{t("ofline")}</option>
                          </select>

                          {inactiveCustomers.length > 0 && (
                            <select
                              id="selectMikrotikOption"
                              className="form-select mt-0"
                              onChange={inactiveCustomerHandler}
                            >
                              <option value="">{t("status")}</option>
                              <option value="activeOffline">
                                {t("activeOffline")}
                              </option>
                              <option value="inactiveOffline">
                                {t("inactiveOffline")}
                              </option>
                              <option value="expiredOffline">
                                {t("expiredOffline")}
                              </option>
                            </select>
                          )}
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

                {(butPermission?.activeCustomer || butPermission?.allPage) && (
                  <NetFeeBulletin />
                )}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticActiveCustomer;
