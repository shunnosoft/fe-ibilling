import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Loader from "../../components/common/Loader";
import useDash from "../../assets/css/dash.module.css";
import { useState } from "react";
import {
  ArrowClockwise,
  FileExcelFill,
  PrinterFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { getIspOwnerInvoice } from "../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/admin/footer/Footer";
import Table from "../../components/table/Table";
import moment from "moment";
import DatePicker from "react-datepicker";
import { CSVLink } from "react-csv";
import ReactToPrint from "react-to-print";
import PrintReport from "../report/ReportPDF";
import FormatNumber from "../../components/common/NumberFormat";

const CustomerInvoice = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // const [dateStart, setStartDate] = useState(firstDay);
  // const [dateEnd, setEndDate] = useState(today);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // all customer invoice
  const allInvoice = useSelector((state) => state?.payment?.customerInvoice);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // customer state
  const [customerInvoice, setCustomerInvoice] = useState([]);

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
  }, []);

  // set all customer in state
  useEffect(() => {
    setCustomerInvoice(allInvoice);
  }, [allInvoice]);

  const columns = useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "11%",
        Header: t("PPPoEName"),
        accessor: "customer.pppoe.name",
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: "package",
      },
      {
        width: "8%",
        Header: t("balance"),
        accessor: "amount",
      },
      {
        width: "10%",
        Header: t("discount"),
        accessor: "discount",
      },
      {
        width: "8%",
        Header: t("due"),
        accessor: "due",
      },
      {
        width: "8%",
        Header: t("agent"),
        accessor: "medium",
      },
      {
        width: "15%",
        Header: t("collector"),
        accessor: "name",
      },

      {
        width: "12%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
      {
        width: "10%",
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
                {/* <li
                  data-bs-toggle="modal"
                  data-bs-target="#reportEditModal"
                  onClick={() => {
                    getReportId(original?.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li> */}
              </ul>
            </div>
          </div>
        ),
      },
    ],
    [t]
  );

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
      // const { billType, medium, startDate, endDate } = filterOptions;

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

  //reload handler
  const reloadHandler = () => {
    getIspOwnerInvoice(dispatch, ispOwnerId, setIsLoading);
  };

  // customer invoice total amount count
  const addAllBills = useCallback(() => {
    var balance = 0;
    let discount = 0;
    customerInvoice.forEach((item) => {
      balance = balance + item.amount;
      discount = discount + item.discount;
    });
    return { balance, discount };
  }, [customerInvoice]);

  // set custom component value in customer bill amount
  const customComponent = (
    <div style={{ fontSize: "18px", display: "flex" }}>
      {
        <div>
          {t("totalBalance")} {FormatNumber(addAllBills().balance)} {t("tk")}
          &nbsp;&nbsp;
        </div>
      }
      {t("discount")}: {FormatNumber(addAllBills().discount)} {t("tk")}
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

  return (
    <>
      <Sidebar />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <h2>{t("invoice")}</h2>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                  <div className="report_bill d-flex">
                    <div className="addAndSettingIcon">
                      {/* <CSVLink
                          data={reportForCsVTableInfo}
                          filename={ispOwnerData.company}
                          headers={reportForCsVTableInfoHeader}
                          title="Bill Report"
                        >
                          <FileExcelFill className="addcutmButton" />
                        </CSVLink> */}
                    </div>

                    <div className="addAndSettingIcon">
                      <ReactToPrint
                        documentTitle={t("billInvoice")}
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
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div
                      id="custom-form-select"
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
                              className="form-select shadow-none"
                              onChange={item.onChange}
                              value={item.value}
                            >
                              <option value="">{item.firstOptions}</option>
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
                          className="form-control mt-3"
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
                          className="form-control mt-3"
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
                      <div>
                        <button
                          className="btn btn-outline-primary w-6rem mt-3"
                          type="button"
                          onClick={handleActiveFilter}
                          id="filterBtn"
                        >
                          {t("filter")}
                        </button>
                        <button
                          className="btn btn-outline-secondary ms-1 w-6rem mt-3"
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
                        currentCustomers={customerInvoice}
                        ref={componentRef}
                        status="invoice"
                      />
                    </div>
                  </div>
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      customComponent={customComponent}
                      columns={columns}
                      data={tableData}
                    ></Table>
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
};

export default CustomerInvoice;
