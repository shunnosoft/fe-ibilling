import React, { useEffect, useState } from "react";
import { ThreeDots, PenFill, ArchiveFill, Plus } from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import { getPackagewithoutmikrotik } from "../../features/apiCalls";
import CreatePackage from "./CreatePackageModal";
import EditPackage from "./EditPackageModal";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";

// import { getCollector, getSubAreas } from "../../features/apiCallReseller";

export default function Package() {
  const { t } = useTranslation();
  const packages = useSelector((state) => state.package.packages);
  // console.log(packages)
  const dispatch = useDispatch();
  const [collSearch, setCollSearch] = useState("");
  const collector = useSelector(
    (state) => state.persistedReducer.collector.collector
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  let serial = 0;

  const role = useSelector((state) => state.persistedReducer.auth.role);

  useEffect(() => {
    getPackagewithoutmikrotik(ispOwnerId, dispatch);
  }, [ispOwnerId, dispatch]);

  const [singlePackage, setSinglePackage] = useState("");

  const getSpecificPackage = (val) => {
    // console.log(val)
    setSinglePackage(val);
  };

  const searchHandler = (e) => {
    setCollSearch(e.toString().toLowerCase());
  };
  const deletePackageHandler = (e) => {
    // console.log(e);
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
                    getSpecificPackage(original);
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
      <CreatePackage></CreatePackage>
      <EditPackage package={singlePackage}></EditPackage>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <div className="collectorTitle d-flex justify-content-between px-5">
                <div>{t("package")}</div>
                {role === "ispOwner" && (
                  <div
                    title={t("addPackage")}
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#createPackage"
                  >
                    <Plus />
                  </div>
                )}
              </div>

              <FourGround>
                <div className="collectorWrapper">
                  {/* <div className="addCollector">
                    {role === "ispOwner" && (
                      <div className="addNewCollector">
                        <div className="displexFlexSys">
                          <div className="addAndSettingIcon">
                            {
                              <PlusLg
                                className="addcutmButton"
                                data-bs-toggle="modal"
                                data-bs-target="#createPackage"
                              />
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div> */}
                  {/* table */}
                  <Table columns={columns1} data={packages}></Table>
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
