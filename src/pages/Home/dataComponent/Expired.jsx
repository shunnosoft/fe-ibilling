import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { GeoAlt, Person, Phone, PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Badge,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

//internal import
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";
import Table from "../../../components/table/Table";
import { getAllPackages, getExpiredCustomer } from "../../../features/apiCalls";
import PPPoECustomerDetails from "../../Customer/customerCRUD/CustomerDetails";
import HotspotCustomerDetails from "../../hotspot/customerOperation/CustomerDetails";
import StaticCustomerDetails from "../../staticCustomer/customerCRUD/CustomerDetails";
import useISPowner from "../../../hooks/useISPOwner";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "../../Customer/customerCRUD/customerBillDayPromiseDate";
import PrintOptions from "../../../components/common/PrintOptions";
import { getHotspotPackage } from "../../../features/hotspotApi";
import useAreaPackage from "../../../hooks/useAreaPackage";

const Expired = ({
  modalShow,
  setModalShow,
  status,
  ispOwnerId,
  month,
  year,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner
  const { role, permissions } = useISPowner();

  // get users area packages form useAreaPackage hook
  const { allPackage, hotsPackage } = useAreaPackage();

  // get expired customer data
  const customer = useSelector(
    (state) => state.dashboardInformation?.expiredCustomer
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // view customer id
  const [customerId, setCustomerId] = useState("");

  // modal change state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    status === "expired" &&
      getExpiredCustomer(dispatch, ispOwnerId, year, month, setIsLoading);

    //get all customer package api
    allPackage.length === 0 && getAllPackages(dispatch, ispOwnerId, setLoading);

    // get hotspot package api call
    hotsPackage.length === 0 &&
      getHotspotPackage(dispatch, ispOwnerId, setLoading);
  }, [month, status, year]);

  // modal close handler
  const closeHandler = () => setModalShow(false);

  // customer current package find
  const getCustomerPackage = (value) => {
    if (value?.userType === "hotspot") {
      const findPack = hotsPackage.find((item) =>
        item.id.includes(value?.hotspotPackage)
      );
      return findPack;
    } else {
      const findPack = allPackage.find((item) =>
        item.id.includes(value?.mikrotikPackage)
      );
      return findPack;
    }
  };

  // all balance count
  const allBill = useMemo(() => {
    let count = 0;
    customer.forEach((item) => {
      count = count + item.monthlyFee;
    });
    return { count };
  }, [customer]);

  // custom component balance tk show
  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {allBill.count > 0 && (
        <div>
          {t("totalBill")}-৳
          {FormatNumber(allBill.count)}
        </div>
      )}
    </div>
  );

  //customer print option
  const printData = {
    id: 1003,
    value: "PPIPHp",
    label: "PPIPHp",
    checked: true,
  };

  const column = useMemo(
    () => [
      {
        width: "6%",
        Header: t("id"),
        accessor: "customerId",
        Cell: ({ row: { original } }) => (
          <div>
            <p className="text-center">{original?.customerId}</p>
            <Badge bg="primary">
              {original?.userType === "pppoe"
                ? "PPPoE"
                : original?.userType === "hotspot"
                ? "Hotspot"
                : "Static"}
            </Badge>
          </div>
        ),
      },
      {
        width: "15%",
        Header: t("pppoeIp"),
        accessor: (data) =>
          `${data?.name} ${data.pppoe?.name} ${data.queue?.address}
           ${data.queue?.srcAddress} ${data.queue?.target} ${data.hotspot?.name}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original?.name}</p>
            <p>
              {original?.userType === "pppoe"
                ? original?.pppoe.name
                : original?.userType === "firewall-queue"
                ? original?.queue.address
                : original?.userType === "core-queue"
                ? original?.queue.srcAddress
                : original?.userType === "simple-queue"
                ? original?.queue.target
                : original?.hotspot.name}
            </p>
          </div>
        ),
      },
      {
        width: "18%",
        Header: t("mobileAddress"),
        accessor: (data) => `${data?.mobile} ${data?.address}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p style={{ fontWeight: "500" }}>
              <Phone className="text-info" /> {original?.mobile || "N/A"}
            </p>
            <p>
              <GeoAlt />
              {original?.address || "N/A"}
            </p>
          </div>
        ),
      },
      {
        width: "10%",
        Header: t("package"),
        Cell: ({ row: { original } }) => (
          <div>{original && getCustomerPackage(original)?.name}</div>
        ),
      },
      {
        width: "12%",
        Header: t("billBalance"),
        accessor: (data) => `${data?.monthlyFee} ${data?.balance}`,
        Cell: ({ row: { original } }) => (
          <div style={{ fontWeight: "500" }}>
            <p>৳{original?.monthlyFee}</p>
            <p
              className={`text-${
                original?.balance > -1 ? "success" : "danger"
              }`}
            >
              ৳{original?.balance}
            </p>
          </div>
        ),
      },
      {
        width: "18%",
        Header: t("billPromise"),
        accessor: (data) =>
          `${moment(data?.billingCycle).format("YYYY/MM/DD hh:mm A")} 
          ${moment(data?.promiseDate).format("YYYY/MM/DD hh:mm A")}`,
        Cell: ({ row: { original } }) => (
          <div className="d-flex">
            <div>
              <p>{getCustomerPromiseDate(original)?.billDate}</p>

              <p
                className={`d-flex align-self-end text-${
                  getCustomerPromiseDate(original)?.promiseDateChange
                }`}
              >
                {original?.userType !== "hotspot" &&
                  getCustomerPromiseDate(original)?.promiseDate}
              </p>
            </div>
          </div>
        ),
      },
      {
        width: "6%",
        Header: t("day"),
        accessor: (data) => `${new Date(data?.billingCycle).getDay()}`,
        Cell: ({ row: { original } }) => (
          <div className="text-center p-1">
            <p
              className={`${
                getCustomerDayLeft(original?.billingCycle) >= 20
                  ? "border border-2 border-success"
                  : getCustomerDayLeft(original?.billingCycle) >= 10
                  ? "border border-2 border-primary"
                  : getCustomerDayLeft(original?.billingCycle) >= 0
                  ? "magantaColor"
                  : "bg-danger text-white"
              }`}
            >
              {getCustomerDayLeft(original?.billingCycle)}
            </p>
          </div>
        ),
      },
      {
        width: "8%",
        Header: t("status"),
        accessor: (data) => `${data?.paymentStatus} ${data?.status}`,
        Cell: ({ row: { original } }) => (
          <div className="text-center">
            <p>{badge(original?.paymentStatus)}</p>
            <p>{badge(original?.status)}</p>
          </div>
        ),
      },
      {
        width: "5%",
        Header: t("action"),
        id: "option",
        Cell: ({ row: { original } }) => (
          <div className="d-flex justify-content-center align-items-center">
            {/* customer profile details by user type */}
            <button
              className="btn btn-sm btn-outline-primary p-1"
              title={t("profile")}
              onClick={() => {
                setModalStatus(original?.userType);
                setCustomerId(original?.id);
                setShow(true);
              }}
            >
              <Person size={19} />
            </button>
          </div>
        ),
      },
    ],
    [t, allPackage, hotsPackage]
  );

  return (
    <>
      <Modal show={modalShow} onHide={closeHandler} keyboard={false} size="xl">
        <ModalHeader closeButton>
          <ModalTitle>
            <div className="d-flex align-items-center">
              <h5 className="text-secondary">{t("expiredCustomer")}</h5>
              <div className="collectorWrapper pt-0">
                <div
                  className="addAndSettingIcon"
                  style={{
                    marginLeft: ".5rem",
                    textAlign: "end",
                  }}
                >
                  <PrinterFill
                    title={t("print")}
                    className="addcutmButton"
                    style={{ background: "#0EB96A", color: "white" }}
                    onClick={() => {
                      setModalStatus("print");
                      setShow(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          {customer && (
            <Table
              isLoading={isLoading}
              customComponent={
                role === "ispOwner" || permissions?.dashboardCollectionData
                  ? customComponent
                  : ""
              }
              columns={column}
              data={customer}
            ></Table>
          )}
        </ModalBody>
      </Modal>

      {/* expired customer modals */}

      {/* all customer print option modal */}
      {modalStatus === "print" && (
        <PrintOptions
          show={show}
          setShow={setShow}
          tableData={customer}
          page={"customer"}
          printData={printData}
        />
      )}

      {/* customer details modal by user type  */}
      {modalStatus === "pppoe" && (
        <PPPoECustomerDetails
          show={show}
          setShow={setShow}
          customerId={customerId}
        />
      )}
      {modalStatus === "hotspot" && (
        <HotspotCustomerDetails
          show={show}
          setShow={setShow}
          customerId={customerId}
        />
      )}
      {(modalStatus === "simple-queue" ||
        modalStatus === "firewall-queue" ||
        modalStatus === "core-queue") && (
        <StaticCustomerDetails
          show={show}
          setShow={setShow}
          customerId={customerId}
        />
      )}
    </>
  );
};

export default Expired;
