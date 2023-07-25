import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import useDash from "../../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../../assets/js/theme";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChatText,
  KeyFill,
  PenFill,
  PersonFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { useEffect } from "react";
import { onlinePaymentCustomer } from "../../../features/resellerDataApi";
import Table from "../../../components/table/Table";
import moment from "moment";

const OnlinePayment = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let navigate = useNavigate();

  // get reseller id
  const { resellerId } = useParams();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  //get Online Payment Customer
  const customers = useSelector(
    (state) => state.resellerPayment?.onlinePaymentCustomer
  );

  useEffect(() => {
    if (resellerId) {
      onlinePaymentCustomer(dispatch, resellerId, setIsLoading);
    }
  }, [resellerId]);

  const columns = React.useMemo(
    () => [
      // {
      //   width: "6%",
      //   Header: "#",
      //   id: "row",
      //   accessor: (row) => Number(row.id + 1),
      //   Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      // },
      {
        width: "13%",
        Header: t("customerId"),
        accessor: "customer.customerId",
      },
      {
        width: "13%",
        Header: t("PPPoEName"),
        accessor: "customer.pppoe.name",
      },
      {
        width: "13%",
        Header: t("package"),
        accessor: "package",
      },
      {
        width: "10%",
        Header: t("amount"),
        accessor: "amount",
      },
      {
        width: "10%",
        Header: t("resellerCommission"),
        accessor: "resellerCommission",
      },
      {
        width: "13%",
        Header: t("ispOwnerCommission"),
        accessor: "ispOwnerCommission",
      },
      {
        width: "10%",
        Header: t("medium"),
        accessor: "medium",
      },
      {
        width: "15%",
        Header: t("createdAt"),
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div
                      className="pe-2 text-black"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(-1)}
                    >
                      <ArrowLeft
                        size={30}
                        className="arrowLeftSize text-white"
                      />
                    </div>
                    <h2>{t("onlinePaymentCustomer")}</h2>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div className="table-section">
                      <Table
                        isLoading={isLoading}
                        columns={columns}
                        data={customers}
                      ></Table>
                    </div>
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

export default OnlinePayment;
