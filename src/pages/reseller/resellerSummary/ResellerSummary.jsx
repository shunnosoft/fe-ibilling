import React, { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { FontColor, FourGround } from "../../../assets/js/theme";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import useDash from "../../../assets/css/dash.module.css";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getResellerData } from "../../../features/resellerDataApi";
import { useDispatch } from "react-redux";
import Table from "../../../components/table/Table";
import FormatNumber from "../../../components/common/NumberFormat";
import Loader from "../../../components/common/Loader";
import ReactDatePicker from "react-datepicker";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import { fetchReseller } from "../../../features/apiCalls";
import AllCustomer from "../resellerModals/summaryData/AllCustomer";

const ResellerSummary = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  // get id from route
  const { resellerId } = useParams();

  // get current date
  const date = new Date();

  // get all reseller
  const allReseller = useSelector((state) => state?.reseller?.reseller);

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get reseller data
  const data = useSelector((state) => state.resellerData.data);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // reseller data loader
  const [dataLoader, setDataLoader] = useState(false);

  // date filter state
  const [filterDate, setFilterDate] = useState(date);

  // packageId state
  const [packageId, setPackageId] = useState();

  // find current reseller
  const reseller = allReseller.find((item) => item.id === resellerId);

  const filterData = {
    year: filterDate.getFullYear(),
    month: filterDate.getMonth() + 1,
  };

  // filter handler
  const summaryFilterHandler = () => {
    getResellerData(ispOwnerId, resellerId, setIsLoading, filterData, dispatch);
  };

  // get reseller summary api call
  useEffect(() => {
    getResellerData(ispOwnerId, resellerId, setIsLoading, filterData, dispatch);
    fetchReseller(dispatch, ispOwnerId, setDataLoader);
  }, []);

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "9%",
        Header: t("package"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <span
              className="text-primary reseller-summary-count"
              data-bs-toggle="modal"
              data-bs-target="#packageBasedCustomer"
              onClick={() => setPackageId(original.packageId)}
            >
              {original.packageName}
            </span>
          </div>
        ),
      },
      {
        width: "5%",
        Header: t("rate"),
        accessor: "packageRate",
      },
      {
        width: "7%",
        Header: t("own"),
        accessor: "ispOwnerRate",
      },
      {
        width: "7%",
        Header: t("reseller"),
        accessor: "resellerRate",
      },
      {
        width: "7%",
        Header: t("customer"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <span
              className="text-primary reseller-summary-count"
              data-bs-toggle="modal"
              data-bs-target="#packageBasedCustomer"
              onClick={() => setPackageId(original.packageId)}
            >
              {original.customerCount}
            </span>
          </div>
        ),
      },
      {
        width: "9%",
        Header: t("sumBill"),
        accessor: "totalBill",
      },

      {
        width: "7%",
        Header: t("paid"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <span
              className="text-primary reseller-summary-count"
              data-bs-toggle="modal"
              data-bs-target="#packageBasedCustomer"
              onClick={() => setPackageId(original.packageId)}
            >
              {original.paidCustomer}
            </span>
          </div>
        ),
      },
      {
        width: "7%",
        Header: t("paidSum"),
        accessor: "paidCustomerBillSum",
      },
      {
        width: "7%",
        Header: t("own"),
        accessor: "paidCustomerBillIspOwnerCommission",
      },
      {
        width: "7%",
        Header: t("reseller"),
        accessor: "paidCustomerBillResellerCommission",
      },
      {
        width: "7%",
        Header: t("unpaid"),
        accessor: "unpaidCustomer",
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <span
              className="text-primary reseller-summary-count"
              data-bs-toggle="modal"
              data-bs-target="#packageBasedCustomer"
              onClick={() => setPackageId(original.packageId)}
            >
              {original.unpaidCustomer}
            </span>
          </div>
        ),
      },
      {
        width: "7%",
        Header: t("unpaidSum"),
        accessor: "unpaidCustomerBillSum",
      },
      {
        width: "7%",
        Header: t("own"),
        accessor: "unpaidCustomerBillIspOwnerCommission",
      },
      {
        width: "7%",
        Header: t("reseller"),
        accessor: "unpaidCustomerBillResellerCommission",
      },
    ],
    [t]
  );

  //total monthly fee and due calculation
  const summaryCalculation = useMemo(() => {
    const initialValue = {
      totalPackageRate: 0,
      totalIspCommission: 0,
      totalResellerCommission: 0,
    };

    const calculatedValue = data.reduce((previous, current) => {
      // sum of all package rate
      previous.totalPackageRate += current.packageRate;

      // sum of all isp owner commission
      previous.totalIspCommission += current.ispOwnerRate;

      // sum of all reseller commission
      previous.totalResellerCommission += current.resellerRate;

      return previous;
    }, initialValue);
    return calculatedValue;
  }, [data]);

  //custom table header component
  const customComponent = (
    <div className="text-center" style={{ fontSize: "18px", display: "flex" }}>
      {t("rate")}&nbsp; {FormatNumber(summaryCalculation?.totalPackageRate)}
      &nbsp;
      {t("tk")} &nbsp; {t("isp")}&nbsp;
      {FormatNumber(summaryCalculation?.totalIspCommission)} &nbsp;{t("tk")}
      &nbsp;&nbsp;
      {t("own")}&nbsp;
      {FormatNumber(summaryCalculation?.totalResellerCommission)} &nbsp;
      {t("tk")} &nbsp;
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div
                      className="pe-2 text-black"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft className="arrowLeftSize" />
                    </div>
                    <div>
                      {reseller?.name} {t("summary")}
                    </div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="d-flex justify-content-end">
                    <div>
                      <ReactDatePicker
                        selected={filterDate}
                        className="form-control shadow-none"
                        onChange={(date) => setFilterDate(date)}
                        dateFormat="MMM/yyyy"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        endDate={"2014/04/08"}
                        placeholderText={t("filterDashboard")}
                        maxDate={new Date()}
                        minDate={new Date(reseller?.createdAt)}
                      />
                    </div>
                    <button
                      className="btn btn-primary w-140 ms-1"
                      onClick={summaryFilterHandler}
                    >
                      {isLoading ? <Loader /> : t("filter")}
                    </button>
                  </div>
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      customComponent={customComponent}
                      columns={columns}
                      data={data}
                    ></Table>
                  </div>
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
      <AllCustomer
        packageId={packageId}
        resellerId={resellerId}
        year={filterData.year}
        month={filterData.month}
      />
    </>
  );
};

export default ResellerSummary;
