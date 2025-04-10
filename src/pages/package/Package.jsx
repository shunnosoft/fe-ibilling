import React, { useEffect, useState } from "react";
import {
  ThreeDots,
  PenFill,
  ArchiveFill,
  Plus,
  ArrowClockwise,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// internal imports
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import {
  deleteWithOutMikrotikPackage,
  getWithoutMikrotikPackage,
} from "../../features/apiCalls";
import CreatePackage from "./CreatePackageModal";
import Table from "../../components/table/Table";
import Loader from "../../components/common/Loader";
import PackageModal from "../staticCustomer/PackageModal";

const Package = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get role from redux store
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get isp owner id from redux
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  // get packages without mikrotik
  const packages = useSelector((state) => state.package.packages);

  // get collector form redux store
  const collector = useSelector((state) => state.collector.collector);

  // get current user form redux store
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // set single package
  const [singlePackage, setSinglePackage] = useState("");

  // modal close handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // api call
  useEffect(() => {
    if (packages.length === 0)
      getWithoutMikrotikPackage(ispOwnerId, dispatch, setIsLoading);
  }, []);

  // reload handler
  const reloadHandler = () => {
    getWithoutMikrotikPackage(ispOwnerId, dispatch, setIsLoading);
  };

  // specific package handler
  const getSpecificPackage = (val) => {
    setSinglePackage(val);
  };

  // delete package handler
  const deletePackageHandler = (id) => {
    const confirm = window.confirm(t("withOutPackageDelete"));
    if (confirm) {
      deleteWithOutMikrotikPackage(dispatch, id);
    }
  };

  const columns1 = React.useMemo(
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
          <div className="d-flex justify-content-center align-items-center">
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
                  onClick={() => {
                    getSpecificPackage(original);
                    setModalStatus("packageEdit");
                    setShow(true);
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
              <div className="collectorTitle d-flex justify-content-between px-4">
                <h2>{t("package")}</h2>

                <div className="d-flex align-items-center">
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

                  {role === "ispOwner" && (
                    <div
                      title={t("addPackage")}
                      onClick={() => {
                        setModalStatus("packageCreate");
                        setShow(true);
                      }}
                    >
                      <Plus className="addcutmButton" />
                    </div>
                  )}
                </div>
              </div>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <Table
                    isLoading={isLoading}
                    columns={columns1}
                    data={packages}
                  ></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* package create modal */}
      {modalStatus === "packageCreate" && (
        <CreatePackage show={show} setShow={setShow} />
      )}

      {/* package edit modal */}
      {modalStatus === "packageEdit" && (
        <PackageModal
          show={show}
          setShow={setShow}
          isUpdate={true}
          singlePackage={singlePackage}
        />
      )}
    </>
  );
};

export default Package;
