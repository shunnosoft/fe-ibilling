import React, { useRef } from "react";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import moment from "moment";
import Footer from "../../components/admin/footer/Footer";
import "../Customer/customer.css";
import "./report.css";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { getCollectorBill } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import FormatNumber from "../../components/common/NumberFormat";
import {
  ArrowClockwise,
  FilterCircle,
  PrinterFill,
} from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import ReactToPrint from "react-to-print";
import { Accordion, Badge } from "react-bootstrap";
import PrintReport from "../../reseller/report/CollectorReportPDF";
import { badge } from "../../components/common/Utils";

export default function CollectorReport() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const collectorArea = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.collector.areas
  );

  // get user permission
  const permissions = useSelector(
    (state) => state.persistedReducer.auth.currentUser.collector.permissions
  );

  // get user information
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  const allBills = useSelector((state) => state.collector.collectorBill);

  var today = new Date();
  var firstDay = permissions?.dashboardCollectionData
    ? new Date(today.getFullYear(), today.getMonth(), 1)
    : new Date();

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // filter date state
  const [filterDate, setFilterDate] = useState(firstDay);

  const [dateStart, setStartDate] = useState(new Date());
  const [dateEnd, setEndDate] = useState(new Date());

  var selectDate = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1);
  var lastDate = new Date(
    filterDate.getFullYear(),
    filterDate.getMonth() + 1,
    0
  );
  const [allArea, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [singleArea, setArea] = useState({});
  const [subAreaIds, setSubArea] = useState([]);
  const [mainData, setMainData] = useState(allBills);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  useEffect(() => {
    let areas = [];

    collectorArea?.map((item) => {
      let area = {
        id: item?.area?.id,
        name: item?.area?.name,
        subAreas: [
          {
            id: item?.id,
            name: item?.name,
          },
        ],
      };

      let found = areas?.find((area) => area?.id === item.area?.id);
      if (found) {
        found.subAreas.push({ id: item.id, name: item.name });

        return (areas[areas.findIndex((item) => item.id === found.id)] = found);
      } else {
        return areas.push(area);
      }
    });

    setAreas(areas);
  }, [collectorArea]);

  useEffect(() => {
    setStartDate(selectDate);

    if (lastDate.getMonth() + 1 === today.getMonth() + 1) {
      setEndDate(today);
    } else {
      setEndDate(lastDate);
    }

    filterDate.getMonth() + 1 &&
      getCollectorBill(
        dispatch,
        filterDate.getFullYear(),
        filterDate.getMonth() + 1,
        setIsLoading
      );
  }, [filterDate]);

  useEffect(() => {
    setMainData(allBills);
  }, [allBills]);

  // reloadHandler
  const reloadHandler = () => {
    getCollectorBill(
      dispatch,
      filterDate.getFullYear(),
      filterDate.getMonth() + 1,
      setIsLoading
    );
  };

  const onChangeArea = (param) => {
    let area = JSON.parse(param);
    setArea(area);

    if (
      area &&
      Object.keys(area).length === 0 &&
      Object.getPrototypeOf(area) === Object.prototype
    ) {
      setSubArea([]);
    } else {
      let subAreaIds = [];

      area?.subAreas.map((sub) => subAreaIds.push(sub.id));

      setSubArea(subAreaIds);
    }
  };

  const onChangeSubArea = (id) => {
    if (!id) {
      let subAreaIds = [];
      singleArea?.subAreas.map((sub) => subAreaIds.push(sub?.id));

      setSubArea(subAreaIds);
    } else {
      setSubArea([id]);
    }
  };

  const onClickFilter = () => {
    let arr = allBills;

    if (subAreaIds.length) {
      arr = allBills?.filter((bill) =>
        subAreaIds?.includes(bill?.customer?.subArea)
      );
    }

    arr = arr.filter(
      (item) =>
        Date.parse(item.createdAt) >= Date.parse(dateStart) &&
        Date.parse(item.createdAt) <= Date.parse(dateEnd)
    );

    setMainData(arr);
  };

  const addAllBills = useCallback(() => {
    var count = 0;
    mainData?.forEach((item) => {
      count = count + item.amount;
    });
    return FormatNumber(count);
  }, [mainData]);

  const customComponent = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      {permissions?.dashboardCollectionData && (
        <div>
          {t("collectorReportBill")} {addAllBills()} {t("tk")}
        </div>
      )}
    </div>
  );

  const columns = React.useMemo(
    () => [
      {
        width: "6%",
        Header: t("id"),
        accessor: (field) =>
          field?.hotspotCustomer
            ? field?.hotspotCustomer?.customerId
            : field?.customer?.customerId,
        Cell: ({ row: { original } }) => (
          <div>
            <p className="text-center">
              {original?.hotspotCustomer
                ? original?.hotspotCustomer?.customerId
                : original?.customer?.customerId}
            </p>
            <Badge
              bg={
                original.customer?.userType === "pppoe"
                  ? "primary"
                  : original.customer?.userType === "static"
                  ? "info"
                  : "secondary"
              }
            >
              {original.customer?.userType === "pppoe"
                ? "PPPoE"
                : original.customer?.userType === "static"
                ? "Static"
                : "Hotspot"}
            </Badge>
          </div>
        ),
      },
      {
        width: "15%",
        Header: t("pppoeIp"),
        accessor: (field) =>
          `${
            field?.hotspotCustomer
              ? field?.hotspotCustomer?.name
              : field?.customer?.name
          } ${
            field.customer?.userType === "pppoe"
              ? field.customer?.pppoe?.name
              : field.customer?.userType === "static"
              ? field.customer?.queue?.target
              : field?.hotspotCustomer?.hotspot?.name
          }`,
        Cell: ({ row: { original } }) => {
          const customer = original?.customer;
          const hotspotCustomer = original?.hotspotCustomer;

          const name = hotspotCustomer?.name || customer?.name;

          let addressInfo = "";
          if (customer?.userType === "pppoe") {
            addressInfo = customer?.pppoe?.name;
          } else if (customer?.userType === "static") {
            addressInfo = customer?.queue?.target;
          } else {
            addressInfo = hotspotCustomer?.hotspot?.name;
          }

          return (
            <div>
              <p>{name}</p>
              <p>{addressInfo}</p>
            </div>
          );
        },
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: (field) =>
          field.customer?.mikrotikPackage?.name
            ? field.customer?.mikrotikPackage?.name
            : field.customer?.userType === "pppoe"
            ? field?.package
            : field?.hotspotCustomer?.hotspot.profile,
      },
      {
        width: "10%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "10%",
        Header: t("due"),
        accessor: "due",
      },
      {
        width: "10%",
        Header: t("TypeMedium"),
        accessor: (field) => `${field?.billingType} ${field?.medium}`,
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <p style={{ fontWeight: "500" }}>{original?.medium}</p>
              <p>{badge(original?.billingType)}</p>
            </div>
          );
        },
      },
      {
        width: "8%",
        Header: t("note"),
        accessor: (data) => {
          return {
            id: data._id,
            note: data.note,
            start: data.start,
            end: data.end,
            month: data.month,
          };
        },
        Cell: ({ cell: { value } }) => {
          return (
            <>
              <p>
                {value.note && value.note.slice(0, 15)}{" "}
                <span>{value?.note && value?.note?.length > 15 && "..."}</span>
              </p>
              {value?.start && value?.end && (
                <span className="badge bg-secondary">
                  {moment(value.start).format("YYYY/MM/DD")}
                  {moment(value.end).format("YYYY/MM/DD")}
                </span>
              )}
              <p>
                {value?.month && value.month.slice(0, 15)}{" "}
                <span>
                  {value?.month && value?.month?.length > 15 && "..."}
                </span>
              </p>
            </>
          );
        },
      },
      {
        width: "12%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
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
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div> {t("billReport")} </div>

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

                    <ReactToPrint
                      documentTitle={t("billReport")}
                      trigger={() => (
                        <PrinterFill className="addcutmButton border-0" />
                      )}
                      content={() => componentRef.current}
                    />
                    <div style={{ display: "none" }}>
                      <PrintReport
                        // filterData={filterData}
                        currentCustomers={mainData}
                        ref={componentRef}
                      />
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
                          <div>
                            <DatePicker
                              className="form-control mw-100 mt-0"
                              selected={filterDate}
                              onChange={(date) => setFilterDate(date)}
                              dateFormat="MMM-yyyy"
                              showMonthYearPicker
                              showFullMonthYearPicker
                              maxDate={new Date()}
                              minDate={new Date(userData?.createdAt)}
                            />
                          </div>

                          <select
                            className="form-select mt-0"
                            onChange={(e) => onChangeArea(e.target.value)}
                          >
                            <option value={JSON.stringify({})} defaultValue>
                              {t("allArea")}{" "}
                            </option>
                            {allArea.map((area, key) => (
                              <option key={key} value={JSON.stringify(area)}>
                                {area.name}
                              </option>
                            ))}
                          </select>
                          <select
                            className="form-select mt-0"
                            onChange={(e) => onChangeSubArea(e.target.value)}
                          >
                            <option value="" defaultValue>
                              {t("allSubArea")}{" "}
                            </option>
                            {singleArea?.subAreas?.map((sub, key) => (
                              <option key={key} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </select>

                          <div>
                            {permissions?.dashboardCollectionData && (
                              <DatePicker
                                className="form-control mw-100 mt-0"
                                selected={dateStart}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="MMM dd yyyy"
                                minDate={selectDate}
                                maxDate={
                                  lastDate.getMonth() + 1 ===
                                  today.getMonth() + 1
                                    ? today
                                    : lastDate
                                }
                                placeholderText={t("selectBillDate")}
                              />
                            )}
                          </div>
                          <div>
                            {permissions?.dashboardCollectionData && (
                              <DatePicker
                                className="form-control mw-100 mt-0"
                                selected={dateEnd}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="MMM dd yyyy"
                                minDate={selectDate}
                                maxDate={
                                  lastDate.getMonth() + 1 ===
                                  today.getMonth() + 1
                                    ? today
                                    : lastDate
                                }
                                placeholderText={t("selectBillDate")}
                              />
                            )}
                          </div>

                          <button
                            className="btn btn-outline-primary w-140"
                            type="button"
                            onClick={onClickFilter}
                          >
                            {t("filter")}
                          </button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="collectorWrapper pb-2">
                    <div className="addCollector">
                      <div className="table-section">
                        <Table
                          customComponent={customComponent}
                          columns={columns}
                          data={mainData}
                          isLoading={isLoading}
                        />
                      </div>
                    </div>
                  </div>
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
