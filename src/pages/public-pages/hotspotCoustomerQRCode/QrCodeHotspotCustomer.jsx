import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Card, InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

// internal import
import "./qrCodeHotspot.css";
import CustomerCreate from "./hotspotCustomerPage/CustomerCreate";
import { getIspOwner } from "../../../features/qrCodeApi";
import HotspotPackage from "./hotspotCustomerPage/HotspotPackage";
import {
  getHotspotPublicPackage,
  hotspotUserFind,
} from "../../../features/publicHotspotApi/publicHotspot";
import Loader from "../../../components/common/Loader";
import HotspotUser from "./hotspotCustomerPage/HotspotUser";
import SelfRegistration from "./SelfRegistration";

const QrCodeHotspotCustomer = () => {
  const dispatch = useDispatch();
  const { ispId } = useParams();

  // get customer package form store
  const hotspotUser = useSelector((state) => state.publicSlice?.hotspotUser);

  //===============|| Local State ||===============//

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // ispOwner data
  const [ispInfo, setIspInfo] = useState("");

  // modal handle state
  const [modalStatus, setModalStatus] = useState("package");

  // user mobile number
  const [mobile, setMobile] = useState("");

  //get api call
  useEffect(() => {
    if (ispId) getIspOwner(ispId, setIsLoading, setIspInfo);
  }, [ispId]);

  useEffect(() => {
    if (ispInfo?.id)
      getHotspotPublicPackage(dispatch, ispInfo?.id, setIsLoading);
  }, [ispInfo?.id]);

  // user search handler
  const userSearchMobile = (e) => {
    setMobile(e.target.value);
  };

  // search hotspot user handler
  const searchHotspotUser = () => {
    if (mobile.match(/^(01){1}[3456789]{1}(\d){8}$/g)) {
      hotspotUserFind(dispatch, ispInfo?.id, mobile, setIsLoading);
      setModalStatus("");
    } else {
      return toast.error("Incorrect Mobile Number");
    }
  };

  return (
    <>
      <ToastContainer theme="colored" />

      <div className="createUserPage">
        <div className="w-100">
          <div className="mainPage">
            <Card className="mainCard mb-4 bg-white rounded mw-100">
              <Card.Title className="userTitle p-2">
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <h4 className="company">{ispInfo?.company}</h4>
                  <p className="text-secondary">{ispInfo?.address}</p>
                  <h6 className="text-secondary mb-0">
                    Contact: {ispInfo?.mobile}
                  </h6>
                </div>
              </Card.Title>
              <Card.Body>
                <div className="tableHader">
                  <InputGroup>
                    <input
                      className="form-control shadow-none "
                      type="text"
                      value={mobile}
                      onChange={userSearchMobile}
                      placeholder="Enter Mobile Number"
                    />
                    <InputGroup.Text
                      onClick={searchHotspotUser}
                      style={{ cursor: "pointer" }}
                    >
                      <Search />
                    </InputGroup.Text>
                  </InputGroup>
                </div>

                <div>
                  {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center">
                      <Loader />
                    </div>
                  ) : (
                    <div>
                      {/* search hotspot customer modal */}
                      {!modalStatus &&
                        Object.keys(hotspotUser).length > 0 &&
                        hotspotUser.status !== "new" && (
                          <HotspotUser ispInfo={ispInfo} />
                        )}

                      {hotspotUser.status === "new" && (
                        <SelfRegistration ispInfo={ispInfo} mobile={mobile} />
                      )}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default QrCodeHotspotCustomer;
