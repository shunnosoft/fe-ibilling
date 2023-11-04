import React, { useEffect, useMemo, useState } from "react";
import { Card, CloseButton, Modal, ModalBody } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Cash,
  Collection,
  Envelope,
  GeoAltFill,
  GeoFill,
  PencilSquare,
  Person,
  PersonVcard,
  PhoneFill,
  Trash3Fill,
} from "react-bootstrap-icons";
import moment from "moment";

// internal import
import useISPowner from "../../../hooks/useISPOwner";
import HotspotCustomerRecharge from "./HotspotCustomerRecharge";
import { FontColor } from "../../../assets/js/theme";
import { badge } from "../../../components/common/Utils";
import ProfileDelete from "../../Customer/ProfileDelete";
import CustomerBillReport from "../../Customer/customerCRUD/CustomerBillReport";
import CustomerMessage from "../../Customer/customerCRUD/CustomerMessage";
import HotspotCustomerEdit from "./HotspotCustomerEdit";
import {
  editHotspotCustomer,
  getHotspotCustomer,
} from "../../../features/hotspotApi";

const CustomerDetails = ({ show, setShow, customerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner
  const { ispOwnerId, bpSetting } = useISPowner();

  //get mikrotik
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get hotspot customer
  const customer = useSelector((state) => state.hotspot.customer);

  //get all areas
  const areas = useSelector((state) => state.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  // single customer find form all hotspot customers
  const data = customer.find((val) => val.id === customerId);

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  // modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [modalShow, setModalShow] = useState(false);

  // profile option state
  const [profileOption, setProfileOption] = useState("profileEdit");

  useEffect(() => {
    customer.length === 0 &&
      getHotspotCustomer(dispatch, ispOwnerId, setIsLoading);
  }, [customerId]);

  // modal close handle
  const handleClose = () => {
    setShow(false);
    setProfileOption("profileEdit");
  };

  // customer area subarea find
  const customerAreaSubareaFind = useMemo(() => {
    // customer subArea find
    const findSubarea = subAreas.find((val) => val.id === data?.subArea);

    // customer area find
    const findArea = areas.find((val) => val.id === findSubarea?.area);

    return { findArea, findSubarea };
  }, [areas, subAreas, customer]);

  // mikrotik find
  const getMikrotik = (id) => {
    const mikrotik = mikrotiks.find((val) => val?.id === id);
    return mikrotik;
  };

  // customer status update handler
  const statusUpdateHandler = (value, e, update) => {
    let data;

    // status update data
    if (update === "status" && e?.detail == 2) {
      data = {
        ...value,
        status: value?.status === "active" ? "inactive" : "active",
      };
    }

    //customer update api
    data &&
      editHotspotCustomer(dispatch, data, value?.id, setIsLoading, "", update);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalBody>
          <div className="container">
            <Card className="clintProfile shadow-sm mb-4 bg-white rounded">
              <Card.Title className="clintTitle">
                <div className="d-flex align-items-center">
                  <img
                    src="./assets/img/noAvater.jpg"
                    alt=""
                    className="clintPotos"
                  />

                  <p className="clintName">{data?.name}</p>
                </div>

                <div className="d-flex justify-content-center align-items-center p-3">
                  <div
                    className="profileDelete"
                    onClick={() => {
                      setModalStatus("profileDelete");
                      setModalShow(true);
                      setShow(false);
                    }}
                  >
                    <Trash3Fill />
                    <p>{t("deleteProfile")}</p>
                  </div>

                  <CloseButton onClick={handleClose} />
                </div>
              </Card.Title>
              <Card.Body
                className="displayGrid3 text-secondary"
                style={{ fontSize: "18px" }}
              >
                <div>
                  <div className="d-flex gap-3">
                    <PersonVcard
                      size={22}
                      className="text-warning"
                      title={t("customerId")}
                    />
                    <p>{data?.customerId}</p>
                  </div>

                  <div className="d-flex gap-3">
                    <Person
                      size={22}
                      className="text-primary"
                      title={t("customerId")}
                    />
                    <p>{data?.hotspot?.name}</p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <p class="vr ms-2" />

                  <div>
                    <div className="d-flex gap-3">
                      <GeoFill />
                      <p>
                        {customerAreaSubareaFind.findArea?.name},&nbsp;
                        {customerAreaSubareaFind.findSubarea?.name}
                      </p>
                    </div>

                    {data?.address && (
                      <div className="d-flex gap-3">
                        <GeoAltFill />
                        <p>{data?.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <p class="vr ms-2" />

                  <div>
                    <div className="d-flex gap-3">
                      <PhoneFill />
                      <p>{data?.mobile}</p>
                    </div>

                    <div className="d-flex gap-3">
                      <Cash />
                      <p>
                        {moment(data?.billingCycle).format(
                          "MMM DD YYYY hh:mm A"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <div className="displayGridManual6_4 clintSetting">
              <Card className="displayGridVertical5_5 border border-2 shadow-none mb-4">
                {/* customer profile setting start  */}

                <div className="clintProfile shadow-sm rounded">
                  <Card.Title className="clintTitle">
                    <h5 className="profileInfo">{t("profileSetting")}</h5>
                  </Card.Title>

                  <Card.Body>
                    <FontColor>
                      {/* customer profile update */}
                      <li
                        className="sidebarItems"
                        onClick={() => setProfileOption("profileEdit")}
                        id={profileOption === "profileEdit" ? "active" : ""}
                      >
                        <div className="profileOptions">
                          <PencilSquare size={22} />
                        </div>
                        <span className="options_name">
                          {t("updateProfile")}
                        </span>
                      </li>

                      {data?.monthlyFee > 0 && (
                        <>
                          {/* customer bill colleciton */}
                          <li
                            className="sidebarItems"
                            onClick={() => setProfileOption("recharge")}
                            id={profileOption === "recharge" ? "active" : ""}
                          >
                            <div className="profileOptions">
                              <Cash size={22} />
                            </div>
                            <span className="options_name">
                              {t("recharge")}
                            </span>
                          </li>

                          {/* customer bill collection report */}
                          <li
                            className="sidebarItems"
                            onClick={() => setProfileOption("report")}
                            id={profileOption === "report" ? "active" : ""}
                          >
                            <div className="profileOptions">
                              <Collection size={22} />
                            </div>
                            <span className="options_name">{t("report")}</span>
                          </li>
                        </>
                      )}

                      {/* customer single message  */}
                      {data?.mobile && (
                        <li
                          className="sidebarItems"
                          onClick={() => setProfileOption("message")}
                          id={profileOption === "message" ? "active" : ""}
                        >
                          <div className="profileOptions">
                            <Envelope size={22} />
                          </div>
                          <span className="options_name">{t("message")}</span>
                        </li>
                      )}
                    </FontColor>
                  </Card.Body>
                </div>

                {/* customer profile setting end  */}
                {/* customer details view start */}

                <div className="clintProfile shadow-sm rounded overflow-auto">
                  <Card.Title className="clintTitle mb-0">
                    <h5 className="profileInfo">{t("profileDetail")}</h5>
                  </Card.Title>

                  <Card.Body>
                    <FontColor>
                      <div>
                        {bpSetting?.hasMikrotik && (
                          <div className="displayGridHorizontalFill5_5 profileDetails">
                            <p>{t("mikrotik")}</p>
                            <p>
                              {customer && getMikrotik(data?.mikrotik)?.name}
                            </p>
                          </div>
                        )}

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("status")}</p>
                          {data?.status !== "expired" ? (
                            <p
                              onClick={(e) =>
                                statusUpdateHandler(data, e, "status")
                              }
                              style={{ cursor: "pointer" }}
                            >
                              {badge(data?.status)}
                            </p>
                          ) : (
                            <p>{badge(data?.status)}</p>
                          )}
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("paymentStatus")}</p>
                          <p>{badge(data?.paymentStatus)}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("monthlyFee")}</p>
                          <p>৳{data?.monthlyFee}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("balance")}</p>
                          <p>৳{data?.balance}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("package")}</p>
                          <p>{data?.hotspot?.profile}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("billingDate")}</p>
                          <p>
                            {moment(data?.billingCycle).format(
                              "MMM DD YYYY hh:mm A"
                            )}
                          </p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("promiseDate")}</p>
                          <p>
                            {moment(data?.promiseDate).format(
                              "MMM DD YYYY hh:mm A"
                            )}
                          </p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("connectionDate")}</p>
                          <p>
                            {moment(data?.connectionDate).format(
                              "MMM DD YYYY hh:mm A"
                            )}
                          </p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("createDate")}</p>
                          <p>
                            {moment(data?.createdAt).format(
                              "MMM DD YYYY hh:mm A"
                            )}
                          </p>
                        </div>
                      </div>
                    </FontColor>
                  </Card.Body>
                </div>

                {/* customer details view end */}
              </Card>

              {/* customer profile update,recharge,report and message modal card */}
              <Card className="border border-2 shadow-none mb-4 overflow-auto">
                {profileOption === "profileEdit" ? (
                  <HotspotCustomerEdit
                    customerId={customerId}
                    setProfileOption={setProfileOption}
                  />
                ) : profileOption === "recharge" ? (
                  <HotspotCustomerRecharge customerId={customerId} />
                ) : profileOption === "report" ? (
                  <CustomerBillReport
                    customerId={customerId}
                    setModalState={setShow}
                  />
                ) : (
                  <CustomerMessage customerId={customerId} page="customer" />
                )}
              </Card>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* profile delete modal */}
      {modalStatus === "profileDelete" && (
        <ProfileDelete
          modalShow={modalShow}
          setModalShow={setModalShow}
          customerId={customerId}
          setShow={setShow}
          status="ispOwner"
          page="hotspot"
        />
      )}
    </>
  );
};

export default CustomerDetails;
