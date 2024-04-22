import React, { useEffect, useState } from "react";
import { Clock, Dash, Telephone, Whatsapp } from "react-bootstrap-icons";
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
import { showModal } from "../../../features/uiSlice";
import { badge } from "../../../components/common/Utils";

const AcountWorning = () => {
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerData, ispOwnerId } = useISPowner();

  // netFee support Numbers
  const supportNumbers = useSelector(
    (state) => state.netFeeSupport?.supportCall
  );

  //get payment invoice to check expiration
  const invoice = useSelector((state) => state.invoice.invoice);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const invoiceType = {
    monthlyServiceCharge: "Monthly Service Charge",
    registration: "Registration",
  };

  const paymentStatus = {
    paid: "Paid",
    unpaid: "Unpaid",
    expired: "Expired",
  };

  // api call
  useEffect(() => {
    // get ispOwner netFee support api
    supportNumbers.length === 0 &&
      getIspOwnerNetFeeSupport(dispatch, setIsLoading);

    // get ispOwner data api
    Object.keys(ispOwnerData).length === 0 &&
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
                  <h2 className="acount_title">ACCOUNT SUSPENDED</h2>

                  <div className="support_document">
                    <p>
                      Your account has been suspended for violating our terms
                      and service.
                    </p>
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
                              onClick={() => {
                                dispatch(showModal(invoice));
                              }}
                            >
                              PAY NOW
                            </button>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    )}
                  </div>

                  {["ispOwner", "manager"].includes(role) ? (
                    <div className="support">
                      <h4 className="support_title p-1">SUPPORT TEAM</h4>

                      {supportNumbers?.map((val) => (
                        <div className="support_team shadow-sm bg-body rounded gap-2">
                          <div className="d-flex align-items-center">
                            <img
                              src="./assets/img/noAvater.jpg"
                              alt=""
                              className="support_person"
                            />

                            <span className="support_info">
                              <p className="fw-bold">{val.name}</p>
                              <p>{val.mobile1}</p>
                            </span>
                          </div>

                          <div className="d-flex flex-column justify-content-center align-items-end gap-1">
                            <span className="d-flex align-items-center gap-2">
                              <Clock className="support_icon text-primary" />
                              <div className="d-flex align-items-center">
                                <p className="fw-bold fs-6 text-success">
                                  {val.start}
                                </p>
                                <Dash />
                                <p className="fw-bold fs-6 text-danger">
                                  {val.end}
                                </p>
                              </div>
                            </span>

                            <span>
                              <Telephone className="support_icon text-primary me-3" />
                              <Whatsapp className="support_icon text-success" />
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="support">
                      <h4 className="support_title p-1">CONTACT YOUR ADMIN</h4>

                      <div className="support_team shadow-sm bg-body rounded gap-2">
                        <div className="d-flex align-items-center">
                          <img
                            src="./assets/img/noAvater.jpg"
                            alt=""
                            className="support_person"
                          />

                          <span className="support_info">
                            <p className="fw-bold ">{ispOwnerData.name}</p>
                            <p>{ispOwnerData.mobile}</p>
                          </span>
                        </div>

                        <div className="support_media">
                          <Telephone className="support_icon text-primary me-3" />
                          <Whatsapp className="support_icon text-success" />
                        </div>
                      </div>
                    </div>
                  )}
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
