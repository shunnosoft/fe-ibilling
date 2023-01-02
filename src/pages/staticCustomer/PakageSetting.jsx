import React, { useEffect, useState } from "react";
import {
  ThreeDots,
  PenFill,
  PlusLg,
  ArrowLeftShort,
  ArchiveFill,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

// internal imports
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import {
  deleteStaticPackage,
  fetchMikrotik,
  getQueuePackageByIspOwnerId,
} from "../../features/apiCalls";
import CreatePackage from "./CreatePackageModal";
import EditPackage from "./EditPackageModal";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";

export default function PackageSetting() {
  const { t } = useTranslation();
  // import dispatch
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get login user role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get mikrotik from state
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get all package list
  let packages = useSelector((state) => state?.package?.packages);

  // delete local state
  const [isDeleting, setIsDeleting] = useState(false);

  // data loading state
  const [isLoading, setIsloading] = useState(false);

  // mikrotik loading state
  const [mikrotikLoading, setMikrotikLoading] = useState(false);

  // set editable data for state
  const [singlePackage, setSinglePackage] = useState("");

  // set filter status
  const [filterStatus, setFilterStatus] = useState(null);

  // navigate handler
  const goToAllCustomer = () => {
    navigate("/staticCustomer");
  };

  // filter mikrotik
  if (filterStatus && filterStatus !== t("mikrotik")) {
    packages = packages.filter((value) => value.mikrotik === filterStatus);
  }

  // api call
  useEffect(() => {
    // get mikrotik api call
    fetchMikrotik(dispatch, ispOwnerId, setMikrotikLoading);

    // get package api call
    getQueuePackageByIspOwnerId(ispOwnerId, dispatch, setIsloading);
  }, [ispOwnerId]);

  // delete handle function
  const deletePackageHandler = (packageId) => {
    const confirm = window.confirm(t("doWantDeletePackage"));
    if (confirm) {
      setIsDeleting(true);
      deleteStaticPackage(dispatch, packageId);
    }
  };

  // table column
  const columns = React.useMemo(
    () => [
      {
        Header: t("serial"),
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: t("package"),
        accessor: "name",
      },
      {
        Header: t("rate"),
        accessor: "rate",
      },

      {
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDots
              className="dropdown-toggle ActionDots"
              id="areaDropdown"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul className="dropdown-menu" aria-labelledby="customerDrop">
              {
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#editPackage"
                  onClick={() => {
                    setSinglePackage(original);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>
              }
              <li
                onClick={() => {
                  deletePackageHandler(original.id);
                }}
              >
                <div className="dropdown-item actionManager">
                  <div className="customerAction">
                    <ArchiveFill />
                    <p className="actionP">{t("delete")}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <CreatePackage></CreatePackage>
      <EditPackage package={singlePackage}></EditPackage>

      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="d-flex collectorTitle px-4">
                  <div className="AllMikrotik mt-1" onClick={goToAllCustomer}>
                    <ArrowLeftShort className="arrowLeftSize" />
                    <span style={{ marginLeft: "3px" }}>{t("customer")}</span>
                  </div>
                  <div className="mx-auto"> {t("staticPackageSetting")} </div>
                  {role === "ispOwner" && (
                    <div className="addAndSettingIcon">
                      <PlusLg
                        className="addcutmButton"
                        data-bs-toggle="modal"
                        data-bs-target="#createPackage"
                      />
                    </div>
                  )}
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div className="mikrotiKFilter">
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(event) =>
                          setFilterStatus(event.target.value)
                        }
                      >
                        <option selected>{t("mikrotik")}</option>
                        {mikrotik.map((item) => (
                          <option value={item.id}>{item.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={packages}
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
}
