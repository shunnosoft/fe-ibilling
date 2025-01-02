import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import useDash from "../../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../../assets/js/theme";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/common/Loader";
import {
  ArchiveFill,
  ArrowClockwise,
  PenFill,
  PlayBtn,
  Plus,
  ThreeDots,
} from "react-bootstrap-icons";
import DeviceForm from "./DeviceForm";
import {
  deleteNetworkDevice,
  getNetworkDevice,
} from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import useISPowner from "../../../hooks/useISPOwner";
import Table from "../../../components/table/Table";
import moment from "moment";
import Footer from "../../../components/admin/footer/Footer";
import PlayTutorial from "../../tutorial/PlayTutorial";

const Device = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Devices
  const device = {
    mikrotik: "Mikrotik",
    olt: "OLT",
    switch: "Switch",
    splitter: "Splitter",
    onu: "ONU",
  };

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId } = useISPowner();

  // get network devices form redux store
  const devices = useSelector((state) => state.network?.devices);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Modal handle state
  const [show, setShow] = useState(false);
  const [modalStatus, setModalStatus] = useState("");

  // Modal form handle state
  const [isUpdate, setIsUpdate] = useState(false);

  // Single Device data state
  const [deviceData, setDeviceData] = useState({});

  useEffect(() => {
    getNetworkDevice(dispatch, ispOwnerId, setIsLoading);
  }, []);

  const deviceReloadHandler = () => {
    getNetworkDevice(dispatch, ispOwnerId, setIsLoading);
  };

  // Network device delete function handler
  const handleNetworkDeviceDelete = (deviceId) => {
    deleteNetworkDevice(dispatch, deviceId);
  };

  const columns = useMemo(
    () => [
      {
        width: "5%",
        Header: t("serial"),
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "10%",
        Header: t("deviceType"),
        accessor: "candidateType",
        Cell: ({ cell: { value } }) => (
          <div>
            <p>{device[value]}</p>
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("device"),
        accessor: "name",
      },
      {
        width: "10%",
        Header: t("ip"),
        accessor: "ip",
      },
      {
        width: "10%",
        Header: t("brand"),
        accessor: "brand",
      },
      {
        width: "10%",
        Header: t("model"),
        accessor: "deviceModel",
      },
      {
        width: "10%",
        Header: t("date"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm a");
        },
      },
      {
        width: "10%",
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
                onClick={() => {
                  setModalStatus("addDevice");
                  setIsUpdate(true);
                  setDeviceData(original);
                  setShow(true);
                }}
              >
                <div className="dropdown-item actionManager">
                  <div className="customerAction">
                    <PenFill />
                    <p className="actionP">{t("edit")}</p>
                  </div>
                </div>
              </li>

              <li onClick={() => handleNetworkDeviceDelete(original.id)}>
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
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div className="component_name">{t("device")}</div>

                  <div className="d-flex justify-content-center align-items-center">
                    <div className="reloadBtn">
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <ArrowClockwise
                          className="arrowClock"
                          title={t("refresh")}
                          onClick={deviceReloadHandler}
                        />
                      )}
                    </div>

                    <div
                      onClick={() => {
                        setModalStatus("addDevice");
                        setIsUpdate(false);
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
                <div className="collectorWrapper mt-2 py-2">
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={devices}
                  ></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* Mikrotik Router create modal */}
      {modalStatus === "addDevice" && (
        <DeviceForm
          {...{
            show,
            setShow,
            isUpdate,
            title: isUpdate
              ? `${t("update")} ${t("mikrotik")}`
              : `${t("create")} ${t("mikrotik")}`,
            device: isUpdate ? deviceData : "",
          }}
        />
      )}

      {/* tutorial play modal */}
      {modalStatus === "playTutorial" && (
        <PlayTutorial
          {...{
            show,
            setShow,
            video: "diagram",
          }}
        />
      )}
    </>
  );
};

export default Device;
