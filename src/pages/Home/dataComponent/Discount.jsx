import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Modal,
  ModalBody,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getDiscountCustomer } from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { GeoAlt, Person, Phone, PrinterFill } from "react-bootstrap-icons";

//internal import
import Table from "../../../components/table/Table";
import { badge } from "../../../components/common/Utils";
import FormatNumber from "../../../components/common/NumberFormat";
import {
  getCustomerDayLeft,
  getCustomerPromiseDate,
} from "../../Customer/customerCRUD/customerBillDayPromiseDate";
import PrintOptions from "../../../components/common/PrintOptions";
import PPPoECustomerDetails from "../../Customer/customerCRUD/CustomerDetails";
import HotspotCustomerDetails from "../../hotspot/customerOperation/CustomerDetails";
import StaticCustomerDetails from "../../staticCustomer/customerCRUD/CustomerDetails";

const Discount = ({
  status,
  modalShow,
  setModalShow,
  ispOwnerId,
  year,
  month,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get discount customer data
  const discountCustomer = useSelector(
    (state) => state.dashboardInformation?.discountCustomer
  );

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // view customer id
  const [customerId, setCustomerId] = useState("");

  // modal change state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    status === "discount" &&
      getDiscountCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [status, year, month]);

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
      const findPack = allPackages.find((item) =>
        item.id.includes(value.customer?.mikrotikPackage)
      );
      return findPack;
    }
  };

  // all monthlyFee count
  const allBill = useMemo(() => {
    let discount = 0;
    discountCustomer.forEach((item) => {
      discount = discount + item.discount;
    });
    return { discount };
  }, [discountCustomer]);

  const customComponent = (
    <div
      className="text-center"
      style={{ fontSize: "18px", fontWeight: "500", display: "flex" }}
    >
      {allBill.discount > 0 && (
        <div>
          {t("discount")}:-৳
          {FormatNumber(allBill.discount)}
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
            <p className="text-center">{original.customer?.customerId}</p>
            <Badge bg="primary">
              {original.customer?.userType === "pppoe"
                ? "PPPoE"
                : original.customer?.userType === "hotspot"
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
          `${data.customer?.name} ${data.customer.pppoe?.name} ${data.customer.queue?.address}
           ${data.customer.queue?.srcAddress} ${data.customer.queue?.target} ${data.customer.hotspot?.name}`,
        Cell: ({ row: { original } }) => (
          <div>
            <p>{original.customer?.name}</p>
            <p>
              {original.customer?.userType === "pppoe"
                ? original.customer?.pppoe.name
                : original.customer?.userType === "firewall-queue"
                ? original.customer?.queue.address
                : original.customer?.userType === "core-queue"
                ? original.customer?.queue.srcAddress
                : original.customer?.userType === "simple-queue"
                ? original.customer?.queue.target
                : original.customer?.hotspot?.name}
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
              <Phone className="text-info" />{" "}
              {original.customer?.mobile || "N/A"}
            </p>
            <p>
              <GeoAlt />
              {original.customer?.address || "N/A"}
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
            <p>৳{original.customer?.monthlyFee}</p>
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
            <p>{badge(original.customer?.paymentStatus)}</p>
            <p>{badge(original.customer?.status)}</p>
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
                setModalStatus(original.customer?.userType);
                setCustomerId(original.customer?.id);
                setShow(true);
              }}
            >
              <Person size={19} />
            </button>
          </div>
        ),
      },
    ],
    [t, allPackages, hotsPackage]
  );

  return (
    <>
      <Modal show={modalShow} onHide={closeHandler} keyboard={false} size="xl">
        <ModalHeader closeButton>
          <ModalTitle>
            <div className="d-flex align-items-center">
              <h5 className="text-secondary">{t("discountCustomer")}</h5>
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
          <Table
            isLoading={isLoading}
            columns={column}
            data={discountCustomer}
            customComponent={customComponent}
          ></Table>
        </ModalBody>
      </Modal>

      {/* active customer modals */}

      {/* all customer print option modal */}
      {modalStatus === "print" && (
        <PrintOptions
          show={show}
          setShow={setShow}
          tableData={discountCustomer}
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

export default Discount;
