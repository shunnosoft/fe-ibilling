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
import { ArrowLeft, Eye } from "react-bootstrap-icons";
import { fetchReseller } from "../../../features/apiCalls";
import AllCustomer from "../resellerModals/summaryData/AllCustomer";
import moment from "moment";

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
        width: "8%",
        Header: t("package"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <p
              className="text-primary reseller-summary-count"
              data-bs-toggle="modal"
              data-bs-target="#packageBasedCustomer"
              onClick={() => setPackageId(original.packageId)}
            >
              {original.packageName}
            </p>
            <p>
              {t("rate")} <b>{FormatNumber(original.packageRate)} </b>
            </p>
          </div>
        ),
      },
      {
        width: "12%",
        Header: t("packageCommission"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <p>
              {t("own")} <b>{FormatNumber(original.ispOwnerRate)}</b>
            </p>
            <p>
              {t("reseller")} <b>{FormatNumber(original.resellerRate)}</b>
            </p>
          </div>
        ),
      },
      {
        width: "11%",
        Header: t("allCustomer"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <p>
              {t("customer")} <b>{FormatNumber(original.customerCount)}</b>
            </p>
            <p>
              {t("sumBill")} <b>{FormatNumber(original.totalBill)}</b>
            </p>
          </div>
        ),
      },

      {
        width: "10%",
        Header: t("paid"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <p>
              {t("customer")} <b>{FormatNumber(original.paidCustomer)}</b>
            </p>
            <p>
              {t("sumBill")} <b>{FormatNumber(original.paidCustomerBillSum)}</b>
            </p>
          </div>
        ),
      },
      {
        width: "12%",
        Header: t("paidCommission"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <p>
              {t("own")}{" "}
              <b>{FormatNumber(original.paidCustomerBillIspOwnerCommission)}</b>
            </p>
            <p>
              {t("reseller")}{" "}
              <b>{FormatNumber(original.paidCustomerBillResellerCommission)}</b>
            </p>
          </div>
        ),
      },
      {
        width: "11%",
        Header: t("unpaid"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <p>
              {t("customer")} <b>{FormatNumber(original.unpaidCustomer)}</b>
            </p>
            <p>
              {t("sumBill")}{" "}
              <b>{FormatNumber(original.unpaidCustomerBillSum)}</b>
            </p>
          </div>
        ),
      },
      {
        width: "11%",
        Header: t("unpaidCommission"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <p>
              {t("own")}{" "}
              <b>
                {FormatNumber(original.unpaidCustomerBillIspOwnerCommission)}
              </b>
            </p>
            <p>
              {t("reseller")}{" "}
              <b>
                {FormatNumber(original.unpaidCustomerBillResellerCommission)}
              </b>
            </p>
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("other"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <p>
              {t("customer")} <b>{FormatNumber(original.otherCustomer)}</b>
            </p>
            <p>
              {t("sumBill")}{" "}
              <b>{FormatNumber(original.otherCustomerMonthlyFeeSum)}</b>
            </p>
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("otherCommission"),
        Cell: ({ row: { original } }) => (
          <div className="package-based-customer">
            <p>
              {t("own")}{" "}
              <b>
                {FormatNumber(original.otherCustomerBillIspOwnerCommission)}
              </b>
            </p>
            <p>
              {t("reseller")}{" "}
              <b>
                {FormatNumber(original.otherCustomerBillResellerCommission)}
              </b>
            </p>
          </div>
        ),
      },
      {
        Header: () => <div className="text-center">{t("view")}</div>,
        width: "5%",
        id: "option",

        Cell: ({ row: { original } }) => {
          return (
            <div className="d-flex align-items-center justify-content-center">
              <button
                data-bs-toggle="modal"
                data-bs-target="#packageBasedCustomer"
                onClick={() => setPackageId(original.packageId)}
                className="btn btn-sm btn-outline-primary"
              >
                <Eye />
              </button>
            </div>
          );
        },
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

  //function to calculate total paid Commision,unpaid and others
  const totalSum = () => {
    const initialValue = {
      paidCommissionCustomer: 0,
      paidCommissionOwner: 0,
      paidCommissionReseller: 0,
      paidBillSum: 0,

      unpaidCommissionCustomer: 0,
      unpaidCommissionOwner: 0,
      unpaidCommissionReseller: 0,
      unpaidBillSum: 0,

      othersCommissionCustomer: 0,
      othersCommissionOwner: 0,
      othersCommissionReseller: 0,
      othersBillSum: 0,
    };

    const calculatedValue = data.reduce((previous, current) => {
      // sum of all paid commission Customer
      previous.paidCommissionCustomer += current.paidCustomer;

      // sum of all paid commission ISP Owner
      previous.paidCommissionOwner +=
        current.paidCustomerBillIspOwnerCommission;

      // sum of all paid commission Reseller
      previous.paidCommissionReseller +=
        current.paidCustomerBillResellerCommission;

      // sum of all paid Bill Sum
      previous.paidBillSum += current.paidCustomerBillSum;

      // sum of all unpaid commission Customer
      previous.unpaidCommissionCustomer += current.unpaidCustomer;

      // sum of all unpaid commission Owner
      previous.unpaidCommissionOwner +=
        current.unpaidCustomerBillIspOwnerCommission;

      // sum of all unpaid commission Reseller
      previous.unpaidCommissionReseller +=
        current.unpaidCustomerBillResellerCommission;

      // sum of all unpaid Bill Sum
      previous.unpaidBillSum += current.unpaidCustomerBillSum;

      // sum of all other commission owner
      previous.othersCommissionCustomer += current.otherCustomer;

      // sum of all other commission customer
      previous.othersCommissionOwner +=
        current.otherCustomerBillIspOwnerCommission;

      // sum of all other commission reseller
      previous.othersCommissionReseller +=
        current.otherCustomerBillResellerCommission;

      // sum of all other Bill Sum
      previous.othersBillSum += current.otherCustomerMonthlyFeeSum;

      return previous;
    }, initialValue);
    return calculatedValue;
  };

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
                  <div className="d-md-flex justify-content-between">
                    <div style={{ marginBottom: "-23px" }}>
                      <table
                        className="table table-bordered"
                        style={{ lineHeight: "7px" }}
                      >
                        <tbody>
                          <tr>
                            <td>
                              <b>{t("paidCommission")}</b>
                            </td>
                            <td>
                              <b>{t("unpaidCommission")}</b>
                            </td>
                            <td>
                              <b>{t("othersCommission")}</b>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {t("customer")}:{" "}
                              <b>{totalSum().paidCommissionCustomer}</b>
                            </td>
                            <td>
                              {t("customer")}:{" "}
                              <b>{totalSum().unpaidCommissionCustomer}</b>
                            </td>
                            <td>
                              {t("customer")}:{" "}
                              <b>{totalSum().othersCommissionCustomer}</b>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {t("sumBill")}: <b>{totalSum().paidBillSum}</b>{" "}
                              {t("tk")}
                            </td>
                            <td>
                              {t("sumBill")}: <b>{totalSum().unpaidBillSum}</b>{" "}
                              {t("tk")}
                            </td>
                            <td>
                              {t("sumBill")}: <b>{totalSum().othersBillSum}</b>{" "}
                              {t("tk")}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {t("own")}:{" "}
                              <b>{totalSum().paidCommissionOwner}</b> {t("tk")}
                            </td>
                            <td>
                              {t("own")}:{" "}
                              <b>{totalSum().unpaidCommissionOwner}</b>{" "}
                              {t("tk")}
                            </td>
                            <td>
                              {t("own")}:{" "}
                              <b>{totalSum().othersCommissionOwner}</b>{" "}
                              {t("tk")}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {t("reseller")}:{" "}
                              <b>{totalSum().paidCommissionReseller}</b>{" "}
                              {t("tk")}
                            </td>
                            <td>
                              {t("reseller")}:{" "}
                              <b>{totalSum().unpaidCommissionReseller}</b>{" "}
                              {t("tk")}
                            </td>
                            <td>
                              {t("reseller")}:{" "}
                              <b>{totalSum().othersCommissionReseller}</b>{" "}
                              {t("tk")}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-center align-items-center gap-2 me-3">
                      <ReactDatePicker
                        selected={filterDate}
                        className="form-control shadow-none"
                        onChange={(date) => setFilterDate(date)}
                        dateFormat="MMM/yyyy"
                        showMonthYearPicker
                        showFullMonthYearPicker
                        placeholderText={t("filterDashboard")}
                        maxDate={new Date()}
                        minDate={
                          new Date(
                            moment(reseller?.createdAt).format("MMM/yyyy")
                          )
                        }
                      />

                      <button
                        className="btn btn-primary"
                        onClick={summaryFilterHandler}
                      >
                        {isLoading ? <Loader /> : t("filter")}
                      </button>
                    </div>
                  </div>
                  <Table
                    isLoading={isLoading}
                    customComponent={customComponent}
                    columns={columns}
                    data={data}
                  ></Table>
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
