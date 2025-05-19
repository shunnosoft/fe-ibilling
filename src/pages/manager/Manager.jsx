import React, { useMemo, useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PenFill,
  PersonFill,
  KeyFill,
  ChatText,
  PlayBtn,
  ClockHistory,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// custom hooks imports
import useISPowner from "../../hooks/useISPOwner";
import useAreaPackage from "../../hooks/useAreaPackage";

// internal imports
import "./manager.css";
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";
import ReadModals from "../../components/modals/ReadModals";
import WriteModals from "../../components/modals/WriteModals";
import Footer from "../../components/admin/footer/Footer";
import { getArea, getManger } from "../../features/apiCalls";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import ManagerPost from "./ManagerCRUD/ManagerPost";
import Table from "../../components/table/Table";
import ManagerDetails from "./ManagerCRUD/ManagerDetails";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import ManagerEdit from "./ManagerCRUD/ManagerEdit";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import PlayTutorial from "../tutorial/PlayTutorial";
import { useNavigate } from "react-router-dom";
import { badge } from "../../components/common/Utils";

const Manager = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  // get all area package data from useAreaPackage hooks
  const { areas, subAreas } = useAreaPackage();

  //get all managers data form redux store
  const manager = useSelector((state) => state.manager?.manager);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // modal state
  const [userId, setUserId] = useState();
  const [singleManager, setSingleManager] = useState();

  // modal open handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // api call
  useEffect(() => {
    // get all managers api
    manager.length === 0 && getManger(dispatch, ispOwnerId);

    // get all area api
    areas.length === 0 && getArea(dispatch, ispOwnerId, setIsLoading);

    // get all area subareas api
    subAreas.length === 0 && getSubAreasApi(dispatch, ispOwnerId);
  }, []);

  //get specific manager set id
  const getSpecificManager = (managerId) => {
    setSingleManager(managerId);
  };

  //---> Single manager activity log handle
  const handleManagerActivityLog = (data) => {
    navigate(`/activity/${data?.id}`, { state: { ...data, role: "manager" } });
  };

  const columns = useMemo(
    () => [
      {
        width: "5%",
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
        Header: t("mobile"),
        accessor: "mobile",
      },
      {
        width: "23%",
        Header: t("email"),
        accessor: "email",
      },
      {
        width: "19%",
        Header: t("address"),
        accessor: "address",
      },
      {
        width: "10%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => badge(value),
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
                  data-bs-target="#showManagerDetails"
                  onClick={() => {
                    getSpecificManager(original.id);
                  }}
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PersonFill />
                      <p className="actionP">{t("profile")}</p>
                    </div>
                  </div>
                </li>

                <li
                  onClick={() => {
                    getSpecificManager(original.id);
                    setModalStatus("managerEdit");
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

                {original.mobile && (
                  <li
                    onClick={() => {
                      getSpecificManager(original.id);
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

                <li onClick={() => handleManagerActivityLog(original)}>
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ClockHistory />
                      <p className="actionP">{t("activityLog")}</p>
                    </div>
                  </div>
                </li>
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
                <div className="d-flex justify-content-between collectorTitle px-4">
                  <div>{t("manager")}</div>

                  <div className="d-flex align-items-center">
                    {bpSettings?.multipleManager ? (
                      <div
                        title={t("addNewManager")}
                        onClick={() => {
                          setModalStatus("managerPost");
                          setShow(true);
                        }}
                      >
                        <PersonPlusFill className="addcutmButton" />
                      </div>
                    ) : manager.length === 0 ? (
                      <div
                        title={t("addNewManager")}
                        onClick={() => {
                          setModalStatus("managerPost");
                          setShow(true);
                        }}
                      >
                        <PersonPlusFill className="addcutmButton" />
                      </div>
                    ) : (
                      ""
                    )}

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
                <div className="collectorWrapper mt-2 py-1">
                  <div className="table-section">
                    <Table
                      isLoading={isLoading}
                      columns={columns}
                      data={manager}
                    ></Table>
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* modal start */}
      <ReadModals managerDetails={manager} />
      <WriteModals manager={manager} />
      <ManagerDetails managerId={singleManager} />

      {/* manager add modal */}
      {modalStatus === "managerPost" && (
        <ManagerPost show={show} setShow={setShow} />
      )}

      {/* manager data update modal */}
      {modalStatus === "managerEdit" && (
        <ManagerEdit show={show} setShow={setShow} managerId={singleManager} />
      )}

      {/* singel message modal */}
      {modalStatus === "message" && (
        <SingleMessage
          show={show}
          setShow={setShow}
          single={singleManager}
          sendCustomer="manager"
        />
      )}

      {/* collector password reset */}
      {modalStatus === "password" && (
        <PasswordReset show={show} setShow={setShow} userId={userId} />
      )}

      {/* tutorial play modal */}
      {modalStatus === "playTutorial" && (
        <PlayTutorial
          {...{
            show,
            setShow,
            video: "staff",
          }}
        />
      )}

      {/* modal End */}
    </>
  );
};

export default Manager;
