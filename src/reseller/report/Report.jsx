import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import {
  ArrowBarLeft,
  ArrowBarRight,
  ArrowClockwise,
  FilterCircle,
  PrinterFill,
  Wallet2,
} from "react-bootstrap-icons";
import Footer from "../../components/admin/footer/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBills,
  getResellerUsers,
  getSubAreas,
} from "../../features/apiCallReseller";
import moment from "moment";
import Table from "../../components/table/Table";
import FormatNumber from "../../components/common/NumberFormat";
import ReactToPrint from "react-to-print";
import PrintReport from "./ReportPDF";
import DatePicker from "react-datepicker";
import { Accordion, Card, Collapse } from "react-bootstrap";
import WithdrawOnlinePayment from "./WithdrawOnlinePayment";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import { getAllPackages } from "../../features/apiCalls";
import ReportView from "../../pages/report/modal/ReportView";
import { getOwnerUsers } from "../../features/getIspOwnerUsersApi";

const Report = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // date & time find
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  //get ispOwnerId
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get isp owner data
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerData?.bpSettings
  );

  // get user information
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  // get reseller, collector collection all bills
  const allBills = useSelector((state) => state.payment.allBills);
  console.log(allBills);

  // get all area subArea
  const subAreas = useSelector((state) => state.area.area);

  // get user role
  const userRole = useSelector((state) => state.persistedReducer.auth.role);

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // get reseller all users data from redux store
  const resellerUsers = useSelector((state) => state.reseller.resellerUsers);

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  // reseller id from role base
  const resellerId = userRole === "collector" ? userData.reseller : userData.id;

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);
  const [defaultLoading, setDefaultLoading] = useState(false);

  // collection all bills state
  const [mainData, setMainData] = useState(allBills);

  // select area id state
  const [areaIds, setAreaIds] = useState("");

  // select collector id state
  const [collectorIds, setCollectorIds] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // bill report medium
  const [medium, setMedium] = useState("");

  // customer bill type
  const [billType, setBillType] = useState("");

  // report note view id
  const [viewId, setViewId] = useState();

  // filter date state
  const [filterDate, setFilterDate] = useState(firstDay);

  // curr & priv date state
  const [dateStart, setStartDate] = useState(new Date());
  const [dateEnd, setEndDate] = useState(new Date());

  var selectDate = new Date(filterDate.getFullYear(), filterDate.getMonth(), 1);
  var lastDate = new Date(
    filterDate.getFullYear(),
    filterDate.getMonth() + 1,
    0
  );

  useEffect(() => {
    setStartDate(selectDate);

    if (lastDate.getMonth() + 1 === today.getMonth() + 1) {
      setEndDate(today);
    } else {
      setEndDate(lastDate);
    }

    filterDate.getMonth() + 1 &&
      getAllBills(
        dispatch,
        userData.id,
        filterDate.getFullYear(),
        filterDate.getMonth() + 1,
        setIsLoading
      );
  }, [filterDate]);

  useEffect(() => {
    setMainData(allBills);
  }, [allBills]);

  useEffect(() => {
    getSubAreas(dispatch, userData.id);

    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);

    getAllPackages(dispatch, ispOwnerId, setPackageLoading);

    // get reseller user api
    getResellerUsers(dispatch, resellerId, setDefaultLoading);

    // get ispOwner all staffs
    ownerUsers?.length === 0 && getOwnerUsers(dispatch, ispOwnerId);
  }, []);

  // reload handler
  const reloadHandler = () => {
    getAllBills(
      dispatch,
      userData.id,
      filterDate.getFullYear(),
      filterDate.getMonth() + 1,
      setIsLoading
    );
  };

  // reseller & collector collection bill report filter
  const collectionReportFilter = () => {
    let arr = [...allBills];

    if (areaIds) {
      arr = arr.filter((bill) => bill?.customer?.subArea === areaIds);
    }

    if (collectorIds) {
      arr = arr.filter((bill) => bill?.user === collectorIds);
    }

    if (medium) {
      if (medium === "onlinePayment") {
        arr = arr.filter(
          (paymentStatus) =>
            paymentStatus.medium === "sslcommerz" ||
            paymentStatus.medium === "uddoktapay" ||
            paymentStatus.medium === "sslpay" ||
            paymentStatus.medium === "bKashPG"
        );
      } else {
        arr = arr.filter((item) => item.medium === medium);
      }
    }

    if (billType) {
      arr = arr.filter((val) => val.billType === billType);
    }

    arr = arr.filter(
      (item) =>
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(dateStart).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(item.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(dateEnd).format("YYYY-MM-DD")).getTime()
    );

    setMainData(arr);
  };

  // customer current package find
  const getCustomerPackage = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
  };

  //
  const getCollectedByBill = (collectedId) => {
    const performer = ownerUsers.find((item) => item[collectedId]);
    return performer && performer[collectedId];
  };

  // select area & collector find
  const areaName = subAreas.find((item) => item.id === areaIds);
  const collector = resellerUsers.find((item) => item.user === collectorIds);

  // collection bill report print pdf
  const filterData = {
    area: areaName?.name ? areaName.name : t("all"),
    collector: collector?.name ? collector.name : t("all"),
    startDate: moment(dateStart).format("YYYY-MM-DD"),
    endDate: moment(dateEnd).format("YYYY-MM-DD"),
    totalBill: mainData.reduce((prev, current) => prev + current.amount, 0),
  };

  // collection all bill amount count
  const addAllBills = useCallback(() => {
    var count = 0;
    mainData.forEach((item) => {
      count = count + item.amount;
    });
    return FormatNumber(count);
  }, [mainData]);

  const customComponent = (
    <div style={{ fontSize: "18px" }}>
      {t("totalBill")} {addAllBills()} {t("tk")}
    </div>
  );

  //billing data show columns
  const columns = useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "12%",
        Header: t("name"),
        accessor: "customer.name",
      },
      {
        width: "11%",
        Header: t("package"),
        accessor: "customer.mikrotikPackage",
        Cell: ({ cell: { value } }) => (
          <div>{getCustomerPackage(value)?.name}</div>
        ),
      },
      {
        width: "11%",
        Header: t("bill"),
        accessor: "amount",
      },
      {
        width: "11%",
        Header: t("discount"),
        accessor: "discount",
      },
      {
        width: "11%",
        Header: t("billType"),
        accessor: "billType",
      },
      {
        width: "11%",
        Header: t("medium"),
        accessor: "medium",
      },
      {
        width: "11%",
        Header: t("collected"),
        accessor: (data) => `${getCollectedByBill(data?.user)?.name}`,
        Cell: ({ row: { original } }) => (
          <div>{getCollectedByBill(original?.user)?.name}</div>
        ),
      },
      {
        width: "12%",
        Header: t("note"),
        accessor: (data) => {
          return {
            id: data.id,
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
                {value.note && value.note.slice(0, 15)}
                <span>{value?.note && value?.note?.length > 15 && "..."}</span>
              </p>
              {value?.start && value?.end && (
                <span className="badge bg-secondary">
                  {moment(value.start).format("YYYY/MM/DD")}
                  {moment(value.end).format("YYYY/MM/DD")}
                </span>
              )}
              <p>
                {value?.month && value.month.slice(0, 15)}
                <span>
                  {value?.month && value?.month?.length > 15 && "..."}
                </span>
              </p>
              <span
                className="see_more"
                data-bs-toggle="modal"
                data-bs-target="#reportView"
                onClick={() => {
                  setViewId(value?.id);
                }}
              >
                ...See More
              </span>
            </>
          );
        },
      },
      {
        width: "12%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },
    ],
    [t, allBills, allPackages, ownerUsers]
  );

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <div className="collectorTitle d-flex justify-content-between px-4">
                <div>{t("billReport")}</div>

                <div className="d-flex justify-content-center align-items-center"></div>

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
                      />
                    )}
                  </div>

                  <Collapse in={open} dimension="width">
                    <div id="example-collapse-text">
                      <Card className="cardCollapse border-0">
                        <div className="d-flex align-items-center">
                          {bpSettings?.hasPG && (
                            <div
                              className="addAndSettingIcon"
                              onClick={() => setShow(true)}
                              title={t("withdrawal request")}
                            >
                              <Wallet2 className="addcutmButton" />
                            </div>
                          )}

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
                            className="form-select me-2 mt-0"
                            onChange={(e) => setAreaIds(e.target.value)}
                          >
                            <option value="" defaultValue>
                              {t("allArea")}
                            </option>
                            {subAreas?.map((sub, key) => (
                              <option key={key} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </select>

                          {userRole !== "collector" && (
                            <select
                              className="form-select me-2 mt-0"
                              onChange={(e) => setCollectorIds(e.target.value)}
                            >
                              <option value="" defaultValue>
                                {t("all collector")}
                              </option>
                              {resellerUsers?.map((coll, key) => (
                                <option key={key} value={coll.user}>
                                  {coll.name}
                                </option>
                              ))}
                            </select>
                          )}

                          <select
                            className="form-select mt-0"
                            onChange={(e) => setMedium(e.target.value)}
                          >
                            <option value="" defaultValue>
                              {t("medium")}
                            </option>
                            <option value="cash">{t("handCash")}</option>
                            <option value="onlinePayment">
                              {t("onlinePayment")}
                            </option>
                            <option value="bKash"> {t("bKash")} </option>
                            <option value="rocket"> {t("rocket")} </option>
                            <option value="nagad"> {t("nagad")} </option>
                            <option value="others"> {t("others")} </option>
                          </select>

                          <select
                            className="form-select mt-0"
                            onChange={(e) => setBillType(e.target.value)}
                          >
                            <option value="" defaultValue>
                              {t("billType")}
                            </option>
                            <option value="bill">{t("bill")}</option>
                            <option value="connectionFee">
                              {t("connectionFee")}
                            </option>
                          </select>

                          <div>
                            <DatePicker
                              className="form-control mw-100 mt-0"
                              selected={dateStart}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              minDate={selectDate}
                              maxDate={
                                lastDate.getMonth() + 1 === today.getMonth() + 1
                                  ? today
                                  : lastDate
                              }
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <div>
                            <DatePicker
                              className="form-control mw-100 mt-0"
                              selected={dateEnd}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MMM dd yyyy"
                              minDate={selectDate}
                              maxDate={
                                lastDate.getMonth() + 1 === today.getMonth() + 1
                                  ? today
                                  : lastDate
                              }
                              placeholderText={t("selectBillDate")}
                            />
                          </div>

                          <button
                            className="btn btn-outline-primary w-140 mt-0 chartFilteritem"
                            type="button"
                            onClick={collectionReportFilter}
                          >
                            {t("filter")}
                          </button>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>

                  <div className="collectorWrapper pb-2">
                    <div className="addCollector">
                      {/* print report */}
                      <div style={{ display: "none" }}>
                        <PrintReport
                          filterData={filterData}
                          currentCustomers={mainData}
                          ref={componentRef}
                        />
                      </div>
                      {/* print report end*/}

                      <div className="table-section">
                        <Table
                          customComponent={customComponent}
                          isLoading={isLoading}
                          columns={columns}
                          data={mainData}
                        ></Table>
                      </div>
                    </div>
                  </div>
                </div>

                {(butPermission?.collectionReport ||
                  butPermission?.allPage) && <NetFeeBulletin />}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      <WithdrawOnlinePayment show={show} setShow={setShow} />
      <ReportView reportId={viewId} status="resellerCollection" />
    </>
  );
};

export default Report;
