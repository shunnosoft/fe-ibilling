import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import { ArrowClockwise } from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import Table from "../../components/table/Table";
import Footer from "../../components/admin/footer/Footer";
import {
  acceptedChangePackage,
  getChangePackage,
  rejectChangePackage,
} from "../../features/apiCallReseller";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getAllPackages } from "../../features/apiCalls";

const ChangePackage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // reseller id
  const resellerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser.reseller.id
  );

  // get package from redux
  const allPackages = useSelector((state) => state.package.allPackages);

  // get reseller change package request all data
  const resellerChangeRequest = useSelector(
    (state) => state.netFeeSupport?.resellerChangeRequest
  );

  //Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [acceptLoading, setAccLoading] = useState(false);
  const [isRequest, setIsRequest] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);

  useEffect(() => {
    getChangePackage(dispatch, resellerId, setIsLoading);
    getAllPackages(dispatch, ispOwner, setPackageLoading);
  }, []);

  //function to find package from id and show it in table
  const packageInfo = (packageId) => {
    const findPackage = allPackages?.find((item) => item.id === packageId);
    return findPackage;
  };

  const reloadHandler = () => {
    getChangePackage(dispatch, resellerId, setIsLoading);
  };

  // package accept handler
  const packageAcceptedHandler = (status, item) => {
    //find package
    const getPackage = allPackages?.find(
      (pac) => pac.id === item.mikrotikPackage
    );

    const data = {
      mikrotikPackage: item.mikrotikPackage,
      customer: item.customer,
      status,
      id: item.id,
      pppoe: {
        profile: getPackage?.name,
      },
    };

    const confirm = window.confirm(t("acceptedRequest"));
    if (confirm) {
      acceptedChangePackage(dispatch, data, setIsRequest);
    }
  };

  // package rejected handler
  const packageRejectedHandler = (status, item) => {
    const data = {
      status: status,
      id: item.id,
    };

    const confirm = window.confirm(t("rejectedRequest"));
    if (confirm) {
      rejectChangePackage(dispatch, data, setIsRequest);
    }
  };

  //columns for table
  const columns = React.useMemo(
    () => [
      {
        width: "9%",
        Header: t("customerId"),
        accessor: "customerId",
      },
      {
        width: "8%",
        Header: t("name"),
        accessor: "name",
      },
      {
        Header: t("mobile"),
        width: "8%",
        accessor: "mobile",
      },

      {
        width: "10%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm a");
        },
      },

      {
        width: "10%",
        Header: t("previousPackage"),
        accessor: "previousPackage",
        Cell: ({ cell: { value } }) => <>{packageInfo(value)?.name}</>,
      },
      {
        width: "12%",
        Header: t("requestedPackage"),
        accessor: "mikrotikPackage",
        Cell: ({ cell: { value } }) => <>{packageInfo(value)?.name}</>,
      },
      {
        width: "8%",
        Header: t("action"),

        Cell: ({ row: { original } }) => (
          <div>
            {original.status === "pending" ? (
              <div
                style={{
                  display: "flex",
                  cursor: "pointer",
                }}
              >
                <span
                  class="badge bg-success w-4rem me-1"
                  onClick={() => {
                    packageAcceptedHandler("accepted", original);
                  }}
                >
                  {t("accept")}
                </span>
                <span
                  style={{ cursor: "pointer" }}
                  class="badge bg-warning"
                  onClick={() => {
                    packageRejectedHandler("rejected", original);
                  }}
                >
                  {t("rejected")}
                </span>
              </div>
            ) : original.status === "accepted" ? (
              <span class="badge bg-success">{t(original.status)}</span>
            ) : (
              <span class="badge bg-warning">{t(original.status)}</span>
            )}
          </div>
        ),
      },
    ],
    [t, allPackages]
  );

  return (
    <div>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div>{t("packageChange")}</div>
                  <div className="reloadBtn">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <ArrowClockwise
                        className="arrowClock"
                        title={t("refresh")}
                        onClick={reloadHandler}
                      />
                    )}
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={resellerChangeRequest}
                  ></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePackage;
