import React, { useEffect, useState } from "react";
import { Clock, Telephone, Whatsapp } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";

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
                      Your account has been suspended for violating our terms of
                      service.
                    </p>
                    <p>Please contact support for further assistance.</p>
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
                              <p className="d-flex justify-content-center align-items-center fw-bold ">
                                {val.name}
                                <div className="d-flex align-items-center ms-4 gap-1">
                                  <Clock className="support_icon text-primary" />
                                  <p className="fw-bold fs-6 text-danger">
                                    {val.end}
                                  </p>
                                </div>
                              </p>
                              <p>{val.mobile1}</p>
                            </span>
                          </div>

                          <div className="support_media">
                            <Telephone className="support_icon text-primary" />
                            <Whatsapp className="support_icon text-success" />
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
                          <Telephone className="support_icon text-primary" />
                          <Whatsapp className="support_icon text-success" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3>OR</h3>

                    <button
                      type="button"
                      className="btn btn-success fs-5 text"
                      onClick={() => {
                        dispatch(showModal(invoice));
                      }}
                    >
                      PAY NOW
                    </button>
                  </div>
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
