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
  CashStack,
  CurrencyDollar,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// custom hooks import
import useISPowner from "../../hooks/useISPOwner";

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
import Loader from "../../components/common/Loader";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import PrevBalanceReport from "./collectorCRUD/PrevBalanceReport";

const Collector = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId, permissions } = useISPowner();

  // get all collector data from redux store
  const collector = useSelector((state) => state?.collector?.collector);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // state for modal
  const [userId, setUserId] = useState();

  // state for single message
  const [collectorId, setCollectorId] = useState();

  // state for password reset
  const [singleCollector, setSingleCollector] = useState();

  // modal open handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // api call
  useEffect(() => {
    if (collector.length === 0)
      getCollector(dispatch, ispOwnerId, setIsLoading);
    getArea(dispatch, ispOwnerId, setIsLoading);
    getSubAreasApi(dispatch, ispOwnerId);
  }, []);

  // reload handler
  const reloadHandler = () => {
    getCollector(dispatch, ispOwnerId, setIsLoading);
  };

  // collector single edit
  const getSpecificCollector = (collectorId) => {
    setSingleCollector(collectorId);
  };

  // collector single message
  const handleSingleMessage = (collectorID) => {
    setCollectorId(collectorID);
  };

  // collector delete handler
  const deleteSingleCollector = (collectorId) => {
    const confirm = window.confirm(t("colelctorDeleteNotify"));
    if (confirm) {
      deleteCollector(dispatch, setIsLoading, ispOwnerId, collectorId);
    }
  };

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
          <div className="d-flex justify-content-center align-items-center">
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

                {(permissions?.collectorEdit || role === "ispOwner") && (
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
                    onClick={() => {
                      getSpecificCollector(original.id);
                      setModalStatus("previousBalance");
                      setShow(true);
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
                    onClick={() => {
                      handleSingleMessage(original.id);
                      setModalStatus("message");
                      setShow(true);
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
                    {(permissions?.collectorAdd || role === "ispOwner") && (
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
        {/* modals */}
        <CollectorDetails collectorId={singleCollector} />

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

        {/* collector previous balance modal */}
        {modalStatus === "previousBalance" && (
          <PrevBalanceReport
            show={show}
            setShow={setShow}
            collectorId={singleCollector}
          />
        )}

        {/* single message modal */}
        {modalStatus === "message" && (
          <SingleMessage
            show={show}
            setShow={setShow}
            single={collectorId}
            sendCustomer="collector"
          />
        )}

        {/* collector password reset */}
        {modalStatus === "password" && (
          <PasswordReset show={show} setShow={setShow} userId={userId} />
        )}
      </div>
    </>
  );
};

export default Collector;
