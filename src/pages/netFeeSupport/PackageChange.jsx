import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { FontColor, FourGround } from "../../assets/js/theme";
import Table from "../../components/table/Table";
import Footer from "../../components/admin/footer/Footer";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPackages,
  getPackageChangeApi,
  packageChangeAcceptReject,
} from "../../features/apiCalls";
import useDash from "../../assets/css/dash.module.css";
import Loader from "../../components/common/Loader";
import moment from "moment";
import { ArrowClockwise } from "react-bootstrap-icons";

const PackageChange = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // netFee support data
  const packageChangeRequest = useSelector(
    (state) => state.netFeeSupport?.packageChangeRequest
  );

  // get user role form redux
  const userRole = useSelector((state) => state.persistedReducer.auth?.role);
  const allPackages = useSelector((state) => state.package.allPackages);

  //Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);
  const [acceptLoading, setAccLoading] = useState(false);

  //api calls
  useEffect(() => {
    getPackageChangeApi(dispatch, ispOwner, setIsLoading);
    getAllPackages(dispatch, ispOwner, setPackageLoading);
  }, []);

  // package change accept & reject handler
  const packageChangeRequestHandler = (status, item) => {
    //finding the package name
    const getPackage = allPackages?.find(
      (pac) => pac.id === item.mikrotikPackage
    );

    let data = {};
    if (status === "rejected") {
      data = {
        status: "rejected",
        id: item.id,
      };
    }
    if (status === "accepted") {
      data = {
        mikrotikPackage: item.mikrotikPackage,
        customer: item.customer,
        status,
        id: item.id,
        pppoe: {
          profile: getPackage.name,
        },
      };
    }
    const con = window.confirm("Are You Sure?");
    if (con) {
      //api call
      packageChangeAcceptReject(dispatch, status, data, setAccLoading);
    }
  };

  //function to find package from id and show it in table
  const findPackage = (packageId) => {
    const getPackage = allPackages?.find((item) => item.id === packageId);
    return getPackage?.name;
  };

  const reloadHandler = () => {
    getPackageChangeApi(dispatch, ispOwner, setIsLoading);
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
        Cell: ({ cell: { value } }) => <>{findPackage(value)}</>,
      },
      {
        width: "12%",
        Header: t("requestedPackage"),
        accessor: "mikrotikPackage",
        Cell: ({ cell: { value } }) => <>{findPackage(value)}</>,
      },
      {
        width: "8%",
        Header: t("action"),

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              {original.status === "pending" ? (
                acceptLoading ? (
                  <div className="loaderDiv">
                    <Loader />
                  </div>
                ) : (
                  <div>
                    <span
                      style={{ cursor: "pointer" }}
                      class="badge bg-success shadow me-1"
                      onClick={() => {
                        packageChangeRequestHandler("accepted", original);
                      }}
                    >
                      {t("accept")}
                    </span>
                    <span
                      style={{ cursor: "pointer" }}
                      class="badge bg-danger shadow"
                      onClick={() => {
                        packageChangeRequestHandler("rejected", original);
                      }}
                    >
                      {t("cancel")}
                    </span>
                  </div>
                )
              ) : (
                <span class="badge bg-warning shadow">{original.status}</span>
              )}
            </div>
          </div>
        ),
      },
    ],
    [t, allPackages]
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
                <div className="collectorTitle d-flex px-5">
                  <div>{t("packageChange")}</div>
                  <div className="reloadBtn">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <ArrowClockwise onClick={reloadHandler} />
                    )}
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={packageChangeRequest}
                  ></Table>
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

export default PackageChange;
