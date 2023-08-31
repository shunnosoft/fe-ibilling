import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FourGround, FontColor } from "../../assets/js/theme";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMikrotik,
  getStaticActiveCustomer,
  staticMACBinding,
} from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
// get specific customer

import {
  ArrowClockwise,
  FileExcelFill,
  FilterCircle,
  Router,
  ThreeDots,
  Wifi,
  WifiOff,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import Footer from "../../components/admin/footer/Footer";
import { CSVLink } from "react-csv";
import moment from "moment";
import { Accordion } from "react-bootstrap";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";

const StaticActiveCustomer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(false);
  const [mtkLoading, setMtkLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState();

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

  // select mikrotik handler
  const mikrotiSelectionHandler = (event) => {
    setMikrotikId(event.target.value);
  };

  // filter
  if (filterStatus && filterStatus !== t("sokolCustomer")) {
    staticActiveCustomer = staticActiveCustomer.filter(
      (value) => value.complete === JSON.parse(filterStatus)
    );
  }

  // reload handler
  const reloadHandler = () => {
    getStaticActiveCustomer(dispatch, ispOwnerId, mikrotikId, setIsloading);
  };

  //mac-binding handler
  const macBindingCall = (customerId) => {
    console.log(customerId);
    // staticMACBinding(customerId);
  };

  // api call for get update static customer
  useEffect(() => {
    fetchMikrotik(dispatch, ispOwnerId, setMtkLoading);
    getStaticActiveCustomer(dispatch, ispOwnerId, mikrotikId, setIsloading);
  }, [mikrotikId]);

  useEffect(() => {
    setMikrotikId(mikrotik[0]?.id);
  }, [mikrotik]);

  useEffect(() => {
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, []);

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
      staticActiveCustomer.map((customer) => {
        return {
          name: customer.name,
          address: customer.address,
          macAddress: customer.macAddress,
          mobile: customer?.mobile.slice(1) || "",
          paymentStatus: customer.paymentStatus,
          billingCycle: moment(customer.billingCycle).format("MMM-DD-YYYY"),
        };
      }),
    [staticActiveCustomer]
  );

  const columns = useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
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
                  {(role === "ispOwner" || role === "manager") &&
                    bpSettings?.hasMikrotik && (
                      <li onClick={() => macBindingCall(original)}>
                        <div className="dropdown-item">
                          <div className="customerAction">
                            <Router />
                            <p className="actionP">{t("macBinding")}</p>
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
                {/* <h2 className="collectorTitle">{t("activeStaticCustomer")}</h2> */}

                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="d-flex">
                    <div>{t("activeStaticCustomer")}</div>
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

                    <CSVLink
                      data={activeCustomerCsvInfo}
                      filename={ispOwnerData.company}
                      headers={activeCustomerForCsvInfoHeader}
                      title="Active Customer BTRC Report"
                    >
                      <FileExcelFill className="addcutmButton" />
                    </CSVLink>
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="d-flex justify-content-center">
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
                          <div className="customer-filter ms-4">
                            <select
                              className="form-select mt-0"
                              aria-label="Default select example"
                              onChange={(event) =>
                                setFilterStatus(event.target.value)
                              }
                            >
                              <option selected> {t("sokolCustomer")} </option>
                              <option value={true}> {t("active")} </option>
                              <option value={false}> {t("in active")} </option>
                            </select>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="collectorWrapper">
                    <div className="table-section">
                      <Table
                        isLoading={isLoading}
                        columns={columns}
                        data={staticActiveCustomer}
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
