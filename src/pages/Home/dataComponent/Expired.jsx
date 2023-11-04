import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { GeoAlt, Person, Phone, PrinterFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";

//internal import
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";
import Table from "../../../components/table/Table";
import { getExpiredCustomer } from "../../../features/apiCalls";
import CustomerPdf from "../homePdf/CustomerPdf";
import PPPoECustomerDetails from "../../Customer/customerCRUD/CustomerDetails";
import HotspotCustomerDetails from "../../hotspot/customerOperation/CustomerDetails";
import StaticCustomerDetails from "../../staticCustomer/customerCRUD/CustomerDetails";
import { Badge } from "react-bootstrap";

const Expired = ({ ispOwnerId, year, month, status }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // current date
  const date = new Date();

  // get user role
  const role = useSelector((state) => state.persistedReducer.auth.role);

  // get user permission
  const permissions = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  // get expired customer data
  const customer = useSelector(
    (state) => state.dashboardInformation?.expiredCustomer
  );

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  // view customer id
  const [customerId, setCustomerId] = useState("");

  // modal change state
  const [modalStatus, setModalStatus] = useState("");
  const [show, setShow] = useState(false);

  // customer current package find
  const getCustomerPackage = (value) => {
    if (value?.userType === "hotspot") {
      const findPack = hotsPackage.find((item) =>
        item.id.includes(value?.hotspotPackage)
      );
      return findPack;
    } else {
      const findPack = allPackages.find((item) =>
        item.id.includes(value?.mikrotikPackage)
      );
      return findPack;
    }
  };

  //find customer billing date before and after promise date
  const getCustomerPromiseDate = (data) => {
    const billDate = moment(data?.billingCycle).format("YYYY/MM/DD hh:mm A");

    const promiseDate = moment(data?.promiseDate).format("YYYY/MM/DD hh:mm A");

    var promiseDateChange;

    if (billDate < promiseDate) {
      promiseDateChange = "danger";
    } else if (billDate > promiseDate) {
      promiseDateChange = "warning";
    }

    return { billDate, promiseDate, promiseDateChange };
  };

  // customer day left filtering in current date
  const getCustomerDayLeft = (billDate) => {
    //current day
    const currentDay = new Date(
      new Date(moment(date).format("YYYY-MM-DD"))
    ).getTime();

    // // billing day
    const billDay = new Date(
      new Date(moment(billDate).format("YYYY-MM-DD"))
    ).getTime();

    const diffInMs = billDay - currentDay;

    // // bill day left
    const dayLeft = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    return dayLeft;
  };

  const column = React.useMemo(
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
              className="btn btn-sm btn-outline-primary"
              title={t("profile")}
              onClick={() => {
                setModalStatus(original?.userType);
                setCustomerId(original?.id);
                setShow(true);
              }}
            >
              <Person size={22} />
            </button>
          </div>
        ),
      },
    ],
    [t, allPackages, hotsPackage]
  );

  useEffect(() => {
    status === "expired" &&
      getExpiredCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [month, status, year]);

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

  return (
    <>
      <div
        className="modal fade"
        id="expiredCustomer"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("expiredCustomer")}
              </h5>

              <div className="collectorWrapper pt-0">
                <div
                  className="addAndSettingIcon"
                  style={{
                    marginLeft: ".5rem",
                    textAlign: "end",
                  }}
                >
                  <ReactToPrint
                    documentTitle="Customer Overview"
                    trigger={() => (
                      <PrinterFill
                        // title={t("print")}
                        className="addcutmButton"
                        style={{ background: "#0EB96A", color: "white" }}
                      />
                    )}
                    content={() => componentRef.current}
                  />
                </div>
              </div>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
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

              <div className="d-none">
                <CustomerPdf customerData={customer} ref={componentRef} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* customer details modal by user type  */}

      {modalStatus === "pppoe" ? (
        <PPPoECustomerDetails
          show={show}
          setShow={setShow}
          customerId={customerId}
        />
      ) : modalStatus === "hotspot" ? (
        <HotspotCustomerDetails
          show={show}
          setShow={setShow}
          customerId={customerId}
        />
      ) : (
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
