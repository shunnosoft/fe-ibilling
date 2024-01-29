import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  ArchiveFill,
  PenFill,
  PersonLinesFill,
  ThreeDots,
} from "react-bootstrap-icons";
import { useDispatch } from "react-redux";
import moment from "moment";

// internal import
import CustomerSync from "./staticOperation/CustomerSync";
import {
  deleteStaticPackage,
  getQueuePackageByIspOwnerId,
  getStaticCustomer,
} from "../../../features/apiCalls";
import Table from "../../../components/table/Table";
import EditPackage from "../../staticCustomer/EditPackageModal";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const Static = () => {
  const { t } = useTranslation();

  // get dispatch
  const dispatch = useDispatch();

  // get ispOwner id & mikrotik id form params
  const { ispOwner, mikrotikId } = useParams();

  // get all package list
  let packages = useSelector((state) => state?.package?.packages);

  // get all mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // mikrotik
  const configMikrotik = mikrotik.find((item) => item.id === mikrotikId);

  // get static customer
  const customer = useSelector((state) => state?.customer?.staticCustomer);

  // customer loading
  const [customerLoading, setCustomerLoading] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  // section show state
  const [showSection, setShowSection] = useState("staticPackage");

  // customer state
  const [staticCustomer, setStatiCustomer] = useState(customer);

  // set editable data for state
  const [singlePackage, setSinglePackage] = useState("");

  // modal close handler
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    // filter mikrotik customer
    if (customer) {
      const filterCustomer = customer.filter(
        (item) => item.mikrotik === mikrotikId
      );
      setStatiCustomer(filterCustomer);
    }
  }, [customer]);

  useEffect(() => {
    // get package api call
    getQueuePackageByIspOwnerId(ispOwner, dispatch, setIsloading);

    getStaticCustomer(dispatch, ispOwner, setCustomerLoading);
  }, []);

  // delete handle function
  const deletePackageHandler = (packageId) => {
    const confirm = window.confirm(t("doWantDeletePackage"));
    if (confirm) {
      deleteStaticPackage(dispatch, packageId);
    }
  };

  // package column
  const packageColumn = React.useMemo(
    () => [
      {
        Header: t("serial"),
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        Header: t("package"),
        accessor: "name",
      },
      {
        Header: t("rate"),
        accessor: "rate",
      },

      {
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
              {
                <li
                  onClick={() => {
                    setSinglePackage(original);
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
              }
              <li
                onClick={() => {
                  deletePackageHandler(original.id);
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
        ),
      },
    ],
    []
  );

  // customer column
  const columns = React.useMemo(
    () => [
      {
        width: "10%",
        Header: "#",
        id: "row",
        accessor: (row) => Number(row.id + 1),
        Cell: ({ row }) => <strong>{Number(row.id) + 1}</strong>,
      },
      {
        width: "25%",
        Header: t("name"),
        accessor: "name",
      },
      {
        width: "30%",
        Header: t("ip"),
        accessor: (field) =>
          field.userType === "firewall-queue"
            ? field.queue.address
            : field.queue.target,
      },
      {
        width: "30%",
        Header: t("createdAt"),
        accessor: "createdAt",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("MMM DD YYYY hh:mm A");
        },
      },
    ],
    [t]
  );

  return (
    <>
      <div className="collectorWrapper mt-2 py-2">
        <div className="addCollector">
          <div className=" d-flex justify-content-around">
            <div className="filter-section">
              <h5 className="mb-1"> {t("select")} </h5>
              <select
                id="selectMikrotikOption"
                className="form-select mt-0"
                onChange={(event) => setShowSection(event.target.value)}
              >
                <option value="staticPackage">{t("package")}</option>
                <option value="staticCustomer">{t("sokolCustomer")}</option>
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
              {/* static customer sync button */}
              <button
                className="btn btn-outline-primary me-2"
                title={t("staticCustomerSync")}
                onClick={() => {
                  setModalStatus("customerSync");
                  setShow(true);
                }}
              >
                {t("staticCustomerSync")} <PersonLinesFill />
              </button>
            </div>
          </div>

          {showSection === "staticPackage" && (
            <Table
              isLoading={isLoading}
              columns={packageColumn}
              data={packages}
            ></Table>
          )}
          {showSection === "staticCustomer" && (
            <Table
              isLoading={customerLoading}
              columns={columns}
              data={staticCustomer}
            ></Table>
          )}
        </div>
      </div>

      {/* package edit modal */}
      {modalStatus === "packageEdit" && (
        <EditPackage
          show={show}
          setShow={setShow}
          singlePackage={singlePackage}
        />
      )}

      {/* customer sync modal */}
      {modalStatus === "customerSync" && (
        <CustomerSync
          show={show}
          setShow={setShow}
          mikrotikId={mikrotikId}
          ispOwner={ispOwner}
        />
      )}
    </>
  );
};

export default Static;
