import React, { useEffect, useState } from "react";
import "../collector/collector.css";
import "./mikrotik.css";
import {
  Plus,
  ArrowRightShort,
  ArrowClockwise,
  ArchiveFill,
  PlugFill,
  PersonDash,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// internal imports
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import MikrotikPost from "./mikrotikModals/MikrotikPost";
import { fetchMikrotik } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import MikrotikDelete from "./mikrotikModals/MikrotikDelete";
import apiLink from "../../api/apiLink";

export default function Mikrotik() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.bpSettings
  );
  console.log({ permission });

  let allmikrotiks = [];
  allmikrotiks = useSelector((state) => state.mikrotik.mikrotik);

  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const [mikrotikId, setMikrotikId] = useState();

  // reload handler
  const reloadHandler = () => {
    const { ispOwner } = auth;
    fetchMikrotik(dispatch, ispOwner.id, setIsLoading);
  };

  // mikrottik Connection Check
  const MikrotikConnectionTest = async (connectionCheckId, mikrotikName) => {
    setIsChecking(true);

    await apiLink({
      method: "GET",
      url: `/mikrotik/testConnection/${auth.ispOwner.id}/${connectionCheckId}`,
    })
      .then(() => {
        setIsChecking(false);
        toast.success(`${mikrotikName} এর কানেকশন ঠিক আছে`);
      })
      .catch(() => {
        setIsChecking(false);

        toast.error(`দুঃখিত, ${mikrotikName} এর কানেকশন ঠিক নেই!`);
      });
  };

  useEffect(() => {
    const { ispOwner } = auth;
    if (allmikrotiks.length === 0)
      fetchMikrotik(dispatch, ispOwner.id, setIsLoading);
  }, [auth, dispatch]);

  const columns = React.useMemo(
    () => [
      {
        width: "18%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "20%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "20%",
        Header: t("host"),
        accessor: "host",
      },
      {
        width: "15%",
        Header: t("port"),
        accessor: "port",
      },
      {
        width: "37%",
        Header: <div className="text-center">{t("action")}</div>,
        id: "option1",

        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            <Link
              to={`/mikrotik/${original.ispOwner}/${original.id}`}
              className="mikrotikConfigureButtom"
            >
              {t("configure")} <ArrowRightShort style={{ fontSize: "19px" }} />
            </Link>
            {permission.customerType.includes("pppoe") && (
              <Link
                to={`/mikrotik/customer/${original.ispOwner}/${original.id}`}
                className="mikrotikConfigureButtom ms-1"
              >
                <PersonDash />
              </Link>
            )}

            <button
              title={t("checkConnection")}
              style={{ padding: "0.10rem .5rem" }}
              className="btn btn-sm btn-primary mx-1"
              onClick={() => MikrotikConnectionTest(original.id, original.name)}
            >
              <PlugFill />
            </button>

            {permission?.mikrotikDelete && (
              <button
                title={t("deletekrotik")}
                data-bs-toggle="modal"
                data-bs-target="#deleteMikrotikModal"
                onClick={() => setMikrotikId(original.id)}
                style={{ padding: "0.10rem .5rem" }}
                className="btn btn-sm btn-danger"
              >
                <ArchiveFill />
              </button>
            )}
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
        <div className="container-fluied collector ">
          <div className="container">
            <FontColor>
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
                <div className="collectorWrapper py-2 mt-2">
                  {isChecking && (
                    <span className="text-danger">
                      <Loader /> Loading ...
                    </span>
                  )}
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
      {/* modals */}
      <MikrotikPost />

      <MikrotikDelete mikrotikID={mikrotikId} />
    </>
  );
}
