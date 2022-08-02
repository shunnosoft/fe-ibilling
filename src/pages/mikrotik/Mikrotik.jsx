import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import "./mikrotik.css";
import { Plus, ArrowRightShort, ArrowClockwise } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// internal imports
import { ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import MikrotikPost from "./mikrotikModals/MikrotikPost";
import { fetchMikrotik } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";

export default function Mikrotik() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);

  let allmikrotiks = [];
  allmikrotiks = useSelector(
    (state) => state.persistedReducer.mikrotik.mikrotik
  );

  const [isLoading, setIsLoading] = useState(false);

  // reload handler
  const reloadHandler = () => {
    const { ispOwner } = auth;
    fetchMikrotik(dispatch, ispOwner.id, setIsLoading);
  };

  useEffect(() => {
    const { ispOwner } = auth;
    if (allmikrotiks.length === 0)
      fetchMikrotik(dispatch, ispOwner.id, setIsLoading);
  }, [auth, dispatch]);

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
        width: "22%",
        Header: t("host"),
        accessor: "host",
      },
      {
        width: "20%",
        Header: t("port"),
        accessor: "port",
      },
      {
        width: "21%",
        Header: <div className="text-center">{t("action")}</div>,
        id: "option1",

        Cell: ({ row: { original } }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link
              to={`/mikrotik/${original.ispOwner}/${original.id}`}
              className="mikrotikConfigureButtom"
            >
              {t("configure")} <ArrowRightShort style={{ fontSize: "19px" }} />
            </Link>
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
              {/* modals */}
              <MikrotikPost />
              {/* modals */}
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div> {t("mikrotik")} </div>
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
                  <div
                    title={t("addMikrotik")}
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#MikrotikModal"
                  >
                    <Plus />
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  {/* table */}
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={allmikrotiks}
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
