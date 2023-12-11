import React, { useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { FontColor, FourGround } from "../../assets/js/theme";
import { useCallback, useEffect } from "react";
import { getResellerRechargeHistioty } from "../../features/apiCalls";
import { useDispatch } from "react-redux";
import moment from "moment";
import DatePicker from "react-datepicker";

//internal import
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import { ArrowClockwise, FilterCircle } from "react-bootstrap-icons";
import { Accordion } from "react-bootstrap";
import Loader from "../../components/common/Loader";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";

const RechargeHistory = () => {
  const { t } = useTranslation();

  // current date
  var today = new Date();
  var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  firstDay.setHours(0, 0, 0, 0);
  today.setHours(23, 59, 59, 999);

  // import dispatch
  const dispatch = useDispatch();

  // get reseller id
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  //get reseller recharge history form redux store
  const rechargeHistory = useSelector((state) => state.recharge.singleHistory);

  // date start state
  const [dateStart, setStartDate] = useState(firstDay);

  // date end filter
  const [dateEnd, setEndDate] = useState(today);

  // reseller data loading state
  const [isLoading, setIsLoading] = useState(false);

  // report data state
  const [mainData, setMainData] = useState([]);

  // filter Accordion handle state
  const [activeKeys, setActiveKeys] = useState("");

  // api calls
  useEffect(() => {
    rechargeHistory?.length === 0 &&
      getResellerRechargeHistioty(resellerId, setIsLoading, dispatch);
  }, []);

  // set reseller recharge history
  useEffect(() => {
    setMainData(rechargeHistory);
  }, [rechargeHistory]);

  // api calls reload handler
  const reloadHandler = () => {
    getResellerRechargeHistioty(resellerId, setIsLoading, dispatch);
  };

  // filter handler
  const onClickFilter = () => {
    let filterData = [...rechargeHistory];
    // date filter
    filterData = filterData.filter(
      (item) =>
        new Date(item.createdAt) >= new Date(dateStart).setHours(0, 0, 0, 0) &&
        new Date(item.createdAt) <= new Date(dateEnd).setHours(23, 59, 59, 999)
    );

    setMainData(filterData);
  };

  // table column
  const columns = useMemo(
    () => [
      {
        width: "15%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "15%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "15%",
        Header: t("medium"),
        accessor: "medium",
      },
      {
        width: "15%",
        Header: t("status"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "20%",
        Header: t("comment"),
        accessor: "comment",
      },
      {
        width: "20%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },
    ],
    [t]
  );

  // total amount calculation
  const getTotalRecharge = useCallback(() => {
    let totalRecharge = 0;

    mainData.forEach((item) => {
      totalRecharge = totalRecharge + item.amount;
    });
    return { totalRecharge };
  }, [mainData]);

  // send to table header
  const customComponent = (
    <div style={{ fontSize: "18px", display: "flex", alignItems: "center" }}>
      <div style={{ marginRight: "10px" }}>
        {t("totalRecharge")} : {FormatNumber(getTotalRecharge().totalRecharge)}{" "}
        {t("tk")}
      </div>
    </div>
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
                  <div>{t("rechargeHistory")}</div>

                  <div className="d-flex align-items-center">
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
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="mt-2">
                  <Accordion alwaysOpen activeKey={activeKeys}>
                    <Accordion.Item eventKey="filter">
                      <Accordion.Body>
                        <div className="selectFilteringg displayGrid">
                          <div>
                            <DatePicker
                              className="form-control"
                              selected={dateStart}
                              onChange={(date) => setStartDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
                          </div>

                          <div>
                            <DatePicker
                              className="form-control"
                              selected={dateEnd}
                              onChange={(date) => setEndDate(date)}
                              dateFormat="MMM dd yyyy"
                              placeholderText={t("selectBillDate")}
                            />
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
                  <div className="collectorWrapper py-2">
                    <div className="table-section">
                      <Table
                        isLoading={isLoading}
                        columns={columns}
                        data={mainData}
                        customComponent={customComponent}
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
    </>
  );
};

export default RechargeHistory;
