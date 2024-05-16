import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "react-bootstrap";

// custome hooks import
import useISPowner from "../../../hooks/useISPOwner";

// internal import
import { FontColor, FourGround } from "../../../assets/js/theme";
import "./style.css";
import {
  getIspOwnerData,
  getIspOwnerNetFeeSupport,
} from "../../../features/apiCalls";
import { badge } from "../../../components/common/Utils";
import ActiveSupportNumber from "../../../pages/netFeeSupport/supportOpration/ActiveSupportNumber";
import { useNavigate } from "react-router-dom";

const AcountWorning = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get user & current user data form useISPOwner hooks
  const { ispOwnerId, ispOwnerData } = useISPowner();

  //get payment invoice to check expiration
  const invoice = useSelector((state) => state.invoice.invoice);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // get ispOwner payment invoice type
  const invoiceType = {
    monthlyServiceCharge: "Monthly Service Charge",
    registration: "Registration",
  };

  // get payment status
  const paymentStatus = {
    paid: "Paid",
    unpaid: "Unpaid",
    expired: "Expired",
  };

  // api call
  useEffect(() => {
    // get ispOwner netFee support api
    getIspOwnerNetFeeSupport(dispatch, setIsLoading);

    // get ispOwner data api
    getIspOwnerData(dispatch, ispOwnerId, setIsLoading);
  }, []);

  return (
    <>
      <div className="mainContent">
        <div className="container-fluied">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="border border-3 text-center p-4">
                  {ispOwnerData.status === "new" ? (
                    <h2 className="acount_title border-primary text-primary">
                      PLEASE ACTIVATE
                    </h2>
                  ) : (
                    <h2 className="acount_title">ACCOUNT SUSPENDED</h2>
                  )}

                  <div className="support_document">
                    {ispOwnerData.status === "new" ? (
                      <>
                        <p>Your Acount is not Active yet!</p>
                      </>
                    ) : (
                      <p>
                        Your account has been suspended for violating our terms
                        and service.
                      </p>
                    )}
                    <p>Please contact support for further assistance.</p>

                    <p className="text-success">Pay to Activate your Account</p>

                    {invoice !== null && (
                      <Card className="support">
                        <Card.Body>
                          <Card.Title className="clintTitle p-2">
                            {invoiceType[invoice?.type]}
                          </Card.Title>
                          <Card.Text>
                            <div>
                              <div className="displayGridHorizontalFill5_5 profileDetails">
                                <p>Amount</p>
                                <p>৳{invoice?.amount}</p>
                              </div>
                              <div className="displayGridHorizontalFill5_5 profileDetails">
                                <p>Payment Status</p>
                                <p>{badge(paymentStatus[invoice?.status])}</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="btn btn-success border-0 fs-5 fw-bold mt-3"
                              onClick={() =>
                                navigate("/payment", { state: invoice })
                              }
                            >
                              PAY NOW
                            </button>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    )}
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

export default AcountWorning;
