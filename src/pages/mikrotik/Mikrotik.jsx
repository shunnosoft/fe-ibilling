import React, { useEffect, useState } from "react";
import {
  Plus,
  ArrowRightShort,
  ArrowClockwise,
  ArchiveFill,
  PlugFill,
  PersonDash,
  PlayBtn,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

// internal imports
import "../collector/collector.css";
import "./mikrotik.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import MikrotikPost from "./mikrotikModals/MikrotikPost";
import { fetchMikrotik } from "../../features/apiCalls";
import Table from "../../components/table/Table";
import Loader from "../../components/common/Loader";
import MikrotikDelete from "./mikrotikModals/MikrotikDelete";
import apiLink from "../../api/apiLink";
import useISPowner from "../../hooks/useISPOwner";
import PlayTutorial from "../tutorial/PlayTutorial";

const Mikrotik = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  // get all mikrotiks from redux store
  const allmikrotiks = useSelector((state) => state.mikrotik.mikrotik);

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // mikrotik id state
  const [mikrotikId, setMikrotikId] = useState();

  // modal close handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // fetch mikrotik
  useEffect(() => {
    if (allmikrotiks.length === 0)
      fetchMikrotik(dispatch, ispOwnerId, setIsLoading);
  }, [ispOwnerId]);

  // reload handler
  const reloadHandler = () => {
    fetchMikrotik(dispatch, ispOwnerId, setIsLoading);
  };

  // mikrottik Connection Check
  const MikrotikConnectionTest = async (connectionCheckId, mikrotikName) => {
    setIsChecking(true);

    await apiLink({
      method: "GET",
      url: `/mikrotik/testConnection/${ispOwnerId}/${connectionCheckId}`,
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

  const columns = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "15%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "15%",
        Header: t("userName"),
        accessor: "username",
      },
      {
        width: "15%",
        Header: t("host"),
        accessor: "host",
      },
      {
        width: "15%",
        Header: t("port"),
        accessor: "port",
      },
      {
        width: "30%",
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

            {/* {bpSettings.customerType.includes("pppoe") && ( */}
            <Link
              to={`/mikrotik/customer/${original.ispOwner}/${original.id}`}
              className="mikrotikConfigureButtom ms-1 bg-secondary"
            >
              <PersonDash />
            </Link>
            {/* )} */}

            <button
              title={t("checkConnection")}
              style={{ padding: "0.10rem .5rem" }}
              className="btn btn-sm btn-primary mx-1"
              onClick={() => MikrotikConnectionTest(original.id, original.name)}
            >
              <PlugFill />
            </button>

            {bpSettings?.mikrotikDelete && (
              <button
                title={t("deletekrotik")}
                onClick={() => {
                  setMikrotikId(original.id);
                  setModalStatus("deletekrotik");
                  setShow(true);
                }}
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
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <h2> {t("mikrotik")} </h2>

                  <div className="d-flex justify-content-center align-items-center">
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

                    <div
                      title={t("addMikrotik")}
                      onClick={() => {
                        setModalStatus("addMikrotik");
                        setShow(true);
                      }}
                    >
                      <Plus className="addcutmButton" />
                    </div>

                    <div className="addAndSettingIcon">
                      <PlayBtn
                        className="addcutmButton"
                        onClick={() => {
                          setModalStatus("playTutorial");
                          setShow(true);
                        }}
                        title={t("tutorial")}
                      />
                    </div>
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

      {/* mikrotik modal for delete */}
      {modalStatus === "addMikrotik" && (
        <MikrotikPost show={show} setShow={setShow} />
      )}

      {/* mikrotik modal for delete */}
      {modalStatus === "deletekrotik" && (
        <MikrotikDelete show={show} setShow={setShow} mikrotikID={mikrotikId} />
      )}

      {/* tutorial play modal */}
      {modalStatus === "playTutorial" && (
        <PlayTutorial
          {...{
            show,
            setShow,
            video: "mikrotik",
          }}
        />
      )}
    </>
  );
};

export default Mikrotik;
