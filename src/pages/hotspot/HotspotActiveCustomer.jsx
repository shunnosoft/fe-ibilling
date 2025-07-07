import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { Accordion, ToastContainer } from "react-bootstrap";
import { FontColor, FourGround } from "../../assets/js/theme";
import Table from "../../components/table/Table";
import Footer from "../../components/admin/footer/Footer";
import { useTranslation } from "react-i18next";
import useDash from "../../assets/css/dash.module.css";
import useISPowner from "../../hooks/useISPOwner";
import { useDispatch, useSelector } from "react-redux";
import { getHotspotActiveCustomer } from "../../features/hotspotApi";
import useSelectorState from "../../hooks/useSelectorState";
import { fetchMikrotik } from "../../features/apiCalls";
import { badge } from "../../components/common/Utils";
import {
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  FilterCircle,
  Server,
  ThreeDots,
  Wifi,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import BandwidthModal from "../Customer/BandwidthModal";

const HotspotActiveCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //---> Get user & current user data form useISPOwner hooks
  const {
    role,
    ispOwnerData,
    ispOwnerId,
    bpSettings,
    permissions,
    permission,
  } = useISPowner();

  //---> Get redux store state data from useSelectorState hooks
  const { areas, subAreas, mikrotiks, bulletinPermission } = useSelectorState();

  const customer = useSelector((state) => state.hotspot.activeHotspotCustomer);

  //==========|| Local State ||==========//
  const [isLoading, setIsLoading] = useState(false);
  // set initialy mikrotik id
  const [mikrotikId, setMikrotikId] = useState(mikrotiks[0]?.id);

  const [activeKeys, setActiveKeys] = useState("");

  // customer id state
  const [bandWidthCustomerData, setBandWidthCustomerData] = useState();

  //bandwidth modal state
  const [bandWidthModal, setBandWidthModal] = useState(false);

  //active customer filter options state
  const [filterOptions, setFilterOptions] = useState({
    mikrotik: "",
    area: "",
    subArea: "",
    customer: "",
    status: "",
  });

  useEffect(() => {
    //---> @Get ispOwner mikrotiks data
    !mikrotiks?.length && fetchMikrotik(dispatch, ispOwnerId, setIsLoading);
  }, []);

  // set mikrotik and customer into state
  useEffect(() => {
    setFilterOptions({
      ...filterOptions,
      mikrotik: mikrotiks[0]?.id,
    });
    !mikrotikId && setMikrotikId(mikrotiks[0]?.id);
  }, [mikrotiks]);

  useEffect(() => {
    getHotspotActiveCustomer(dispatch, ispOwnerId, mikrotikId, setIsLoading);
  }, [mikrotikId]);

  const reloadHandler = () => {
    getHotspotActiveCustomer(dispatch, ispOwnerId, mikrotikId, setIsLoading);
  };

  const bandwidthModalController = (customer) => {
    setBandWidthCustomerData(customer);
    setBandWidthModal(true);
  };

  const columns = useMemo(
    () => [
      {
        width: "5%",
        Header: <Wifi />,
        accessor: "running",
        Cell: () => <Wifi color="green" />,
      },
      {
        width: "5%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "10%",
        Header: `${t("name")}/${t("hotspot")}`,
        accessor: (data) => `${data?.name} ${data.hotspot?.name}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <p>{original.hotspot?.name}</p>
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("IPMac"),
        accessor: (data) => `${data?.address} ${data.macAddress}`,
        Cell: ({ row: { original } }) => (
          <div style={{ cursor: "pointer" }}>
            <p
              onClick={() =>
                window.open(`http://${original?.address}`, "_blank")
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
              {original?.address}
            </p>
            <p>{original?.macAddress}</p>
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: "hotspot.profile",
      },
      {
        width: "10%",
        Header: t("upDown"),
        accessor: (data) => `${data?.bytesIn} ${data.bytesOut}`,
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            <p>
              {original?.bytesIn
                ? original?.bytesIn / 1024 / 1024 <= 1024
                  ? (original?.bytesIn / 1024 / 1024).toFixed(2) + " MB"
                  : (original?.bytesIn / 1024 / 1024 / 1024).toFixed(2) + " GB"
                : ""}
            </p>

            <p>
              {original?.bytesOut
                ? original?.bytesOut / 1024 / 1024 <= 1024
                  ? (original?.bytesOut / 1024 / 1024).toFixed(2) + " MB"
                  : (original?.bytesOut / 1024 / 1024 / 1024).toFixed(2) + " GB"
                : ""}
            </p>
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("uptime"),
        accessor: "uptime",
      },
      {
        width: "10%",
        Header: t("login"),
        accessor: "loginBy",
      },
      {
        width: "5%",
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
                  {/* {bpSettings?.inActiveCustomerDelete &&
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
                    )} */}

                  {/* {bpSettings?.hasMikrotik &&
                    bpSettings?.hasOLT &&
                    original?.running === true && (
                      <li
                        onClick={() => {
                          setCustomer(original);
                          setModalStatus("onuDetails");
                          setShow(true);
                        }}
                      >
                        <div className="dropdown-item">
                          <div className="customerAction">
                            <HddNetworkFill />
                            <p className="actionP">{t("onuLaser")}</p>
                          </div>
                        </div>
                      </li>
                    )} */}

                  {bpSettings?.hasMikrotik && (
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

  // select mikrotik handler
  const mikrotiSelectionHandler = (mikrotikId) => {
    setFilterOptions({
      ...filterOptions,
      mikrotik: mikrotikId,
    });
    setMikrotikId(mikrotikId);
  };

  // manual filter options
  const filterInputs = [
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
                  <div>{t("activeHotspot")}</div>

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
                          onClick={reloadHandler}
                        />
                      )}
                    </div>

                    {/* <Collapse in={open} dimension="width">
                      <div id="example-collapse-text">
                        <Card className="cardCollapse border-0">
                          <div className="d-flex align-items-center">
                            {((role === "manager" &&
                              permission?.customerEdit) ||
                              role === "ispOwner") && (
                              <div
                                className="addAndSettingIcon"
                                title={t("customerNumberUpdateOrDelete")}
                                onClick={() =>
                                  setNumberModalShow({
                                    ...numberModalShow,
                                    [false]: true,
                                  })
                                }
                              >
                                <PencilSquare className="addcutmButton" />
                              </div>
                            )}

                            {(permission?.viewCustomerList ||
                              role === "ispOwner") && (
                              <>
                                <CSVLink
                                  data={customerForCsV}
                                  filename={ispOwnerData.company}
                                  headers={customerForCsVHeader}
                                  title={t("customerReport")}
                                >
                                  <FiletypeCsv className="addcutmButton" />
                                </CSVLink>

                                <div className="addAndSettingIcon">
                                  <PrinterFill
                                    title={t("print")}
                                    className="addcutmButton"
                                    onClick={() => {
                                      setModalStatus("print");
                                      setShow(true);
                                    }}
                                  />
                                </div>
                              </>
                            )}
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
                    )} */}
                  </div>
                </div>
              </FourGround>
              <FourGround>
                {(permission?.viewCustomerList || role !== "collector") && (
                  <div className="mt-2">
                    <Accordion alwaysOpen activeKey={activeKeys}>
                      <Accordion.Item eventKey="filter">
                        <Accordion.Body>
                          <div className="displayGrid6">
                            {filterInputs.map(
                              (item) =>
                                item.isVisible && (
                                  <select
                                    className="form-select shadow-none mt-0"
                                    onChange={item.onChange}
                                    value={item.value}
                                  >
                                    <option value="">{item.firstOption}</option>
                                    {item.options?.map((opt) => (
                                      <option value={opt[item.valueAccessor]}>
                                        {opt[item.textAccessor]}
                                      </option>
                                    ))}
                                  </select>
                                )
                            )}

                            {/* <div
                              id="customer_filter_button"
                              className="d-flex justify-content-end align-items-end mt-0 "
                            >
                              <button
                                className="btn btn-outline-primary w-6rem h-76"
                                type="button"
                                // onClick={hotspotFilterHandler}
                                id="filterBtn"
                              >
                                {t("filter")}
                              </button>
                              <button
                                id="filter_reset"
                                className="btn btn-outline-secondary w-6rem h-76 ms-1 "
                                type="button"
                                // onClick={handleFilterReset}
                              >
                                {t("reset")}
                              </button>
                            </div> */}
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                    <div className="collectorWrapper pb-2">
                      <Table
                        isLoading={isLoading}
                        columns={columns}
                        data={customer}
                      />
                    </div>
                  </div>
                )}

                {/* {(butPermission?.customer || butPermission?.allPage) && (
                  <NetFeeBulletin />
                )} */}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      <BandwidthModal
        setModalShow={setBandWidthModal}
        modalShow={bandWidthModal}
        customer={{ ...bandWidthCustomerData, page: "Hotspot" }}
      />
    </>
  );
};

export default HotspotActiveCustomer;
