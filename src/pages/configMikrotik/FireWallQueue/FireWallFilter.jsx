import React, { useState } from "react";
import {
  ArchiveFill,
  PenFill,
  PencilFill,
  PersonCheckFill,
  PersonLinesFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FireWallFIlterDrop from "./FireWallFIlterDrop";
import {
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
  const { ispOwner, mikrotikId } = useParams();
  const dispatch = useDispatch();

  // get fire wall ip filter drop
  const fireWallIpFilterDrop = useSelector(
    (state) => state.customer?.fireWallFilterDrop
  );

  //loading state
  const [isLoading, setIsLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  // fire wall filter ip delete state
  const [deleteIp, setDeleteIp] = useState();

  // check mikrotik checkbox
  const [mikrotikCheck, setMikrotikCheck] = useState(false);

  //get all mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  //single mikrotik
  const configMikrotik = mikrotik.find((mtk) => mtk.id === mikrotikId);

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

  // fire wall filter ip delete handler
  const fireWallFilterIpDeleteHandler = (ip) => {
    setDeleteIp(ip);

    setMikrotikCheck(false);
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
                {/* <li
                  data-bs-toggle="modal"
                  data-bs-target="#fireWallIpFilterDropUpdate"
                >
                  <div className="dropdown-item">
                    <div className="customerAction">
                      <PenFill />
                      <p className="actionP">{t("edit")}</p>
                    </div>
                  </div>
                </li> */}

                <li
                  data-bs-toggle="modal"
                  data-bs-target="#fireWallFilterIpDropDelete"
                  onClick={() => fireWallFilterIpDeleteHandler(original)}
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

  return (
    <>
      <div className="collectorWrapper py-2">
        <div className="addCollector">
          <div className=" d-flex justify-content-around">
            <div className="mikrotikDetails">
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
              <div className="">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#fireWallIpFilter"
                  title="Block Ip"
                  className="btn btn-outline-primary my-2"
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
              <div>
                <button
                  className="btn btn-outline-primary me-2 mt-2"
                  onClick={syncFireWallFilterDropHandler}
                >
                  {syncLoading ? <Loader /> : t("syncFireWallFilterDrop")}{" "}
                  &nbsp;
                  <PersonCheckFill />
                </button>
              </div>
            </div>
          </div>
          <Table
            isLoading={syncLoading}
            columns={fireWallIpDrop}
            data={fireWallIpFilterDrop}
          ></Table>
        </div>
      </div>
      <FireWallFIlterDrop ispOwner={ispOwner} mikrotikId={mikrotikId} />
      <FireWallFilterIpUpdate />
      <FireWallFilterIpDelete
        deleteIp={deleteIp}
        mikrotikCheck={mikrotikCheck}
        setMikrotikCheck={setMikrotikCheck}
      />
    </>
  );
};

export default FireWallFilter;
