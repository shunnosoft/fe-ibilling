import React, { useEffect, useState } from "react";
import {
  ArchiveFill,
  PenFill,
  PencilFill,
  PersonLinesFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";

// internal import
import FireWallFIlterDrop from "./FireWallFIlterDrop";
import {
  getFireWallIpDrop,
  removeFireWallAllIpDrop,
  resetFireWallAllIpDrop,
  syncFireWallFilterDrop,
  testFireWallApi,
} from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";
import Table from "../../../components/table/Table";
import { badge } from "../../../components/common/Utils";
import FireWallFilterIpUpdate from "./FireWallFilterIpUpdate";
import FireWallFilterIpDelete from "./FireWallFilterIpDelete";

const FireWallFilter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get params
  const { ispOwner, mikrotikId } = useParams();

  //get all mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // get fire wall ip filter drop
  const fireWallIpFilterDrop = useSelector(
    (state) => state.customer?.fireWallFilterDrop
  );

  //single mikrotik
  const configMikrotik = mikrotik.find((mtk) => mtk.id === mikrotikId);

  //loading state
  const [isLoading, setIsLoading] = useState(false);
  const [ipLoading, setIpLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  // filter wall filter ip update
  const [updateIp, setUpdateIp] = useState();

  // fire wall filter ip delete state
  const [deleteIp, setDeleteIp] = useState();

  // check mikrotik checkbox
  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  // api call change handler
  const [apiCall, setApiCall] = useState("");

  // modal close handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  //sync simple queue to fire wall filter handler
  const syncSimpleQueueToFirewallFilterRuleHandler = () => {
    const data = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
    };

    testFireWallApi(setIsLoading, data);
  };

  // sync Fire Wall Filter Drop Handler
  const syncFireWallFilterDropHandler = () => {
    const data = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
    };

    syncFireWallFilterDrop(dispatch, setSyncLoading, data);
  };

  // fire wall filter ip drop update handler
  const fireWallFilterIpUpdateHandler = (ip) => {
    setUpdateIp(ip);
  };

  // fire wall filter ip delete handler
  const fireWallFilterIpDeleteHandler = (ip) => {
    setDeleteIp(ip);

    setMikrotikCheck(false);
  };

  const apiCallChangeHandler = (value) => {
    if (value === true) {
      setApiCall("removeRequest");
    }
    if (value === false) {
      setApiCall("resetRequest");
    }
  };

  // fire wall ip drop column
  const fireWallIpDrop = React.useMemo(
    () => [
      {
        width: "15%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "15%",
        Header: t("filterAction"),
        accessor: "action",
      },

      {
        width: "15%",
        Header: t("srcAddress"),
        accessor: "srcAddress",
      },

      {
        width: "15%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "15%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
      {
        width: "15%",
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
                  d
                  onClick={() => {
                    fireWallFilterIpUpdateHandler(original);
                    setModalStatus("dropIPEdit");
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

                <li
                  onClick={() => {
                    fireWallFilterIpDeleteHandler(original);
                    setModalStatus("dropIPDelete");
                    setShow(true);
                  }}
                >
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

  // fire wall filter all ip drop delete and reset api call handler
  useEffect(() => {
    if (apiCall === "removeRequest" && fireWallIpFilterDrop.length) {
      removeFireWallAllIpDrop(dispatch, setIpLoading, ispOwner, mikrotikId);
    }

    if (apiCall === "resetRequest") {
      resetFireWallAllIpDrop(dispatch, setIpLoading, ispOwner, mikrotikId);
    }
  }, [apiCall]);

  useEffect(() => {
    getFireWallIpDrop(dispatch, setIpLoading, ispOwner);
  }, []);

  return (
    <>
      <div className="collectorWrapper py-2">
        <div className="addCollector">
          <div className=" d-flex justify-content-around">
            <div className="mikrotikDetails d-flex flex-column justify-content-evenly">
              <p className="lh-sm">
                {t("name")}: <b>{configMikrotik?.name || "..."}</b>
              </p>
              <p className="lh-sm">
                {t("ip")}: <b>{configMikrotik?.host || "..."}</b>
              </p>
              <p className="lh-sm">
                {t("userName")}: <b>{configMikrotik?.username || "..."}</b>
              </p>
              <p className="lh-sm">
                {t("port")}: <b>{configMikrotik?.port || "..."}</b>
              </p>
            </div>

            <div className="addAndSettingIcon d-flex flex-column align-items-start">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="fireWallIpDropApiCall"
                  checked={
                    fireWallIpFilterDrop[0]?.status === "delete" &&
                    fireWallIpFilterDrop[0]?.status !== "drop"
                  }
                  onChange={(e) => apiCallChangeHandler(e.target.checked)}
                ></input>
                <label
                  className="form-check-label text-secondary"
                  for="fireWallIpDropApiCall"
                >
                  {fireWallIpFilterDrop[0]?.status === "delete"
                    ? t("bringBackFireWallIpDrop")
                    : t("deleteFireWallIpDrop")}
                </label>
              </div>

              <div className="">
                <button
                  title="Block Ip"
                  className="btn btn-outline-primary my-2"
                  onClick={() => {
                    setModalStatus("IPDrop");
                    setShow(true);
                  }}
                >
                  {t("fireWallIpFilterDrop")} &nbsp;
                  <PencilFill />
                </button>
              </div>
              <div>
                <button
                  className="btn btn-outline-primary me-2"
                  onClick={syncSimpleQueueToFirewallFilterRuleHandler}
                >
                  {isLoading ? <Loader /> : t("syncFireWallFilter")} &nbsp;
                  <PersonLinesFill />
                </button>
              </div>
              {/* <div>
                <button
                  className="btn btn-outline-primary me-2 mt-2"
                  onClick={syncFireWallFilterDropHandler}
                >
                  {syncLoading ? <Loader /> : t("syncFireWallFilterDrop")}{" "}
                  &nbsp;
                  <PersonCheckFill />
                </button>
              </div> */}
            </div>
          </div>
          <div className="table-section">
            <Table
              isLoading={ipLoading}
              columns={fireWallIpDrop}
              data={fireWallIpFilterDrop}
            ></Table>
          </div>
        </div>
      </div>

      {/* fire wall filter ip drop */}
      {modalStatus === "IPDrop" && (
        <FireWallFIlterDrop
          show={show}
          setShow={setShow}
          ispOwner={ispOwner}
          mikrotikId={mikrotikId}
        />
      )}

      {/* fire wall filter ip update */}
      {modalStatus === "dropIPEdit" && (
        <FireWallFilterIpUpdate
          show={show}
          setShow={setShow}
          updateIp={updateIp}
        />
      )}

      {/* fire wall filter ip delete */}
      {modalStatus === "dropIPDelete" && (
        <FireWallFilterIpDelete
          show={show}
          setShow={setShow}
          deleteIp={deleteIp}
          mikrotikCheck={mikrotikCheck}
          setMikrotikCheck={setMikrotikCheck}
        />
      )}
    </>
  );
};

export default FireWallFilter;
