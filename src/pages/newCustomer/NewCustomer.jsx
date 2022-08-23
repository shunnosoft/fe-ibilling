import React from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getCustomer, getStaticCustomer } from "../../features/apiCalls";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import moment from "moment";
import DatePicker from "react-datepicker";
import Loader from "../../components/common/Loader";
import { ArrowClockwise } from "react-bootstrap-icons";
import { Tab, Tabs } from "react-bootstrap";

const NewCustomer = () => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  // get Current date
  const today = new Date();

  // get first date of month
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  // main data state
  const [mainData, setMainData] = useState([]);

  // static customer state
  const [staticData, setStaticData] = useState([]);

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // start date state
  const [startDate, setStartDate] = useState(firstDay);

  // end date state
  const [endDate, setEndDate] = useState(today);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get all customer from redux
  const customer = useSelector((state) => state?.customer?.customer);

  // get all static customer from redux
  const staticCustomer = useSelector(
    (state) => state?.customer?.staticCustomer
  );

  // filter function
  const onClickFilter = (value) => {
    let filterData = [];
    if (value === "pppoe") {
      filterData = [...customer];
    }
    if (value === "static") {
      filterData = [...staticCustomer];
    }

    // date filter
    filterData = filterData.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );

    if (value === "pppoe") {
      setMainData(filterData);
    }
    if (value === "static") {
      setStaticData(filterData);
    }
  };

  // reload handler
  const reloadHandler = () => {
    getCustomer(dispatch, ispOwner, setIsloading);
    getStaticCustomer(dispatch, ispOwner, setIsloading);
  };

  // get customer api call
  useEffect(() => {
    if (mainData.length === 0) getCustomer(dispatch, ispOwner, setIsloading);
    getStaticCustomer(dispatch, ispOwner, setIsloading);
  }, []);

  // set customer data on maindata state
  useEffect(() => {
    setMainData(customer);
  }, [customer]);

  // initial filter
  useEffect(() => {
    let initialFilter = [...customer];

    // date filter
    initialFilter = initialFilter.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );

    setMainData(initialFilter);
  }, [customer]);

  // set static customer in static state
  useEffect(() => {
    setStaticData(staticCustomer);
  }, [staticCustomer]);

  // initial filter for static customer
  useEffect(() => {
    let staticInitialFilter = [...staticCustomer];

    // date filter
    staticInitialFilter = staticInitialFilter.filter(
      (value) =>
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() >=
          new Date(moment(startDate).format("YYYY-MM-DD")).getTime() &&
        new Date(moment(value.createdAt).format("YYYY-MM-DD")).getTime() <=
          new Date(moment(endDate).format("YYYY-MM-DD")).getTime()
    );

    setStaticData(staticInitialFilter);
  }, [staticCustomer]);

  // pppoe column
  const pppoeColumns = React.useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "9%",
        Header: t("name"),
        Cell: ({ row: { original } }) => (
          <div
            style={{ cursor: "move" }}
            data-toggle="tooltip"
            data-placement="top"
            title={original.address}
          >
            {original.name}
          </div>
        ),
      },
      {
        width: "9%",
        Header: t("PPPoE"),
        accessor: "pppoe.name",
      },
      {
        width: "12%",
        Header: t("mobile"),
        accessor: "mobile",
      },

      {
        width: "8%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "11%",
        Header: t("paymentFilter"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "10%",
        Header: t("package"),
        accessor: "pppoe.profile",
      },
      {
        width: "11%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "10%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "12%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
    ],
    [t]
  );

  // static column
  const staticColumns = React.useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customerId",
      },
      {
        width: "9%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "12%",
        Header: t("ip"),
        accessor: (field) =>
          field.userType === "firewall-queue"
            ? field.queue.address
            : field.queue.target,
      },

      {
        width: "12%",
        Header: t("mobile"),
        accessor: "mobile",
      },

      {
        width: "9%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("paymentFilter"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "9%",
        Header: t("mountly"),
        accessor: "monthlyFee",
      },
      {
        width: "10%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "12%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
    ],
    [t]
  );

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
                    <h2>{t("customer")}</h2>
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader></Loader>
                      ) : (
                        <ArrowClockwise
                          onClick={() => reloadHandler()}
                        ></ArrowClockwise>
                      )}
                    </div>
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <Tabs
                      defaultActiveKey={"pppoe"}
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="pppoe" title={t("PPPoE")}>
                        {/* filter selector */}
                        <div className="selectFilteringg">
                          <div>
                            <DatePicker
                              className="form-control mw-100"
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <div className="mx-2">
                            <DatePicker
                              className="form-control mw-100"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <div className="">
                            <button
                              className="btn btn-outline-primary w-140 "
                              type="button"
                              onClick={() => onClickFilter("pppoe")}
                            >
                              {t("filter")}
                            </button>
                          </div>
                        </div>

                        <div className="table-section">
                          <Table
                            isLoading={isLoading}
                            columns={pppoeColumns}
                            data={mainData}
                          ></Table>
                        </div>
                      </Tab>
                      <Tab eventKey="static" title={t("static")}>
                        {/* filter selector */}
                        <div className="selectFilteringg">
                          <div>
                            <DatePicker
                              className="form-control mw-100"
                              selected={startDate}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <div className="mx-2">
                            <DatePicker
                              className="form-control mw-100"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>
                          <div className="">
                            <button
                              className="btn btn-outline-primary w-140 "
                              type="button"
                              onClick={() => onClickFilter("static")}
                            >
                              {t("filter")}
                            </button>
                          </div>
                        </div>

                        <div className="table-section">
                          <Table
                            isLoading={isLoading}
                            columns={staticColumns}
                            data={staticData}
                          ></Table>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewCustomer;
