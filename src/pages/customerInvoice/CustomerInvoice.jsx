import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Loader from "../../components/common/Loader";
import useDash from "../../assets/css/dash.module.css";
import {
  ArrowClockwise,
  PrinterFill,
  ThreeDots,
  CurrencyDollar,
  ArchiveFill,
  FiletypeCsv,
  FilterCircle,
  ArrowBarLeft,
  ArrowBarRight,
} from "react-bootstrap-icons";
import {
  deleteIspOwnerCustomerInvoice,
  getCustomer,
  getIspOwnerInvoice,
} from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/admin/footer/Footer";
import Table from "../../components/table/Table";
import moment from "moment";
import DatePicker from "react-datepicker";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import PrintReport from "../report/ReportPDF";
import FormatNumber from "../../components/common/NumberFormat";
import CustomerBillCollectInvoice from "./invoiceCollect/CustomerBillCollectInvoice";
import CustomerInvoicePrint from "./customerInvoicePrint/CustomerInvoicePrint";
import { badge } from "../../components/common/Utils";
import { ToastContainer } from "react-toastify";
import InvoicePrint from "./customerInvoicePrint/InvoicePrint";
import { Accordion, Card, Collapse } from "react-bootstrap";

const CustomerInvoice = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();
  const cusOffice = useRef();
  const invoice = useRef();

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // all customer invoice
  const allInvoice = useSelector((state) => state?.payment?.customerInvoice);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(false);

  // customer state
  const [customerInvoice, setCustomerInvoice] = useState([]);

  // customer id state
  const [invoiceId, setInvoiceId] = useState("");

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // single customer invoice state
  const [singleInvoice, setSingleInvoice] = useState({});

  // status handle state
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  //filter state
  const [filterOptions, setFilterOption] = useState({
    billType: "",
    medium: "",
    startDate: firstDay,
    endDate: today,
  });

  useEffect(() => {
    allInvoice.length === 0 &&
      getIspOwnerInvoice(dispatch, ispOwnerId, setIsLoading);

    // get customer api
    getCustomer(dispatch, ispOwnerId, setCustomerLoading);
  }, []);

  // set all customer in state
  useEffect(() => {
    setCustomerInvoice(allInvoice);
  }, [allInvoice]);

  //reload handler
  const reloadHandler = () => {
    getIspOwnerInvoice(dispatch, ispOwnerId, setIsLoading);
  };

  // invoice filter
  const filterInputs = [
    {
      name: "billType",
      type: "select",
      id: "billType",
      value: filterOptions.billType,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          billType: e.target.value,
        });
      },
      options: [
        {
          text: t("connectionFee"),
          value: "connectionFee",
        },
        {
          text: t("monthBill"),
          value: "bill",
        },
      ],
      firstOptions: t("billType"),
      textAccessor: "text",
      valueAccessor: "value",
    },
    {
      name: "medium",
      type: "select",
      id: "billType",
      value: filterOptions.medium,
      isVisible: true,
      disabled: false,
      onChange: (e) => {
        setFilterOption({
          ...filterOptions,
          medium: e.target.value,
        });
      },
      options: [
        {
          text: t("handCash"),
          value: "cash",
        },
        {
          text: t("bKash"),
          value: "bKash",
        },
        {
          text: t("rocket"),
          value: "rocket",
        },
        {
          text: t("nagad"),
          value: "nagad",
        },
        {
          text: t("sslCommerz"),
          value: "sslcommerz",
        },
        {
          text: t("uddoktaPay"),
          value: "uddoktapay",
        },
        {
          text: t("others"),
          value: "others",
        },
      ],
      firstOptions: t("medium"),
      textAccessor: "text",
      valueAccessor: "value",
    },
  ];

  // filter and reset handle
  var { billType, medium, startDate, endDate } = filterOptions;
  const handleActiveFilter = () => {
    let tempCustomers = allInvoice.reduce((acc, c) => {
      // create date and filter date format
      const createDate = new Date(
        moment(c.createdAt).format("YYYY-MM-DD")
      ).getTime();

      const filterStartDate = new Date(
        moment(filterOptions.startDate).format("YYYY-MM-DD")
      ).getTime();

      const filterEndDate = new Date(
        moment(filterOptions.endDate).format("YYYY-MM-DD")
      ).getTime();

      const conditions = {
        billType: billType ? c.billType === billType : true,
        medium: medium ? c.medium === medium : true,
        filterDate:
          startDate && endDate
            ? createDate >= filterStartDate && createDate <= filterEndDate
            : true,
      };

      let isPass = false;
      isPass = conditions["billType"];
      if (!isPass) return acc;

      isPass = conditions["medium"];
      if (!isPass) return acc;

      isPass = conditions["filterDate"];
      if (!isPass) return acc;

      if (isPass) acc.push(c);
      return acc;
    }, []);

    // set filter customer invoice in all invoice
    setCustomerInvoice(tempCustomers);
  };

  // filter reset controller
  const handleFilterReset = () => {
    setFilterOption({
      billType: "",
      medium: "",
      startDate: firstDay,
      endDate: today,
    });
    setCustomerInvoice(allInvoice);
  };

  const sortingCustomerInvoice = useMemo(() => {
    return [...customerInvoice].sort((a, b) => {
      a = parseInt(a.customerId?.replace(/[^0-9]/g, ""));
      b = parseInt(b.customerId?.replace(/[^0-9]/g, ""));

      return a - b;
    });
  }, [customerInvoice]);

  const tableData = useMemo(() => sortingCustomerInvoice, [customerInvoice]);

  // set csv header
  const customerInvoiceForCsVHeader = [
    { label: "Name", key: "name" },
    { label: "Package", key: "package" },
    { label: "Bill_Amount", key: "amount" },
    { label: "Bill_Due", key: "due" },
    { label: "Bill_Medium", key: "medium" },
    { label: "Collector_Name", key: "collector" },
    { label: "Bill_Collect_Date", key: "createdAt" },
  ];

  // get data from customer invoice for csv
  let customerInvoiceForCsV = useMemo(
    () =>
      tableData.map((data) => {
        return {
          name: data?.customer?.name,
          package: data.package,
          amount: data.amount,
          due: data.due,
          medium: data.medium,
          collector: data.name,
          createdAt: moment(data.createdAt).format("YYYY-MM-DD"),
        };
      }),
    [customerInvoice]
  );

  // customer invoice total amount count
  const addAllBills = useCallback(() => {
    var balance = 0;
    let due = 0;
    customerInvoice.forEach((item) => {
      balance = balance + item.amount;
      due = due + item.due;
    });
    return { balance, due };
  }, [customerInvoice]);

  // set custom component value in customer bill amount
  const customComponent = (
    <div style={{ fontSize: "18px", display: "flex" }}>
      {
        <div>
          {t("totalAmount")}:-৳{FormatNumber(addAllBills().balance)}
          &nbsp;&nbsp;&nbsp;
          {t("due")}:-৳{FormatNumber(addAllBills().due)}
        </div>
      }
    </div>
  );

  // filter value in pdf
  const filterData = {
    billType: billType ? filterOptions.billType : t("all"),
    medium: medium ? filterOptions.medium : t("all"),
    startDate: filterOptions.startDate,
    endDate: filterOptions.endDate,
    totalBill: addAllBills().balance,
  };

  // invoice print handler
  const invoicePrintHandler = (value, status) => {
    setSingleInvoice(value);
    setStatus(status);

    setTimeout(function () {
      document.getElementById("invoicePrint").click();
    }, 100);
  };

  // customer invoice delete handler
  const invoiceDeleteHandler = (invoiceId) => {
    const confirm = window.confirm(t("deleteCustomerInvoice"));

    if (confirm) {
      deleteIspOwnerCustomerInvoice(dispatch, invoiceId);
    }
  };

  const columns = useMemo(
    () => [
      {
        width: "6%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "10%",
        Header: t("PPPoEName"),
        accessor: (item) =>
          item.customer?.userType === "pppoe"
            ? item.customer?.pppoe?.name
            : item.customer?.userType === "firewall-queue"
            ? item.customer?.queue?.address
            : item.customer?.userType === "core-queue"
            ? item.customer?.queue?.srcAddress
            : item.customer?.queue?.target,
      },
      {
        width: "9%",
        Header: t("package"),
        accessor: "package",
      },
      {
        width: "8%",
        Header: t("monthly"),
        accessor: "customer.monthlyFee",
      },
      {
        width: "8%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "8%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "9%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("discount"),
        accessor: "discount",
      },
      {
        width: "6%",
        Header: t("due"),
        accessor: "due",
      },
      {
        width: "8%",
        Header: t("note"),
        accessor: "note",
      },
      {
        width: "8%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },
      {
        width: "6%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="dropdown">
              <ThreeDots
                className="dropdown-toggle ActionDots"
                id="areaDropdown"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              />
              <ul className="dropdown-menu" aria-labelledby="customerDrop">
                {original?.paymentStatus !== "paid" &&
                  original?.customer !== null && (
                    <li
                      onClick={() => {
                        setInvoiceId(original.id);
                        setShow(true);
                      }}
                    >
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <CurrencyDollar />
                          <p className="actionP">{t("recharge")}</p>
                        </div>
                      </div>
                    </li>
                  )}

                <li
                  onClick={() => {
                    invoicePrintHandler(original, "both");
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PrinterFill />
                      <p className="actionP">{t("office&customer")}</p>
                    </div>
                  </div>
                </li>
                <li
                  onClick={() => {
                    invoicePrintHandler(original, "customer");
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PrinterFill />
                      <p className="actionP">{t("customer")}</p>
                    </div>
                  </div>
                </li>

                <li onClick={() => invoiceDeleteHandler(original.id)}>
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">{t("delete")}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div>{t("invoice")}</div>

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
                            <div className="addAndSettingIcon">
                              <CSVLink
                                data={customerInvoiceForCsV}
                                filename={ispOwnerData.company}
                                headers={customerInvoiceForCsVHeader}
                                title={t("customerInvoice")}
                              >
                                <FiletypeCsv
                                  style={{
                                    height: "34px",
                                    width: "34px",
                                  }}
                                  className="addcutmButton"
                                />
                              </CSVLink>
                            </div>

                            <div className="addAndSettingIcon">
                              <ReactToPrint
                                documentTitle={t("billInvoice")}
                                trigger={() => (
                                  <PrinterFill
                                    style={{
                                      height: "34px",
                                      width: "34px",
                                    }}
                                    title={t("print")}
                                    className="addcutmButton"
                                  />
                                )}
                                content={() => invoice.current}
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
                        <div>
                          <div
                            className="displayGrid6"
                            style={{
                              columnGap: "5px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {filterInputs.map(
                              (item) =>
                                item.isVisible && (
                                  <select
                                    className="form-select mt-0"
                                    onChange={item.onChange}
                                    value={item.value}
                                  >
                                    <option value="">
                                      {item.firstOptions}
                                    </option>
                                    {item.options?.map((opt) => (
                                      <option value={opt[item.valueAccessor]}>
                                        {opt[item.textAccessor]}
                                      </option>
                                    ))}
                                  </select>
                                )
                            )}

                            {/* date picker for filter createAt and updateAt */}
                            <div>
                              <DatePicker
                                className="form-control"
                                selected={filterOptions.startDate}
                                onChange={(date) =>
                                  setFilterOption({
                                    ...filterOptions,
                                    startDate: date,
                                  })
                                }
                                dateFormat="MMM dd yyyy"
                              />
                            </div>

                            <div>
                              <DatePicker
                                className="form-control"
                                selected={filterOptions.endDate}
                                onChange={(date) =>
                                  setFilterOption({
                                    ...filterOptions,
                                    endDate: date,
                                  })
                                }
                                dateFormat="MMM dd yyyy"
                              />
                            </div>

                            {/* filter and reset control button */}
                            <div className="d-flex justify-content-end align-items-end">
                              <button
                                className="btn btn-outline-primary w-6rem"
                                type="button"
                                onClick={handleActiveFilter}
                                id="filterBtn"
                              >
                                {t("filter")}
                              </button>
                              <button
                                className="btn btn-outline-secondary ms-1 w-6rem"
                                type="button"
                                onClick={handleFilterReset}
                              >
                                {t("reset")}
                              </button>
                            </div>
                          </div>

                          {/* all customer invoice print */}
                          <div style={{ display: "none" }}>
                            <PrintReport
                              filterData={filterData}
                              currentCustomers={tableData}
                              ref={componentRef}
                              status="invoice"
                            />
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <div className="collectorWrapper pb-2">
                    <>
                      <div style={{ display: "none" }}>
                        <ReactToPrint
                          documentTitle={t("billInvoice")}
                          trigger={() => (
                            <div type="button" id="invoicePrint"></div>
                          )}
                          content={() => cusOffice.current}
                        />
                        <CustomerInvoicePrint
                          ref={cusOffice}
                          invoiceData={{
                            name: singleInvoice?.customer?.name,
                            mobile: singleInvoice?.customer?.mobile,
                            address: singleInvoice?.customer?.address,
                            package: singleInvoice.package,
                            amount: singleInvoice.amount,
                            due: singleInvoice.due,
                            discount: singleInvoice.discount,
                            note: singleInvoice.note,
                            billType: singleInvoice.billType,
                            medium: singleInvoice.medium,
                            billingCycle: singleInvoice?.customer?.billingCycle,
                            status: status,
                          }}
                          ispOwnerData={ispOwnerData}
                        />
                      </div>

                      <div style={{ display: "none" }}>
                        <InvoicePrint
                          ref={invoice}
                          currentCustomers={tableData}
                          ispOwnerData={ispOwnerData}
                        />
                      </div>
                    </>
                    <div className="table-section">
                      <Table
                        isLoading={isLoading}
                        customComponent={customComponent}
                        columns={columns}
                        data={tableData}
                      ></Table>
                    </div>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      <CustomerBillCollectInvoice
        show={show}
        setShow={setShow}
        invoiceId={invoiceId}
      />
    </>
  );
};

export default CustomerInvoice;
