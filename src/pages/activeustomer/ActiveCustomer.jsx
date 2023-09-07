import React, { useEffect, useMemo, useRef, useState } from "react";
import "../collector/collector.css";
import "../configMikrotik/configmikrotik.css";
import {
  ArrowClockwise,
  WifiOff,
  Wifi,
  ThreeDots,
  ArchiveFill,
  Server,
  Envelope,
  FileExcelFill,
  FilterCircle,
  Router,
  PrinterFill,
  ArrowBarLeft,
  ArrowBarRight,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";

import Loader from "../../components/common/Loader";
import {
  fetchMikrotik,
  fetchpppoeUser,
  getArea,
  pppoeMACBinding,
  pppoeRemoveMACBinding,
} from "../../features/apiCalls";

import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import BandwidthModal from "../Customer/BandwidthModal";
import moment from "moment";
import CustomerDelete from "../Customer/customerCRUD/CustomerDelete";
import IndeterminateCheckbox from "../../components/table/bulkCheckbox";
import BulkCustomerDelete from "../Customer/customerCRUD/bulkOpration/BulkdeleteModal";
import BulkCustomerMessage from "../Customer/customerCRUD/bulkOpration/BulkCustomerMessage";
import { CSVLink } from "react-csv";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import { Accordion, Card, Collapse } from "react-bootstrap";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import ActiveCustomerPDF from "../Customer/ActiveCustomerPrint";
import ReactToPrint from "react-to-print";

export default function ConfigMikrotik() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get all static customer
  let allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //get all areas
  const areas = useSelector((state) => state.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  // bulk customer state
  const [bulkCustomers, setBulkCustomer] = useState([]);

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // loading state
  const [loading, setIsloading] = useState(false);
  const [open, setOpen] = useState(false);

  // customer loading state
  const [mtkLoading, setMtkLoading] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // set initialy mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // customer state
  let [allUsers, setAllUsers] = useState(allMikrotikUsers);

  //set status for inactive offline customer
  let [status, setStatus] = useState(false);

  //set status  offline customer
  let [offlineStatus, setOfflineStatus] = useState(false);

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

  // area & subarea name
  const [areaName, setAreaName] = useState("");
  const [subareaName, setSubareaName] = useState("");

  // customer type
  const [customerType, setCustomerType] = useState("");

  // subArea ids state
  const [subareaIds, setSubareaIds] = useState([]);

  // modal show state
  const [show, setShow] = useState(false);

  // find single mikrotik details
  const singleMik = mikrotik.find((item) => item.id === mikrotikId);

  // select mikrotik handler
  const mikrotiSelectionHandler = (event) => {
    setMikrotikId(event.target.value);
  };

  // customer filter state
  const filterIt = (e) => {
    let temp;
    setOfflineStatus(false);
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
      setOfflineStatus(true);
    }

    setCustomerItData(temp);
    setStatus(false);
  };

  // customer online offline filter handler
  const customerItFilter = (e) => {
    setCustomerType(e.target.value);
    let customer;
    setStatus(false);
    if (e.target.value === "All") {
      setAllUsers(customerItData);
    } else if (e.target.value === "activeOffline") {
      customer = customerItData.filter((item) => item.status == "active");
      setAllUsers(customer);
    } else if (e.target.value === "inactiveOffline") {
      customer = customerItData.filter((item) => item.status === "inactive");
      setAllUsers(customer);
      setStatus(true);
    } else if (e.target.value === "expiredOffline") {
      customer = customerItData.filter((item) => item.status === "expired");
      setAllUsers(customer);
      setStatus(true);
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

  useEffect(() => {
    // get area api
    if (areas.length === 0) getArea(dispatch, ispOwnerId, setIsloading);

    // get sub area api
    if (subAreas.length === 0) getSubAreasApi(dispatch, ispOwnerId);

    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, []);

  // api call for get update static customer
  useEffect(() => {
    !mikrotik.length && fetchMikrotik(dispatch, ispOwnerId, setIsloading);
    if (mikrotikId) {
      fetchpppoeUser(dispatch, IDs, singleMik?.name, setMtkLoading, "user");
    }
  }, [mikrotikId]);

  // set mikrotik and customer into state
  useEffect(() => {
    setAllUsers(allMikrotikUsers);
    !mikrotikId && setMikrotikId(mikrotik[0]?.id);
  }, [allMikrotikUsers, mikrotik]);

  // area subarea handler
  const areaSubareaHandler = (e) => {
    setAreaName(e.target.name);
    let tempCustomers = allMikrotikUsers.reduce((acc, c) => {
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

    setAllUsers(tempCustomers);
  };

  // subarea handle
  const subAreasHandler = (e) => {
    setSubareaName(e.target.name);
    let subAreaCustomers = allMikrotikUsers.reduce((acc, c) => {
      const condition = {
        subArea: e.target.value !== "" ? c.subArea === e.target.value : true,
      };

      let isPass = false;
      isPass = condition["subArea"];
      if (!isPass) return acc;

      if (isPass) acc.push(c);
      return acc;
    }, []);

    setAllUsers(subAreaCustomers);
  };

  const sortingCustomer = useMemo(() => {
    return [...allUsers].sort((a, b) => {
      a = parseInt(a.customerId?.replace(/[^0-9]/g, ""));
      b = parseInt(b.customerId?.replace(/[^0-9]/g, ""));

      return a - b;
    });
  }, [allUsers]);

  const tableData = useMemo(() => sortingCustomer, [allUsers]);

  // csv table header
  const customerForCsVTableInfoHeader = [
    { label: "customer_id", key: "customerId" },
    { label: "name_of_client", key: "name" },
    { label: "PPPoE_Name", key: "pppoeName" },
    { label: "Allocated_ip", key: "ip" },
    { label: "address_of_client", key: "customerAddress" },
    { label: "activation_date", key: "createdAt" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "password", key: "password" },
    { label: "client_phone", key: "mobile" },
    { label: "status", key: "status" },
    { label: "payment Status", key: "paymentStatus" },
    { label: "email", key: "email" },
    { label: "balance", key: "balance" },
    { label: "billing_cycle", key: "billingCycle" },
    { label: "selling_bandwidthBDT (Excluding VAT).", key: "monthlyFee" },
  ];

  //export customer data
  let customerForCsVTableInfo = useMemo(
    () =>
      tableData.map((customer) => {
        return {
          customerId: customer.customerId,
          name: customer.name,
          pppoeName: customer.pppoe?.name,
          ip: customer.ip,
          customerAddress: customer.address,
          createdAt: moment(customer.createdAt).format("MM/DD/YYYY"),
          package: customer?.pppoe?.profile,
          password: customer?.pppoe?.password,
          mobile: customer?.mobile || "",
          status: customer.status,
          paymentStatus: customer.paymentStatus,
          email: customer.email || "",
          monthlyFee: customer.monthlyFee,
          balance: customer.balance,
          billingCycle: moment(customer.billingCycle).format("MMM-DD-YYYY"),
        };
      }),
    [allUsers]
  );

  //mac-binding handler
  const macBindingCall = (customerId) => {
    pppoeMACBinding(customerId);
  };
  const macBindingRemove = (customerId) => {
    pppoeRemoveMACBinding(customerId);
  };

  // table column
  const columns = React.useMemo(
    () => [
      {
        id: "selection",
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <IndeterminateCheckbox
            customeStyle={true}
            {...getToggleAllPageRowsSelectedProps()}
          />
        ),
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
        width: "2%",
      },
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

                  {(role === "ispOwner" || role === "manager") &&
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
                </ul>
              </div>
            </div>
          );
        },
      },
    ],
    [t]
  );

  // mikrotik find in select mikrotik id
  const mikrotikName = mikrotik.find((val) => val.id === mikrotikId);

  const filterData = {
    mikrotik: mikrotikName?.name,
    area: areaName,
    subarea: subareaName,
    customer: customerType,
  };

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div>{t("activeCustomer")}</div>

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
                      {mtkLoading ? (
                        <Loader className="loader"></Loader>
                      ) : (
                        <ArrowClockwise
                          title={t("refresh")}
                          className="arrowClock"
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>

                    <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            <CSVLink
                              data={customerForCsVTableInfo}
                              filename={ispOwnerData.company}
                              headers={customerForCsVTableInfoHeader}
                              title="Customer BTRC Report New"
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
                        <div className="active_filter displayGrid6">
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

                          {customerIt && customerIt === "offline" ? (
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
                              <option value="expiredOffline">
                                {t("expiredOffline")}
                              </option>
                            </select>
                          ) : (
                            ""
                          )}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="collectorWrapper pb-2">
                    <div className="d-none">
                      <ActiveCustomerPDF
                        filterData={filterData}
                        currentCustomers={allUsers}
                        ref={componentRef}
                        status="pppoe"
                      />
                    </div>
                    <div className="table-section">
                      <Table
                        isLoading={mtkLoading}
                        bulkLength={bulkCustomers?.length}
                        columns={columns}
                        data={allUsers}
                        bulkState={{
                          setBulkCustomer,
                        }}
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

      {bulkCustomers.length > 0 && (
        <>
          <div className="bulkActionButton">
            {bpSettings?.inActiveCustomerDelete &&
              status &&
              (role === "ispOwner" || role === "manager") && (
                <button
                  className="bulk_action_button"
                  title={t("bulkDeleteCustomer")}
                  data-bs-toggle="modal"
                  data-bs-target="#bulkDeleteCustomer"
                  type="button"
                  class="btn btn-danger btn-floating btn-sm"
                >
                  <ArchiveFill />
                  <span className="button_title"> {t("customerDelete")} </span>
                </button>
              )}

            {bpSettings?.unpaidCustomerBulkSms &&
              offlineStatus &&
              (role === "ispOwner" || role === "manager") && (
                <button
                  className="bulk_action_button"
                  title={t("bulkMessage")}
                  onClick={() => {
                    setShow(true);
                  }}
                  type="button"
                  class="btn btn-primary btn-floating btn-sm"
                >
                  <Envelope />
                  <span className="button_title"> {t("bulkMessage")} </span>
                </button>
              )}
          </div>
        </>
      )}

      {/*bulk customer delete modal  */}
      <BulkCustomerDelete
        bulkCustomer={bulkCustomers}
        modalId="bulkDeleteCustomer"
      />

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

      <BulkCustomerMessage
        bulkCustomer={bulkCustomers}
        show={show}
        setShow={setShow}
      />
    </>
  );
}
