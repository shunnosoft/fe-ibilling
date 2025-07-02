import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  ArchiveFill,
  BagCheckFill,
  Check2Circle,
  PenFill,
  PersonCheckFill,
  ThreeDots,
} from "react-bootstrap-icons";
import moment from "moment";
import Table from "../../../components/table/Table";
import Loader from "../../../components/common/Loader";
import {
  getHotspotCustomer,
  getHotspotPackage,
  hotspotPackageDelete,
  syncHotspotPackage,
} from "../../../features/hotspotApi";
import EditHotspotPackage from "./hotspotOperations/EditHotspotPackage";
import HotspotCustomerSync from "./hotspotOperations/HotspotCustomerSync";

const Hotspot = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwner id & mikrotik id form params
  const { ispOwner, mikrotikId } = useParams();

  // get all mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // mikrotik
  const configMikrotik = mikrotik.find((item) => item.id === mikrotikId);

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  // get hotspot customer
  const hotspotCustomer = useSelector((state) => state.hotspot?.customer);

  // loading state
  const [hotspotPackageLoading, setHotspotPackageLoading] = useState(false);

  // delete loading
  const [deleteLoading, setDeleteLoading] = useState(false);

  // hotspot Customer loading state
  const [hotspotCustomerLoading, setHotspotCustomerLoading] = useState(false);

  // section show state
  const [showSection, setShowSection] = useState("hotspotPackage");

  // mikrotik package
  const [mtkPackage, setMtkPackage] = useState([]);

  // mikrotik customer
  const [mikrotikCustomer, setMikrotikCustomer] = useState([]);

  // edit package state
  const [editPackageId, setEditPackageId] = useState();

  // modal close handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // hotspot package sync handler
  const hotspotPackageHandle = () => {
    syncHotspotPackage(
      dispatch,
      ispOwner,
      mikrotikId,
      setHotspotPackageLoading,
      "showToast"
    );
  };

  useEffect(() => {
    // get hotspot package api call
    getHotspotPackage(dispatch, ispOwner, setHotspotPackageLoading);

    // get hotspot customer api call
    getHotspotCustomer(dispatch, ispOwner, setHotspotCustomerLoading);
  }, []);

  // filter mikrotik package & customer
  useEffect(() => {
    // filter miktrotik package
    if (hotsPackage) {
      const filterHotspotPackage = hotsPackage.filter(
        (item) => item.mikrotik === mikrotikId
      );
      setMtkPackage(filterHotspotPackage);
    }

    // filter mikrotik customer
    if (hotspotCustomer) {
      const filterMikrotikCustomer = hotspotCustomer.filter(
        (item) => item.mikrotik === mikrotikId
      );
      setMikrotikCustomer(filterMikrotikCustomer);
    }
  }, [hotsPackage, hotspotCustomer]);

  // delete hotspot package
  const deleteHotapotPackage = (mikrotikId, packageId) => {
    const confirm = window.confirm(t("areYourSureWantToDelete"));
    if (confirm) {
      hotspotPackageDelete(dispatch, mikrotikId, packageId, setDeleteLoading);
    }
  };

  // package column
  const packageColumn = React.useMemo(
    () => [
      {
        width: "5%",
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
        Header: t("packageType"),
        accessor: "packageType",
      },
      {
        width: "10%",
        Header: t("rateLimit"),
        accessor: "rateLimit",
      },
      {
        width: "10%",
        Header: t("rate"),
        accessor: "rate",
      },
      {
        width: "10%",
        Header: t("validity"),
        accessor: "validity",
      },
      {
        width: "10%",
        Header: t("user"),
        accessor: "sharedUsers",
      },
      {
        width: "10%",
        Header: t("dataLimit"),
        accessor: "dataLimit",
      },
      {
        width: "10%",
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
              <ul
                className="dropdown-menu"
                aria-labelledby="pppoePackageDropdown"
              >
                <li
                  onClick={() => {
                    setEditPackageId(original.id);
                    setModalStatus("packageEdit");
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
                    deleteHotapotPackage(original.mikrotik, original.id);
                  }}
                >
                  <div className="dropdown-item actionManager">
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

  // customer column
  const customerColumn = React.useMemo(
    () => [
      {
        width: "8%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "11%",
        Header: t("status"),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.status === "active" ? (
              <Check2Circle color="green" />
            ) : (
              <Check2Circle color="green" />
            )}
          </div>
        ),
      },
      {
        width: "20%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "12%",
        Header: t("package"),
        accessor: "hotspot.profile",
      },
    ],
    [t]
  );

  return (
    <>
      <div className="addCollector mt-2">
        <div className=" d-flex justify-content-around">
          <div className="rightSideMikrotik">
            {/* package & customer filter */}
            <h5 className="mb-1"> {t("select")} </h5>
            <select
              id="selectMikrotikOption"
              className="form-select mt-0"
              onChange={(event) => setShowSection(event.target.value)}
            >
              <option value="hotspotPackage">{t("package")}</option>
              <option value="hotsPotCustomer">{t("sokolCustomer")}</option>
            </select>
          </div>

          {/* mikrotik information */}
          <div className="mikrotikDetails">
            <p className="lh-sm">
              {t("name")} : <b>{configMikrotik?.name || "..."}</b>
            </p>
            <p className="lh-sm">
              {t("ip")} : <b>{configMikrotik?.host || "..."}</b>
            </p>
            <p className="lh-sm">
              {t("userName")} : <b>{configMikrotik?.username || "..."}</b>
            </p>
            <p className="lh-sm">
              {t("port")} : <b>{configMikrotik?.port || "..."}</b>
            </p>
          </div>

          {/* setting button */}
          <div className="addAndSettingIcon">
            {/* hotspot package sync button */}
            <button
              onClick={hotspotPackageHandle}
              title={t("packageSync")}
              className="btn btn-outline-primary mb-2"
            >
              {hotspotPackageLoading ? <Loader /> : t("packageSync")}
              <BagCheckFill />
            </button>
            <br />

            {/* hotspot customer sync button */}
            <button
              title={t("hotspotpackageSync")}
              className="btn btn-outline-primary"
              onClick={() => {
                setModalStatus("customerSync");
                setShow(true);
              }}
            >
              {hotspotCustomerLoading ? <Loader /> : t("customerSync")}
              <PersonCheckFill />
            </button>
          </div>
        </div>

        {showSection === "hotspotPackage" && (
          <Table
            isLoading={hotspotPackageLoading}
            columns={packageColumn}
            data={mtkPackage}
          ></Table>
        )}
        {showSection === "hotsPotCustomer" && (
          <Table
            isLoading={hotspotPackageLoading}
            columns={customerColumn}
            data={mikrotikCustomer}
          ></Table>
        )}
      </div>

      {/* pakcage edit modal */}
      {modalStatus === "packageEdit" && (
        <EditHotspotPackage
          show={show}
          setShow={setShow}
          packageId={editPackageId}
        />
      )}

      {/* customer sync modal */}
      {modalStatus === "customerSync" && (
        <HotspotCustomerSync
          show={show}
          setShow={setShow}
          ispOwnerId={ispOwner}
          mikrotikId={mikrotikId}
        />
      )}
    </>
  );
};

export default Hotspot;
