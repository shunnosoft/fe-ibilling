import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

// custome hooks import
import useISPowner from "../../../hooks/useISPOwner";

// internal import
import "./style.css";
import { FontColor, FourGround } from "../../../assets/js/theme";
import {
  getIspOwnerData,
  getIspOwnerNetFeeSupport,
  ispOwnerPayment,
} from "../../../features/apiCalls";
import Loader from "../../common/Loader";
import ActiveSupportNumber from "../../../pages/netFeeSupport/supportOpration/ActiveSupportNumber";

const AcountPayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();

  // current date
  const date = new Date();

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId } = useISPowner();

  // get ispOwner payment invoice to check expiration
  const ownerInvoice = useSelector((state) => state?.invoice?.invoice);

  // loading state
  const [isLoading, setIsloading] = useState(false);
  const [isAgreed, setAgreed] = useState(false);

  // invoice state
  const [invoice, setInvoice] = useState({});

  // ispOwner invoice due date
  const invoiceDate = new Date(invoice?.dueDate).getTime() < date.getTime();

  // ispOwner payment invoice type
  const invoiceType = {
    monthlyServiceCharge: "Monthly Service Charge",
    registration: "Registration Fee",
    smsPurchase: "SMS Purchase Price",
  };

  // api call
  useEffect(() => {
    // get ispOwner netFee support api
    getIspOwnerNetFeeSupport(dispatch, setIsloading);

    // get ispOwner data api
    getIspOwnerData(dispatch, ispOwnerId, setIsloading);
  }, []);

  useEffect(() => {
    if (ownerInvoice) {
      setInvoice(ownerInvoice);
    } else {
      setInvoice(state);
    }
  }, [ownerInvoice, state]);

  // ispOwner payment function handler
  const handlePayment = (data) => {
    ispOwnerPayment(data, setIsloading);
  };

  return (
    <>
      <div className="mainContent">
        <div className="container-fluied">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="border border-3 text-center p-4">
                  <div className="invoice_title">
                    <h1>{invoiceType[invoice.type]}</h1>
                  </div>

                  <div className="support_document my-3">
                    {invoice?.type === "smsPurchase" ? (
                      <p>
                        Without a package, the per-SMS cost may be higher
                        compared to purchasing in bulk.This option offers
                        flexibility as you only for the SMS you actually
                        use.Thank you for you purchase of SMS. I'm processing
                        the payment now. We appreciate your business.
                      </p>
                    ) : (
                      <p>
                        We hope you are well. This message is to remind you that
                        the payment due date for invoice was&nbsp;
                        <span className="text-danger">
                          {moment(invoice.dueDate).format(
                            "DD-MM-YYYY hh:mm:ss A"
                          )}
                        </span>
                        , and we have not yet received the payment. Please
                        arrange to pay this invoice as soon as possible to avoid
                        any disruption to our service.
                      </p>
                    )}
                  </div>

                  <Card className="payment_card">
                    <Card.Body>
                      <Card.Text>
                        <p className="payment_title">Total Amount</p>
                        <h1 className="payment_amount">৳{invoice?.amount}</h1>
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <img
                    className="sslimg mb-3"
                    alt="ssl"
                    src="./assets/img/ssl2.png"
                    height="120px"
                    width="600px"
                  />

                  <div className="d-flex justify-content-center align-items-center">
                    <div className="align-items-center">
                      <input
                        className="form-check-input"
                        onChange={() => setAgreed(!isAgreed)}
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor="vehicle1"
                      >
                        I read and agree to the
                      </label>
                    </div>
                    <NavLink
                      target="_blank"
                      style={{ margin: "1px" }}
                      className={"navnew"}
                      to={"/terms-conditions"}
                    >
                      <p className="newLink">Terms & Conditions</p>
                    </NavLink>
                    ,
                    <NavLink
                      target="_blank"
                      style={{ marginRight: "5px" }}
                      className={"navnew"}
                      to={"/privacy-policy"}
                    >
                      <p className="newLink">Privacy Policy</p>
                    </NavLink>
                    and
                    <NavLink
                      target="_blank"
                      style={{ marginLeft: "5px" }}
                      className={"navnew"}
                      to={"/return-and-refund-policy"}
                    >
                      <p className="newLink">Return & Refund Policy</p>
                    </NavLink>
                  </div>

                  <div className="displayGrid1 d-flex justify-content-center mt-3">
                    {!invoiceDate && (
                      <button
                        type="button"
                        className="btn btn-secondary fw-bold"
                        disabled={isLoading}
                        onClick={() => navigate("/netfee")}
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      className="btn btn-primary fw-bold"
                      disabled={!isAgreed}
                      style={{ cursor: !isAgreed ? "not-allowed" : "pointer" }}
                      onClick={() => handlePayment(invoice)}
                    >
                      {isLoading ? <Loader /> : "Continue"}
                    </button>
                  </div>

                  <ActiveSupportNumber />
                </div>
              </FourGround>
            </FontColor>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcountPayment;
