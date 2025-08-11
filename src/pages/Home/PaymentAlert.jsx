import moment from "moment";
import React from "react";
import { Button, Col, Container, Navbar, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangle } from "react-bootstrap-icons";

const PaymentAlert = ({ invoice }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // invoice type
  const invoiceType = {
    monthlyServiceCharge: t("monthly"),
    registration: t("register"),
  };

  //---> expiration date calculation for pop-up modal
  let diffDays;
  if (invoice) {
    const dt = new Date(),
      expDate = new Date(invoice?.dueDate);

    const diffTime = Math.abs(expDate - dt);
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    diffDays <= 7 && (
      <Navbar
        bg={diffDays >= 5 ? "warning" : "danger"}
        variant="light"
        className={`rounded mb-4 ${
          diffDays >= 5
            ? "bg-opacity-50 border border-warning"
            : "bg-opacity-25 border border-opacity-50 border-danger"
        }`}
      >
        <Container fluid>
          <div className="row w-100 d-flex justify-content-between align-items-center gx-0 mx-0">
            <Col xs="auto" className="d-flex align-items-center">
              <ExclamationTriangle
                className="text-danger"
                style={{ height: 30, width: 30 }}
              />
              <div className="ms-2">
                <h5 className="mb-0" style={{ color: "#000" }}>
                  {t("oneBilling")} {invoiceType[invoice.type]} {t("fee")}{" "}
                  <span className="badge bg-info bg-opacity-25 text-primary fs-5">
                    {invoice?.amount} {t("tk")}
                  </span>{" "}
                  {t("expiredFee")}{" "}
                  <span className="badge bg-info bg-opacity-25 text-primary fs-5">
                    {moment(invoice?.dueDate).format("DD/MM/YYYY hh:mm A")}
                  </span>
                </h5>
              </div>
            </Col>

            <Col xs="auto">
              <Button
                variant="primary"
                onClick={() => navigate("/payment", { state: invoice })}
              >
                Pay Now
              </Button>
            </Col>
          </div>
        </Container>
      </Navbar>
    )
  );
};

export default PaymentAlert;
