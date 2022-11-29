import React, { useEffect, useMemo, useState } from "react";
import {
  ArchiveFill,
  BagCheckFill,
  Check2Circle,
  FileExcelFill,
  PenFill,
  PersonCheckFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  deletePPPoEpackage,
  fetchPackagefromDatabase,
  fetchpppoePackage,
  fetchpppoeUser,
} from "../../../features/apiCalls";
import { useDispatch } from "react-redux";
import CustomerSync from "../configMikrotikModals/CustomerSync";
import Table from "../../../components/table/Table";
import PPPoEpackageEditModal from "../configMikrotikModals/PPPoEpackageEditModal";
import { CSVLink } from "react-csv";

const PPPoE = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  // get ispOwner id & mikrotik id form params
  const { ispOwner, mikrotikId } = useParams();

  // get isp owner data
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );

  // mikrotik loading state
  const mtkIsLoading = useSelector((state) => state?.mikrotik?.isLoading);

  // get all mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // mikrotik
  const configMikrotik = mikrotik.find((item) => item.id === mikrotikId);

  // get pppoe package
  let pppoePackage = useSelector((state) => state?.mikrotik?.pppoePackage);

  // get all user
  const allMikrotikUsers = useSelector((state) => state?.mikrotik?.pppoeUser);

  // inactive customer state
  const [inActiveCustomer, setInActiveCustomer] = useState(false);

  // package loading
  const [packageLoading, setPackageLoading] = useState(false);

  // customer loading
  const [customerLoading, setCustomerLoading] = useState(false);

  // delete loading
  const [isDeleting, setIsDeleting] = useState(false);

  // package id state
  const [packageId, setPackageId] = useState();

  // user state
  let [allUsers, setAllUsers] = useState(allMikrotikUsers);

  // section show state
  const [showSection, setShowSection] = useState("PPPoEPackage");

  // status filter
  const filterIt = (e) => {
    let temp;
    if (e.target.value === "allCustomer") {
      setAllUsers(allMikrotikUsers);
    } else if (e.target.value === "true") {
      temp = allMikrotikUsers.filter((item) => item.disabled == true);
      setAllUsers(temp);
    } else if (e.target.value === "false") {
      temp = allMikrotikUsers.filter((item) => item.disabled != true);
      setAllUsers(temp);
    }
  };

  // package sync loading
  const syncPackage = () => {
    if (window.confirm(t("syncMikrotikPackage"))) {
      const IDs = {
        ispOwner: ispOwner,
        mikrotikId: mikrotikId,
      };
      fetchpppoePackage(dispatch, IDs, setPackageLoading, configMikrotik?.name);
    }
  };

  // delete single pppoe package
  const deleteSinglePPPoEpackage = async (mikrotikID, Id) => {
    const confirm = window.confirm(t("doWantDeletePackage"));
    if (confirm) {
      setIsDeleting(true);
      const IDs = {
        mikrotikId: mikrotikID,
        pppPackageId: Id,
      };

      deletePPPoEpackage(dispatch, IDs, configMikrotik?.name);
    }
  };

  useEffect(() => {
    setAllUsers(allMikrotikUsers);
  }, [allMikrotikUsers]);

  useEffect(() => {
    const IDs = {
      ispOwner: ispOwner,
      mikrotikId: mikrotikId,
    };
    fetchPackagefromDatabase(
      dispatch,
      IDs,
      setPackageLoading,
      configMikrotik?.name
    );

    fetchpppoeUser(
      dispatch,
      IDs,
      configMikrotik?.name,
      setCustomerLoading,
      "mikrotikUser"
    );
  }, []);

  //export customer data
  let customerForCsVTableInfo = useMemo(
    () =>
      allUsers.map((customer) => {
        return {
          name: customer?.name,
          package: customer?.profile,
          status: customer?.running ? "Active" : "In Active",
          rxByte: customer?.rxByte
            ? (customer?.rxByte / 1024 / 1024).toFixed(2) + " MB"
            : "",
          txByte: customer?.txByte
            ? (customer?.txByte / 1024 / 1024).toFixed(2) + " MB"
            : "",
          lastLinkUpTime: customer?.lastLinkUpTime,
          lastLoggedOut: customer?.lastLoggedOut,
        };
      }),
    [allUsers]
  );

  // csv table header
  const customerForCsVTableInfoHeader = [
    { label: "name_of_client", key: "name" },
    { label: "bandwidth_allocation MB", key: "package" },
    { label: "status", key: "status" },
    { label: "Rx Byte", key: "rxByte" },
    { label: "Tx Byte", key: "txByte" },
    { label: "Last Link UP Time", key: "lastLinkUpTime" },
    { label: "Last Logged Out", key: "lastLoggedOut" },
  ];

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
        width: "20%",
        Header: t("packageAliasName"),
        accessor: "aliasName",
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
                  data-bs-target="#pppoePackageEditModal"
                  onClick={() => {
                    setPackageId(original.id);
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
                    deleteSinglePPPoEpackage(original.mikrotik, original.id);
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
        accessor: "running",
        Cell: ({ row: { original } }) => (
          <div>
            {original?.disabled ? (
              <Check2Circle color="red" />
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
        accessor: "profile",
      },
      {
        width: "12%",
        Header: "RX",
        accessor: "rxByte",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {original?.rxByte
              ? (original?.rxByte / 1024 / 1024).toFixed(2) + " MB"
              : ""}
          </div>
        ),
      },
      {
        width: "12%",
        Header: "TX",
        accessor: "txByte",
        Cell: ({ row: { original } }) => (
          <div
            style={{
              padding: "15px 15px 15px 0 !important",
            }}
          >
            {original?.txByte
              ? (original?.txByte / 1024 / 1024).toFixed(2) + " MB"
              : ""}
          </div>
        ),
      },
      {
        width: "25%",
        Header: "Last Link Up Time",
        accessor: "lastLinkUpTime",
      },
    ],
    [t]
  );

  return (
    <>
      <div className="collectorWrapper mt-2 py-2">
        <div className="addCollector">
          <div className=" d-flex justify-content-around">
            <div className="d-flex">
              {/* package & customer filter */}
              <div className="filter-section">
                <h5 className="mb-1"> {t("select")} </h5>
                <select
                  id="selectMikrotikOption"
                  className="form-select mt-0"
                  onChange={(event) => setShowSection(event.target.value)}
                >
                  <option value="PPPoEPackage">{t("package")}</option>
                  <option value="PPPoECustomer">{t("sokolCustomer")}</option>
                </select>
              </div>

              <div className="status-section ms-2">
                {showSection === "PPPoECustomer" && (
                  <>
                    <h5 className="mb-1"> {t("status")} </h5>
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
                  </>
                )}
              </div>
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
              {showSection === "PPPoECustomer" && (
                <>
                  <button className="btn btn-outline-primary mb-1">
                    <CSVLink
                      data={customerForCsVTableInfo}
                      filename={ispOwnerData.company}
                      headers={customerForCsVTableInfoHeader}
                      title={t("mikrotikCustomerCsvDownload")}
                    >
                      <span className="text-primary">{t("print")}</span>{" "}
                      <FileExcelFill className="text-primary" />
                    </CSVLink>
                  </button>
                  <br />
                </>
              )}
              <button
                // disabled={pppoePackage.some(
                //   (i) =>
                //     i.rate === 0 &&
                //     i.name !== "default-encryption" &&
                //     i.name !== "default"
                // )}
                onClick={syncPackage}
                title={t("packageSync")}
                className="btn btn-outline-primary mb-1"
              >
                {mtkIsLoading ? <Loader /> : t("packageSync")} <BagCheckFill />
              </button>

              <br />
              <button
                data-bs-toggle="modal"
                data-bs-target="#SyncCustomer"
                onClick={() => {
                  setInActiveCustomer(false);
                }}
                title={t("PPPoECustomerSync")}
                className="btn btn-outline-primary"
              >
                {mtkIsLoading ? <Loader /> : t("customerSync")}{" "}
                <PersonCheckFill />
              </button>
            </div>
          </div>
          {showSection === "PPPoEPackage" && (
            <Table
              isLoading={packageLoading}
              columns={packageColumn}
              data={pppoePackage}
            ></Table>
          )}
          {showSection === "PPPoECustomer" && (
            <Table
              isLoading={customerLoading}
              columns={customerColumn}
              data={allUsers}
            ></Table>
          )}
        </div>
      </div>

      {/* modals */}
      <PPPoEpackageEditModal singlePackage={packageId} />
      <CustomerSync
        mikrotikId={mikrotikId}
        ispOwner={ispOwner}
        inActiveCustomer={inActiveCustomer}
        setInActiveCustomer={setInActiveCustomer}
      />
    </>
  );
};

export default PPPoE;
