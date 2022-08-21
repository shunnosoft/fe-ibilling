import React from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { getCustomer } from "../../features/apiCalls";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/table/Table";
import { badge } from "../../components/common/Utils";
import moment from "moment";
import DatePicker from "react-datepicker";

const NewCustomer = () => {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  const today = new Date();
  //   console.log(today);

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // start date state
  const [startDate, setStartDate] = useState(today);
  //   console.log(startDate);

  // end date state
  const [endDate, setEndDate] = useState(today);
  //   console.log(endDate);

  // get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get all customer from redux
  const customer = useSelector((state) => state?.customer?.customer);
  //   console.log(customer);

  // get customer api call
  useEffect(() => {
    getCustomer(dispatch, ispOwner, setIsloading);
  }, []);

  const columns = React.useMemo(
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
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    {/* filter selector */}
                    <div className="selectFilteringg">
                      <DatePicker
                        className="form-control mw-100"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="MMM dd yyyy"
                        placeholderText={t("selectBillDate")}
                      />
                      <DatePicker
                        className="form-control mw-100"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="MMM dd yyyy"
                        placeholderText={t("selectBillDate")}
                      />

                      <div>
                        <button
                          className="btn btn-outline-primary w-110 mt-2"
                          type="button"
                          //   onClick={onClickFilter}
                        >
                          {t("filter")}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* <DatePicker
                    className="form-control mw-100"
                    // selected={billDate}
                    // onChange={(date) => setBillDate(date)}
                    dateFormat="dd/MM/yyyy:hh:mm"
                    showTimeSelect
                    placeholderText={t("selectBillDate")}
                  /> */}

                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={customer}
                    ></Table>
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
