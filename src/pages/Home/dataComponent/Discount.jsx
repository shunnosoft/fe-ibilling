import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getDiscountCustomer } from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../components/table/Table";
import { badge } from "../../../components/common/Utils";
import moment from "moment";
import FormatNumber from "../../../components/common/NumberFormat";
import CustomerPdf from "../homePdf/CustomerPdf";
import ReactToPrint from "react-to-print";
import { PrinterFill } from "react-bootstrap-icons";

const Discount = ({ show, setShow, ispOwnerId, year, month, status }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const componentRef = useRef();

  // get discount customer data
  const discountCustomer = useSelector(
    (state) => state.dashboardInformation?.discountCustomer
  );
  console.log(discountCustomer);

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    status === "discount" &&
      getDiscountCustomer(dispatch, ispOwnerId, year, month, setIsLoading);
  }, [status, year, month]);

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
  const column = useMemo(
    () => [
      {
        width: "8%",
        Header: t("id"),
        accessor: "customer.customerId",
      },
      {
        width: "8%",
        Header: t("name"),
        accessor: "customer.name",
      },
      {
        width: "8%",
        Header: t("mobile"),
        accessor: "customer.mobile",
      },
      {
        width: "8%",
        Header: t("status"),
        accessor: "customer.status",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "8%",
        Header: t("paymentStatus"),
        accessor: "paymentStatus",
        Cell: ({ cell: { value } }) => {
          return badge(value);
        },
      },
      {
        width: "8%",
        Header: t("discount"),
        accessor: "discount",
      },
      {
        width: "10%",
        Header: t("package"),
        Cell: ({ row: { original } }) => (
          <div>{original && getCustomerPackage(original)?.name}</div>
        ),
      },
      {
        width: "8%",
        Header: t("mountly"),
        accessor: "customer.monthlyFee",
      },
      {
        width: "8%",
        Header: t("balance"),
        accessor: "balance",
      },
      {
        width: "10%",
        Header: t("bill"),
        accessor: "billingCycle",
        Cell: ({ cell: { value } }) => {
          return moment(value).format("YYYY/MM/DD hh:mm A");
        },
      },
    ],
    [t, allPackages, hotsPackage]
  );

  // modal close handler
  const handleClose = () => setShow(false);

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

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalHeader closeButton>
          <ModalTitle>
            <div className="d-flex">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("discountCustomer")}
              </h5>
              <div
                className="addAndSettingIcon"
                style={{
                  marginLeft: ".5rem",
                  textAlign: "end",
                }}
              >
                <ReactToPrint
                  documentTitle="Customer Discount Report"
                  trigger={() => (
                    <PrinterFill
                      title={t("print")}
                      className="addcutmButton"
                      style={{ background: "#0EB96A", color: "white" }}
                    />
                  )}
                  content={() => componentRef.current}
                />
              </div>
            </div>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="table-section">
            <Table
              isLoading={isLoading}
              columns={column}
              data={discountCustomer}
              customComponent={customComponent}
            ></Table>
          </div>
          <div className="d-none">
            <CustomerPdf
              customerData={discountCustomer}
              ref={componentRef}
              status="discount"
            />
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Discount;
