import React, { useEffect, useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PersonFill,
  PenFill,
  ArrowClockwise,
  KeyFill,
  ChatText,
  ClockHistory,
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
import { getCollector, getSubAreas } from "../../features/apiCallReseller";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import { useNavigate } from "react-router-dom";

const Collector = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const collector = useSelector((state) => state.collector.collector);

  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // pagination
  const [collSearch, setCollSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [collectorPerPage, setCollectorPerPage] = useState(5);
  const [userId, setUserId] = useState();
  const [isLoading, setIsloading] = useState(false);
  const lastIndex = currentPage * collectorPerPage;
  const firstIndex = lastIndex - collectorPerPage;
  const currentCollector = collector.slice(firstIndex, lastIndex);
  const [allCollector, setCollector] = useState(currentCollector);
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permission
  );
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // modal open handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // single collector id state
  const [collectorId, setCollectorId] = useState("");

  // reload handler
  const reloadHandler = () => {
    getCollector(dispatch, userData.id, setIsloading);
  };

  useEffect(() => {
    if (collector.length === 0) {
      getCollector(dispatch, userData.id, setIsloading);
    }
    getSubAreas(dispatch, userData.id);
  }, [userData, dispatch]);

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

  //---> Single collector activity log handle
  const handleCollectorActivityLog = (data) => {
    navigate(`/activity/${data?.id}`, {
      state: { ...data, role: "collector" },
    });
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
          <div className="d-flex justify-content-center align-items-center">
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
                  setCollectorId(original.id);
                }}
              >
                <div className="dropdown-item">
                  <div className="customerAction">
                    <PersonFill />
                    <p className="actionP">{t("profile")}</p>
                  </div>
                </div>
              </li>
              {(permission?.collectorEdit || role === "reseller") && (
                <li
                  onClick={() => {
                    setCollectorId(original.id);
                    setModalStatus("edit");
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

              {role === "reseller" && (
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

              {original.mobile && (
                <li
                  onClick={() => {
                    setCollectorId(original.id);
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

              <li onClick={() => handleCollectorActivityLog(original)}>
                <div className="dropdown-item">
                  <div className="customerAction">
                    <ClockHistory />
                    <p className="actionP">{t("activityLog")}</p>
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
                <div>{t("collector")}</div>

                <div className="d-flex justify-content-center align-items-center">
                  <div className="reloadBtn">
                    {isLoading ? (
                      <Loader />
                    ) : (
                      <ArrowClockwise
                        className="arrowClock"
                        title={t("refresh")}
                        onClick={() => reloadHandler()}
                      />
                    )}
                  </div>

                  {(userData.permission?.customerAdd ||
                    role === "ispOwner") && (
                    <div
                      title={t("collector")}
                      onClick={() => {
                        setModalStatus("post");
                        setShow(true);
                      }}
                    >
                      <PersonPlusFill className="addcutmButton" />
                    </div>
                  )}
                </div>
              </div>

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
      </div>

      {/* component modals  */}

      {/* collector details modal */}
      <CollectorDetails single={collectorId} />

      {/* collector post modal */}
      {modalStatus === "post" && (
        <CollectorPost show={show} setShow={setShow} />
      )}

      {/* collector edit modal */}
      {modalStatus === "edit" && (
        <CollectorEdit
          show={show}
          setShow={setShow}
          collectorId={collectorId}
        />
      )}

      {/* collector password reset */}
      {modalStatus === "password" && (
        <PasswordReset show={show} setShow={setShow} userId={userId} />
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
    </>
  );
};

export default Collector;
