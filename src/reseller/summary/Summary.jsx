import React, { useMemo } from "react";
import { ToastContainer } from "react-toastify";
import { FontColor, FourGround } from "../../assets/js/theme";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import useDash from "../../assets/css/dash.module.css";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getResellerData } from "../../features/resellerDataApi";
import { useDispatch } from "react-redux";
import Table from "../../components/table/Table";
import FormatNumber from "../../components/common/NumberFormat";

const Summary = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get reseller id
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth?.userData?.id
  );

  // get reseller data
  const data = useSelector((state) => state.resellerData.data);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getResellerData(ispOwnerId, resellerId, setIsLoading, dispatch);
  }, []);

  // table column
  const columns = React.useMemo(
    () => [
      {
        width: "5%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },

      {
        width: "10%",
        Header: t("customer"),
        accessor: "customerCount",
      },

      {
        width: "10%",
        Header: t("paid"),
        accessor: "paidCustomer",
      },
      {
        width: "10%",
        Header: t("unpaid"),
        accessor: "unpaidCustomer",
      },

      {
        width: "10%",
        Header: t("package"),
        accessor: "packageName",
      },
      {
        width: "10%",
        Header: t("rate"),
        accessor: "packageRate",
      },
      {
        width: "10%",
        Header: t("isp"),
        accessor: "ispOwnerRate",
      },
      {
        width: "10%",
        Header: t("own"),
        accessor: "resellerRate",
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
                <h2 className="collectorTitle"> {t("summary")} </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
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
    </>
  );
};

export default Summary;
