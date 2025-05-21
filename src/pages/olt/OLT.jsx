import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Loader from "../../components/common/Loader";
import {
  ArchiveFill,
  ArrowClockwise,
  PenFill,
  PlugFill,
  Plus,
  ThreeDots,
} from "react-bootstrap-icons";
import Table from "../../components/table/Table";
import { useTranslation } from "react-i18next";
import Footer from "../../components/admin/footer/Footer";
import OLTDialog from "./OLTDialog";
import { deleteOLT, getOLT } from "../../features/oltApi";
import useISPowner from "../../hooks/useISPOwner";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { fetchMikrotik, getOLTConnection } from "../../features/apiCalls";
import useSelectorState from "../../hooks/useSelectorState";

const OLT = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //---> Get user & current user data form useISPOwner hooks
  const { ispOwnerId, bpSettings } = useISPowner();

  //---> Get redux store state data from useSelectorState hooks
  const { mikrotiks } = useSelectorState();

  const olt = useSelector((state) => state?.olt.olt);

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOLTLoading, setIsOLTLoading] = useState(false);

  const [oltInformation, setOLTInformation] = useState({});
  const [modalStatus, setModalStatus] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getOLT(ispOwnerId, setIsLoading, dispatch);

    //---> @Get ispOwner mikrotiks data
    !mikrotiks?.length && fetchMikrotik(dispatch, ispOwnerId, setLoading);
  }, [ispOwnerId]);

  const reloadHandler = () => {
    getOLT(ispOwnerId, setIsLoading, dispatch);
  };

  const handleOLTCreate = () => {
    if (!bpSettings?.hasOLT) {
      toast.error("Please contact netFee support.");
    } else {
      setModalStatus("oltCreateAndUpdate");
      setIsUpdate(false);
      setShow(true);
    }
  };

  const handleOLTConnectionCheck = (olt, name) => {
    getOLTConnection(ispOwnerId, olt, name, setIsOLTLoading);
  };

  const handleOLTDelete = (data) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this OLT?"
    );

    if (confirmDelete && data?.ispOwner && data?.id) {
      deleteOLT(data.ispOwner, data.id, dispatch);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        width: "5%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "10%",
        Header: t("vendor"),
        accessor: "oltVendor",
      },
      {
        width: "20%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "8%",
        Header: t("pon"),
        accessor: "ponPort",
      },
      {
        width: "12%",
        Header: t("userName"),
        accessor: "username",
      },
      {
        width: "10%",
        Header: t("host"),
        accessor: "host",
      },
      {
        width: "8%",
        Header: t("port"),
        accessor: "port",
      },
      {
        width: "15%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
      {
        width: "7%",
        Header: () => <div className="text-center">{t("action")}</div>,
        id: "option",
        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center gap-2">
            <button
              title={t("checkConnection")}
              className="btn btn-sm btn-primary"
              onClick={() =>
                handleOLTConnectionCheck(original?.id, original?.name)
              }
            >
              {isOLTLoading ? <Loader /> : <PlugFill size={18} />}
            </button>
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
                  onClick={() => {
                    setOLTInformation(original);
                    setModalStatus("oltCreateAndUpdate");
                    setIsUpdate(true);
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

                <li onClick={() => handleOLTDelete(original)}>
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <ArchiveFill />
                      <p className="actionP">{t("delete")}</p>
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
        <div className="container-fluied collector ">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <h2> {t("olt")} </h2>

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

                    <div title={t("createOLT")} onClick={handleOLTCreate}>
                      <Plus className="addcutmButton" />
                    </div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper py-2 mt-2">
                  <Table
                    isLoading={isLoading}
                    columns={columns}
                    data={olt}
                  ></Table>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* OLT Create and Update Dialog */}
      {modalStatus === "oltCreateAndUpdate" && (
        <OLTDialog {...{ show, setShow, isUpdate, oltInformation }} />
      )}
    </>
  );
};

export default OLT;
