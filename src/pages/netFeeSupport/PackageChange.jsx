import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { FontColor, FourGround } from "../../assets/js/theme";
import { PersonPlusFill } from "react-bootstrap-icons";
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

  useEffect(() => {
    getPackageChangeApi(dispatch, ispOwner, setIsLoading);
    getAllPackages(dispatch, ispOwner, setPackageLoading);
  }, []);

  // bill report accept & reject handler
  const packageChangeRequestHandler = (status, item) => {
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
          profile: item.mikrotikPackageName,
        },
      };
    }

    packageChangeAcceptReject(dispatch, status, data, setAccLoading);
  };

  const findPackage = (packageId) => {
    const getPackage = allPackages?.find((item) => item.id === packageId);
    return getPackage?.name;
  };

  const columns = React.useMemo(
    () => [
      {
        width: "12%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "12%",
        Header: t("customerId"),
        accessor: "customerId",
      },
      {
        width: "10%",
        Header: t("name"),
        accessor: "name",
      },
      {
        Header: t("mobile"),
        width: "12%",
        accessor: "mobile",
      },

      {
        width: "10%",
        Header: t("previousPackage"),
        accessor: "previousPackage",
        Cell: ({ cell: { value } }) => <>{findPackage(value)}</>,
      },
      {
        width: "10%",
        Header: t("requestedPackage"),
        accessor: "mikrotikPackage",
        Cell: ({ cell: { value } }) => <>{findPackage(value)}</>,
      },
      {
        width: "11%",
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div>{t("packageChange")}</div>
                  <div
                    className="d-flex"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                    }}
                  >
                    <PersonPlusFill
                      className="addcutmButton"
                      title={t("addSupportTicket")}
                      //onClick={() => setShow(true)}
                    />
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
