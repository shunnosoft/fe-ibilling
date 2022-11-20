import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  ArchiveFill,
  BagCheckFill,
  Check2Circle,
  PenFill,
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

  // sync hotspot customer handler
  // const hotspotCustomerHandle = () => {
  //   syncHotspotCustomer(
  //     dispatch,
  //     ispOwner,
  //     mikrotikId,
  //     setHotspotCustomerLoading,
  //     "showToast"
  //   );
  // };

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
        width: "15%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("package"),
        accessor: "name",
      },
      {
        width: "20%",
        Header: t("rate"),
        accessor: "rate",
      },
      {
        width: "25%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },

      {
        width: "20%",
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
                  data-bs-toggle="modal"
                  data-bs-target="#hotspotPackageEdit"
                  onClick={() => {
                    setEditPackageId(original.id);
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
      <div className="collectorWrapper mt-2 py-2">
        <div className="addCollector">
          <div className="addNewCollector showMikrotikUpperSection mx-auto">
            <div className="LeftSideMikrotik justify-content-center">
              <div className="addAndSettingIcon">
                {hotspotPackageLoading ? (
                  <span>
                    <Loader />
                  </span>
                ) : (
                  <button
                    onClick={hotspotPackageHandle}
                    title={t("hotspotpackageSync")}
                    className="btn btn-outline-primary me-2 "
                  >
                    {t("hotspotpackageSync")} <BagCheckFill />
                  </button>
                )}
                {hotspotCustomerLoading ? (
                  <span>
                    <Loader />
                  </span>
                ) : (
                  <button
                    // onClick={hotspotCustomerHandle}
                    data-bs-toggle="modal"
                    data-bs-target="#hotspotCustomerSync"
                    title={t("hotspotpackageSync")}
                    className="btn btn-outline-primary me-2 "
                  >
                    {t("hotspotCustomerSync")} <BagCheckFill />
                  </button>
                )}
              </div>
            </div>
            <div className="rightSideMikrotik ms-5">
              <h4> {t("select")} </h4>
              <select
                id="selectMikrotikOption"
                className="form-select mt-0"
                onChange={(event) => setShowSection(event.target.value)}
              >
                <option value="hotspotPackage">{t("hotspotPackage")}</option>
                <option value="hotsPotCustomer">{t("sokolCustomer")}</option>
              </select>
            </div>
          </div>

          {/* <div className="d-flex mt-3">
                        <div className="mikrotikDetails me-5">
                          <p>
                            {t("name")} : <b>{singleMik?.name || "..."}</b>
                          </p>
                          <p>
                            {t("ip")} : <b>{singleMik?.host || "..."}</b>
                          </p>
                          <p>
                            {t("userName")} :{" "}
                            <b>{singleMik?.username || "..."}</b>
                          </p>
                          <p>
                            {t("port")} : <b>{singleMik?.port || "..."}</b>
                          </p>
                        </div>
                        <div className="rightSideMikrotik ms-5">
                          <h4> {t("select")} </h4>
                          <select
                            id="selectMikrotikOption"
                            className="form-select mt-0"
                            onChange={(event) =>
                              setWhatYouWantToShow(event.target.value)
                            }
                          >
                            <option value="showMikrotikPackage">
                              {t("PPPoEPackage")}
                            </option>
                            <option value="showAllMikrotikUser">
                              {t("sokolCustomer")}
                            </option>
                          </select>
                        </div>

                        {whatYouWantToShow === "showAllMikrotikUser" && (
                          <div className="rightSideMikrotik ms-5">
                            <h4> {t("status")} </h4>
                            <select
                              id="selectMikrotikOption"
                              onChange={filterIt}
                              className="form-select mt-0"
                            >
                              <option value={"allCustomer"}>
                                {t("sokolCustomer")}
                              </option>
                              <option value={"false"}>{t("active")}</option>
                              <option value={"true"}>{t("in active")}</option>
                            </select>
                          </div>
                        )}
                      </div> */}

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
      </div>
      <EditHotspotPackage packageId={editPackageId} />
      <HotspotCustomerSync ispOwnerId={ispOwner} mikrotikId={mikrotikId} />
    </>
  );
};

export default Hotspot;
