import React, { useEffect, useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PersonFill,
  PenFill,
  ArrowClockwise,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

// internal imports
import "./collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import CollectorPost from "./collectorCRUD/CollectorPost";
// import Loader from "../../components/common/Loader";
import Pagination from "../../components/Pagination";

import TdLoader from "../../components/common/TdLoader";
import CollectorDetails from "./collectorCRUD/CollectorDetails";
import CollectorEdit from "./collectorCRUD/CollectorEdit";
import { getCollector, getSubAreas } from "../../features/apiCallReseller";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";

export default function Collector() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [collSearch, setCollSearch] = useState("");
  const collector = useSelector(
    (state) => state.persistedReducer.collector.collector
  );
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [collectorPerPage, setCollectorPerPage] = useState(5);
  const [isLoading, setIsloading] = useState(false);
  const lastIndex = currentPage * collectorPerPage;
  const firstIndex = lastIndex - collectorPerPage;
  const currentCollector = collector.slice(firstIndex, lastIndex);
  const [allCollector, setCollector] = useState(currentCollector);
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permission
  );
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // reload handler
  const reloadHandler = () => {
    getCollector(dispatch, userData.id, setIsloading);
  };

  useEffect(() => {
    if (collector.length === 0)
      getCollector(dispatch, userData.id, setIsloading);
    getSubAreas(dispatch, userData.id);
  }, [userData, dispatch]);

  const [singleCollector, setSingleCollector] = useState("");
  const getSpecificCollector = (id) => {
    if (collector.length !== undefined) {
      const temp = collector.find((val) => {
        return val.id === id;
      });
      setSingleCollector(temp);
    }
  };

  useEffect(() => {
    const keys = ["name", "mobile", "email"];
    if (collSearch !== "") {
      setCollector(
        collector.filter((item) =>
          keys.some((key) =>
            typeof item[key] === "string"
              ? item[key]?.toString().toLowerCase().includes(collSearch)
              : item[key].toString().includes(collSearch)
          )
        )
      );
    } else {
      setCollector(collector);
    }
  }, [collSearch, collector]);

  const searchHandler = (e) => {
    setCollSearch(e.toString().toLowerCase());
  };
  const columns = React.useMemo(
    () => [
      {
        width: "15%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "22%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "23%",
        Header: t("address"),
        accessor: "address",
      },
      {
        width: "20%",
        Header: t("mobile"),
        accessor: "mobile",
      },
      {
        width: "20%",
        Header: t("email"),
        accessor: "email",
      },

      {
        width: "20%",
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
              <li
                data-bs-toggle="modal"
                data-bs-target="#showCollectorDetails"
                onClick={() => {
                  getSpecificCollector(original.id);
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <PersonFill />
                    <p className="actionP">{t("profile")}</p>
                  </div>
                </div>
              </li>
              {permission?.collectorEdit || role === "ispOwner" ? (
                <li
                  data-bs-toggle="modal"
                  data-bs-target="#collectorEditModal"
                  onClick={() => {
                    getSpecificCollector(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li>
              ) : (
                ""
              )}
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
              <div className="collectorTitle d-flex justify-content-between px-5">
                <div className="d-flex">
                  <div>{t("collector")}</div>
                  <div className="reloadBtn">
                    {isLoading ? (
                      <Loader></Loader>
                    ) : (
                      <ArrowClockwise
                        onClick={() => reloadHandler()}
                      ></ArrowClockwise>
                    )}
                  </div>
                </div>

                {userData.permission?.customerAdd || role === "ispOwner" ? (
                  <div
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#collectorModal"
                  >
                    <PersonPlusFill />
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* modals */}
              <CollectorPost />
              <CollectorDetails single={singleCollector} />
              <CollectorEdit single={singleCollector} />

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  {/* table */}
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={collector}
                    ></Table>
                  </div>
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
