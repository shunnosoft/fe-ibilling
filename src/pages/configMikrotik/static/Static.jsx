import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PersonLinesFill } from "react-bootstrap-icons";
import CustomerSync from "./staticOperation/CustomerSync";
import { useEffect } from "react";
import { getStaticCustomer, testFireWallApi } from "../../../features/apiCalls";
import { useDispatch } from "react-redux";
import Table from "../../../components/table/Table";
import moment from "moment";

const Static = () => {
  const { t } = useTranslation();

  // get dispatch
  const dispatch = useDispatch();

  const { ispOwner, mikrotikId } = useParams();

  // get all mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // mikrotik
  const configMikrotik = mikrotik.find((item) => item.id === mikrotikId);

  // get static customer
  const customer = useSelector((state) => state?.customer?.staticCustomer);

  // customer state
  const [staticCustomer, setStatiCustomer] = useState(customer);

  // customer loading
  const [customerLoading, setCustomerLoading] = useState(false);

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
    getStaticCustomer(dispatch, ispOwner, setCustomerLoading);
  }, []);

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
            {/* <div className="rightSideMikrotik">
              <h5 className="mb-1"> {t("select")} </h5>
              <select
                id="selectMikrotikOption"
                className="form-select mt-0"
                onChange={(event) => setShowSection(event.target.value)}
              >
                <option value="hotspotPackage">{t("package")}</option>
                <option value="hotsPotCustomer">{t("sokolCustomer")}</option>
              </select>
            </div> */}

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
                data-bs-toggle="modal"
                data-bs-target="#staticCustomerSync"
                title={t("staticCustomerSync")}
                className="btn btn-outline-primary me-2 "
              >
                {t("staticCustomerSync")} <PersonLinesFill />
              </button>
            </div>
          </div>
          <Table
            isLoading={customerLoading}
            columns={columns}
            data={staticCustomer}
          ></Table>
        </div>
      </div>
      <CustomerSync mikrotikId={mikrotikId} ispOwner={ispOwner} />
    </>
  );
};

export default Static;
