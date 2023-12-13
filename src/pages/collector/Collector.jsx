import React, { useEffect, useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PersonFill,
  PenFill,
  ChatText,
  ArrowClockwise,
  KeyFill,
  ArchiveFill,
  PeopleFill,
  CashStack,
  CurrencyDollar,
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

import CollectorDetails from "./collectorCRUD/CollectorDetails";
import CollectorEdit from "./collectorCRUD/CollectorEdit";
import {
  deleteCollector,
  getArea,
  getCollector,
} from "../../features/apiCalls";
import Table from "../../components/table/Table";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import { Link } from "react-router-dom";
import PrevBalanceReport from "./collectorCRUD/PrevBalanceReport";

export default function Collector() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const [collSearch, setCollSearch] = useState("");
  const collector = useSelector((state) => state?.collector?.collector);

  let serial = 0;
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [collectorPerPage, setCollectorPerPage] = useState(5);
  const lastIndex = currentPage * collectorPerPage;
  const firstIndex = lastIndex - collectorPerPage;
  const currentCollector = collector.slice(firstIndex, lastIndex);
  const [allCollector, setCollector] = useState(currentCollector);
  const [userId, setUserId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permissions
  );
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // modal open handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // reload handler
  const reloadHandler = () => {
    getCollector(dispatch, ispOwnerId, setIsLoading);
  };

  useEffect(() => {
    if (collector.length === 0)
      getCollector(dispatch, ispOwnerId, setIsLoading);
    getArea(dispatch, ispOwnerId, setIsLoading);
    getSubAreasApi(dispatch, ispOwnerId);
  }, []);

  const [singleCollector, setSingleCollector] = useState();
  const getSpecificCollector = (collectorId) => {
    setSingleCollector(collectorId);
  };

  const [collectorId, setCollectorId] = useState();
  const handleSingleMessage = (collectorID) => {
    setCollectorId(collectorID);
  };

  const deleteSingleCollector = (collectorId) => {
    const confirm = window.confirm(t("colelctorDeleteNotify"));
    if (confirm) {
      deleteCollector(dispatch, setIsLoading, ispOwnerId, collectorId);
    }
  };

  useEffect(() => {
    const keys = ["name", "mobile", "email"];
    if (collSearch !== "") {
      setCollector(
        collector.filter((item) =>
          keys.some((key) =>
            typeof item[key] === "string"
              ? item[key].toString().toLowerCase().includes(collSearch)
              : item[key].toString().includes(collSearch)
          )
        )
      );
    } else {
      setCollector(collector);
    }
  }, [collSearch, collector]);

  const columns = React.useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "19%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "19%",
        Header: t("address"),
        accessor: "address",
      },
      {
        width: "19%",
        Header: t("mobile"),
        accessor: "mobile",
      },
      {
        width: "23%",
        Header: t("email"),
        accessor: "email",
      },

      {
        width: "12%",
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
            <div className="dropdown">
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

                {(permission?.collectorEdit || role === "ispOwner") && (
                  <li
                    onClick={() => {
                      getSpecificCollector(original.id);
                      setModalStatus("collectorEdit");
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
                )}

                {role !== "collector" && (
                  <Link to={`/collector/billReport/${original.id}`}>
                    <li>
                      <div className="dropdown-item">
                        <div className="customerAction">
                          <CashStack />

                          <p className="actionP">{t("billReport")}</p>
                        </div>
                      </div>
                    </li>
                  </Link>
                )}
                {role === "ispOwner" && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#collectorPrevMonthBalance"
                    onClick={() => {
                      getSpecificCollector(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <CurrencyDollar />
                        <p className="actionP">{t("previousBalance")}</p>
                      </div>
                    </div>
                  </li>
                )}
                {original.mobile && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#customerMessageModal"
                    onClick={() => {
                      handleSingleMessage(original.id);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <ChatText />
                        <p className="actionP">{t("message")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {role === "ispOwner" && (
                  <li
                    onClick={() => {
                      deleteSingleCollector(original.id);
                    }}
                  >
                    <div className="dropdown-item actionManager">
                      <div className="customerAction">
                        <ArchiveFill />
                        <p className="actionP">{t("delete")}</p>
                      </div>
                    </div>
                  </li>
                )}

                {role === "ispOwner" && (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#resetPassword"
                    onClick={() => {
                      setUserId(original.user);
                      setModalStatus("password");
                      setShow(true);
                    }}
                  >
                    <div className="dropdown-item">
                      <div className="customerAction">
                        <KeyFill />
                        <p className="actionP">{t("passwordReset")}</p>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
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
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="d-flex">
                    <h2>{t("collector")}</h2>
                  </div>

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
                    {(permission?.collectorAdd || role === "ispOwner") && (
                      <div
                        title={t("collector")}
                        onClick={() => {
                          setModalStatus("collectorPost");
                          setShow(true);
                        }}
                      >
                        <PersonPlusFill className="addcutmButton" />
                      </div>
                    )}
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div className="table-section">
                      <Table
                        isLoading={isLoading}
                        columns={columns}
                        data={collector}
                      ></Table>
                    </div>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
        {/* modals */}

        {/* collector post modal */}
        {modalStatus === "collectorPost" && (
          <CollectorPost show={show} setShow={setShow} />
        )}

        {/* collector data edit modal */}
        {modalStatus === "collectorEdit" && (
          <CollectorEdit
            show={show}
            setShow={setShow}
            collectorId={singleCollector}
          />
        )}

        <CollectorDetails collectorId={singleCollector} />

        <PrevBalanceReport collectorId={singleCollector} />
        <SingleMessage single={collectorId} sendCustomer="collector" />

        {/* collector password reset */}
        {modalStatus === "password" && (
          <PasswordReset show={show} setShow={setShow} userId={userId} />
        )}
      </div>
    </>
  );
}
