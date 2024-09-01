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
import useISPowner from "../../hooks/useISPOwner";
import { btrcHeader, newBTRCReport } from "../common/btrcReport";
import { badge } from "../../components/common/Utils";

export default function ConfigMikrotik() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  //calling custom hook here
  const { role, ispOwnerData, ispOwnerId, bpSettings, userData } =
    useISPowner();

  // get all mikrotik from redux
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get all static customer
  let allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);

  //get all areas
  const areas = useSelector((state) => state.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // loading state
  const [loading, setIsloading] = useState(false);
  const [open, setOpen] = useState(false);

  // bulk customer state
  const [bulkCustomers, setBulkCustomer] = useState([]);

  // customer loading state
  const [mtkLoading, setMtkLoading] = useState(false);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // set initialy mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotik[0]?.id);

  // customer state
  let [allUsers, setAllUsers] = useState(allMikrotikUsers);

  // customer id state
  const [customerDeleteId, setCustomerDeleteId] = useState("");

  // customer id state
  const [bandWidthCustomerData, setBandWidthCustomerData] = useState();

  //bandwidth modal state
  const [bandWidthModal, setBandWidthModal] = useState(false);

  // check uncheck mikrotik state when delete customer
  const [checkMikrotik, setMikrotikCheck] = useState(false);

  // area & subarea name
  const [areaName, setAreaName] = useState("");
  const [subareaName, setSubareaName] = useState("");

  // modal show state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  //active customer filter options state
  const [filterOptions, setFilterOptions] = useState({
    mikrotik: "",
    area: "",
    subArea: "",
    customer: "",
    status: "",
  });

  // select area id state
  const [areaId, setAreaId] = useState();

  //set customer type bulk oparation
  const [customerType, setCustomerType] = useState();

  // find single mikrotik details
  const singleMik = mikrotik.find((item) => item.id === mikrotikId);

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

  // select mikrotik handler
  const mikrotiSelectionHandler = (mikrotikId) => {
    setFilterOptions({
      ...filterOptions,
      mikrotik: mikrotikId,
    });
    setMikrotikId(mikrotikId);
  };

  // customer delete controller
  const customerDelete = (customerId) => {
    setMikrotikCheck(false);
    setCustomerDeleteId(customerId);
  };

  // customer bandwidth handler
  const bandwidthModalController = (customer) => {
    setBandWidthCustomerData(customer);
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

  const sortingCustomer = useMemo(() => {
    return [...allUsers].sort((a, b) => {
      a = parseInt(a.customerId?.replace(/[^0-9]/g, ""));
      b = parseInt(b.customerId?.replace(/[^0-9]/g, ""));

      return a - b;
    });
  }, [allUsers]);

  const tableData = useMemo(() => sortingCustomer, [allUsers]);

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
        Header: t("id"),
        accessor: "customerId",
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
        Cell: ({ row: { original } }) => (
          <div>
            <p className={`text-${original?.macBinding && "success"} fw-700`}>
              {original?.ip}
            </p>
          </div>
        ),
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
              moment(original.lastLinkUpTime).format("MMM DD YYYY hh:mm A")}
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
              moment(original.lastLogoutTime).format("MMM DD YYYY hh:mm A")}
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("status"),
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
                      <li onClick={() => bandwidthModalController(original)}>
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
    customer: filterOptions.customer,
  };

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
      options: mikrotik,
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
                              data={newBTRCReport(tableData, ispOwnerData)}
                              filename={userData.company}
                              headers={btrcHeader}
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
              customerType === "ofline" &&
              (role === "ispOwner" || role === "manager") && (
                <button
                  className="bulk_action_button"
                  title={t("bulkDeleteCustomer")}
                  type="button"
                  class="btn btn-danger btn-floating btn-sm"
                  onClick={() => {
                    setModalStatus("customerDelete");
                    setShow(true);
                  }}
                >
                  <ArchiveFill />
                  <span className="button_title"> {t("customerDelete")} </span>
                </button>
              )}

            {bpSettings?.unpaidCustomerBulkSms &&
              customerType === "ofline" &&
              (role === "ispOwner" || role === "manager") && (
                <button
                  className="bulk_action_button"
                  title={t("bulkMessage")}
                  onClick={() => {
                    setModalStatus("bulkMessage");
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

      {/* inactive & offline customer bulk delete modal */}
      {modalStatus === "customerDelete" && (
        <BulkCustomerDelete
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      {/* offline customer bulk message modal */}
      {modalStatus === "bulkMessage" && (
        <BulkCustomerMessage
          bulkCustomer={bulkCustomers}
          show={show}
          setShow={setShow}
        />
      )}

      <CustomerDelete
        single={customerDeleteId}
        mikrotikCheck={checkMikrotik}
        setMikrotikCheck={setMikrotikCheck}
        status="customerDelete"
      />

      <BandwidthModal
        setModalShow={setBandWidthModal}
        modalShow={bandWidthModal}
        customer={bandWidthCustomerData}
      />
    </>
  );
}
