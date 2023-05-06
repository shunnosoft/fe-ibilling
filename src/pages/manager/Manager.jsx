import React, { useState } from "react";
import {
  PersonPlusFill,
  ThreeDots,
  PenFill,
  PersonFill,
  KeyFill,
  ChatText,
  ArchiveFill,
} from "react-bootstrap-icons";
import { ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { useSelector } from "react-redux";

// internal imports
import "./manager.css";
import "../collector/collector.css";
import useDash from "../../assets/css/dash.module.css";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FourGround, FontColor } from "../../assets/js/theme";

// import { getManager } from "../../features/authSlice";
import ReadModals from "../../components/modals/ReadModals";
import WriteModals from "../../components/modals/WriteModals";
import Footer from "../../components/admin/footer/Footer";
import { managerPermission } from "./managerData";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addManager,
  //deleteManager,
  editManager,
  getArea,
  getManger,
} from "../../features/apiCalls";
import { useTranslation } from "react-i18next";
import PasswordReset from "../../components/modals/passwordReset/PasswordReset";
import ManagerPost from "./ManagerCRUD/ManagerPost";
import Table from "../../components/table/Table";
import ManagerDetails from "./ManagerCRUD/ManagerDetails";
import SingleMessage from "../../components/singleCustomerSms/SingleMessage";
import ManagerEdit from "./ManagerCRUD/ManagerEdit";

export default function Manager() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [addStaffStatus, setAddStaffStatus] = useState(false);

  const [userId, setUserId] = useState();
  const [singleManager, setSingleManager] = useState();
  const [managerId, setManagerId] = useState();

  //get all managers
  const manager = useSelector((state) => state.manager?.manager);

  //get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.currentUser?.ispOwner?.id
  );

  // get bp settings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings
  );

  //get permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth?.userData?.permissions
  );

  // get role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  const getSpecificManager = (managerId) => {
    setSingleManager(managerId);
  };

  const handleSingleMessage = (managerId) => {
    setManagerId(managerId);
  };

  const deleteSingleManager = (managerId) => {
    const confirm = window.confirm(t("managerDeleteNotify"));
    if (confirm) {
      // deleteManager(dispatch, setIsLoading, ispOwnerId, managerId);
      return;
    }
  };

  useEffect(() => {
    getManger(dispatch, ispOwnerId);
  }, [ispOwnerId]);

  const [permissions, setPermissions] = useState(
    managerPermission(manager?.permissions)
  );

  useEffect(() => {
    getArea(dispatch, ispOwnerId, setIsLoading);
  }, []);

  useEffect(() => {
    if (manager)
      setPermissions(managerPermission(manager.permissions, bpSettings));
  }, [manager]);

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
                {permission?.collectorEdit || role === "ispOwner" ? (
                  <li
                    data-bs-toggle="modal"
                    data-bs-target="#managerEditModal"
                    onClick={() => {
                      getSpecificManager(original.id);
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
                      deleteSingleManager(original.id);
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
            {/* manager modal */}
            <ReadModals managerDetails={manager} />
            <FontColor>
              <FourGround>
                <div className="d-flex justify-content-between collectorTitle px-5">
                  <h2 className="">
                    ({t("manager")}) {t("profile")}
                  </h2>
                  <div
                    title={t("addNewManager")}
                    className="header_icon"
                    data-bs-toggle="modal"
                    data-bs-target="#managerAddModal"
                  >
                    <PersonPlusFill />
                  </div>
                </div>
              </FourGround>
              {/* modal start */}
              <WriteModals manager={manager} />
              <ManagerPost />
              <ManagerDetails managerId={singleManager} />
              <SingleMessage single={singleManager} sendCustomer="manager" />
              <PasswordReset resetCustomerId={userId} />
              <ManagerEdit managerId={singleManager} />
              {/* modal End */}
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="addCollector">
                    <div className="table-section">
                      <Table
                        isLoading={isLoading}
                        columns={columns}
                        data={manager}
                      ></Table>
                    </div>
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
