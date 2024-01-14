import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {
  Cash,
  Collection,
  Envelope,
  GeoAltFill,
  GeoFill,
  Key,
  PencilSquare,
  Person,
  PersonVcard,
  PhoneFill,
  Trash3Fill,
} from "react-bootstrap-icons";
import { Card, CloseButton, Modal, ModalBody } from "react-bootstrap";

// custome hooks import
import useISPowner from "../../../hooks/useISPOwner";

//internal import
import "../customer.css";
import { FontColor } from "../../../assets/js/theme";
import FormatNumber from "../../../components/common/NumberFormat";
import { editCustomer, getCustomer } from "../../../features/apiCallReseller";
import { badge } from "../../../components/common/Utils";
import { getConnectionFee } from "../../../features/apiCalls";
import CustomerEdit from "../../../reseller/Customer/customerCRUD/CustomerEdit";
import CustomerBillReport from "./CustomerBillReport";
import CustomerBillCollect from "../customerCRUD/CustomerBillCollect";
import ProfileDelete from "../../../pages/Customer/ProfileDelete";
import PasswordReset from "../../../components/modals/passwordReset/PasswordReset";
import CustomerMessage from "../../../pages/Customer/customerCRUD/CustomerMessage";
import { getOwnerUsers } from "../../../features/getIspOwnerUsersApi";

const CustomerDetails = ({ show, setShow, customerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const {
    role,
    ispOwnerId,
    bpSettings,
    userData,
    resellerData,
    permissions,
    permission,
  } = useISPowner();

  // get mikrotiks
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  //get reseller all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // get reseller subAreas form reseller data
  const subAreas = useSelector((state) => state?.area?.area);

  // get customer connection fee due form redux store
  const connectionFeeDue = useSelector(
    (state) => state.customer.connectionFeeDue
  );

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  // single customer data
  const data = customer.find((item) => item.id === customerId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // profile option state
  const [profileOption, setProfileOption] = useState(
    permission?.customerEdit || permissions?.customerEdit
      ? "profileEdit"
      : data?.monthlyFee > 0 &&
        ((role === "reseller" && permission?.customerRecharge) ||
          (role === "collector" &&
            resellerData.permission?.customerRecharge &&
            permissions?.billPosting))
      ? "recharge"
      : data?.mobile && (role === "reseller" || permissions?.sendSMS)
      ? "message"
      : "passwordReset"
  );

  // modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [modalShow, setModalShow] = useState(false);

  // user id state
  const [userId, setUserId] = useState("");

  useEffect(() => {
    customer.length === 0 && getCustomer(dispatch, resellerId, setIsLoading);

    // get ispOwner & staffs
    getOwnerUsers(dispatch, ispOwnerId);

    //get customer paid connection fee
    getConnectionFee(dispatch, customerId);
  }, [customerId]);

  // modal close handler
  const handleClose = () => setShow(false);

  // customer area subarea find
  const customerAreaSubareaFind = useMemo(() => {
    // customer subArea find
    const findSubarea = subAreas?.find((val) => val.id === data?.subArea);
    return { findSubarea };
  }, [subAreas, data]);

  // mikrotik find
  const getMikrotik = (id) => {
    const mikrotik = mikrotiks.find((val) => val?.id === id);
    return mikrotik;
  };

  // customer creator find
  const getCustomerCreatedBy = (userId) => {
    if (userId) {
      const findCreator = ownerUsers.find((id) => id[userId]);
      return findCreator[userId];
    }
  };

  // customer status & auto connection update hadnle
  const statusAutoConnectionUpdateHandler = (value, e, update) => {
    let data;

    // status update data
    if (update === "status" && e?.detail == 2) {
      data = {
        ...value,
        singleCustomerID: value?.id,
        status: value?.status === "active" ? "inactive" : "active",
      };
    }

    // auto connection update data
    if (update === "auto") {
      data = {
        ...value,
        singleCustomerID: value?.id,
        autoDisable: !value?.autoDisable,
        reseller: value?.reseller,
      };
    }

    data && editCustomer(dispatch, data, setIsLoading, "", update);
  };

  return (
    <>
      <Modal
        show={data && show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <ModalBody>
          <div>
            <Card className="clintSetting shadow-sm mb-3 bg-white rounded">
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
                  {role === "reseller" && permission.customerDelete && (
                    <div
                      className="profileDelete"
                      onClick={() => {
                        setModalStatus("profileDelete");
                        setModalShow(true);
                        setShow(false);
                      }}
                    >
                      <Trash3Fill title={t("deleteProfile")} />
                      <p id="delete_profile">{t("deleteProfile")}</p>
                    </div>
                  )}

                  <CloseButton onClick={handleClose} className="close_Btn" />
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
                    <p>{data?.pppoe?.name}</p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <p class="vr_line vr ms-2" />

                  <div>
                    <div className="d-flex gap-3">
                      <GeoFill />
                      <p>{customerAreaSubareaFind?.findSubarea?.name}</p>
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
                  <p class="vr_line vr ms-2" />

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
            <div className="displayGridManual6_4 setting_details m-0">
              <Card className="displayGridVertical5_5 details_setting border border-2 shadow-none">
                {/* customer profile setting start  */}

                <div className="clintProfile profile_details client_details shadow-sm rounded">
                  <Card.Title className="clintTitle clint_profile_setting">
                    <h5 className="profileInfo">{t("profileSetting")}</h5>
                  </Card.Title>

                  <Card.Body>
                    <FontColor id="clintSetting">
                      {/* customer profile update */}
                      {(permission?.customerEdit ||
                        permissions?.customerEdit) && (
                        <li
                          className="profileSetting"
                          onClick={() => setProfileOption("profileEdit")}
                          id={
                            profileOption === "profileEdit"
                              ? "activeSetting"
                              : ""
                          }
                        >
                          <div className="profileOptions">
                            <PencilSquare size={22} />
                          </div>
                          <span className="options_name">
                            {t("updateProfile")}
                          </span>
                        </li>
                      )}

                      {data?.monthlyFee > 0 &&
                        ((role === "reseller" &&
                          permission?.customerRecharge) ||
                          (role === "collector" &&
                            resellerData.permission?.customerRecharge &&
                            permissions?.billPosting)) && (
                          <>
                            {/* customer bill colleciton */}

                            <li
                              className="profileSetting"
                              onClick={() => setProfileOption("recharge")}
                              id={
                                profileOption === "recharge"
                                  ? "activeSetting"
                                  : ""
                              }
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
                              className="profileSetting"
                              onClick={() => setProfileOption("report")}
                              id={
                                profileOption === "report"
                                  ? "activeSetting"
                                  : ""
                              }
                            >
                              <div className="profileOptions">
                                <Collection size={22} />
                              </div>
                              <span className="options_name">
                                {t("report")}
                              </span>
                            </li>
                          </>
                        )}

                      {/* customer single message  */}
                      {data?.mobile &&
                        (role === "reseller" || permissions?.sendSMS) && (
                          <li
                            className="profileSetting"
                            onClick={() => setProfileOption("message")}
                            id={
                              profileOption === "message" ? "activeSetting" : ""
                            }
                          >
                            <div className="profileOptions">
                              <Envelope size={22} />
                            </div>
                            <span className="options_name">{t("message")}</span>
                          </li>
                        )}

                      {/* customer login password reset */}
                      <li
                        className="profileSetting"
                        onClick={() => {
                          setModalStatus("passwordReset");
                          setUserId(data?.user);
                          setModalShow(true);
                        }}
                        id={modalShow && "activeSetting"}
                      >
                        <div className="profileOptions">
                          <Key size={22} />
                        </div>
                        <span className="options_name">
                          {t("passwordReset")}
                        </span>
                      </li>
                    </FontColor>
                  </Card.Body>
                </div>

                {/* customer profile setting end  */}
                {/* customer details view start */}

                <div className="clintProfile profile_details client_details shadow-sm rounded overflow-auto">
                  <Card.Title className="clintTitle mb-0">
                    <h5 className="profileInfo">{t("profileDetail")}</h5>
                  </Card.Title>

                  <Card.Body>
                    <FontColor>
                      <div>
                        {bpSettings?.hasMikrotik && (
                          <div className="displayGridHorizontalFill5_5 profileDetails">
                            <p>{t("mikrotik")}</p>
                            <p>{data && getMikrotik(data.mikrotik)?.name}</p>
                          </div>
                        )}

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("status")}</p>
                          {data?.status !== "expired" ? (
                            <div>
                              {role === "reseller" ||
                              (data?.status === "active" &&
                                permissions?.customerDeactivate) ? (
                                <p
                                  onClick={(e) =>
                                    statusAutoConnectionUpdateHandler(
                                      data,
                                      e,
                                      "status"
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  {badge(data?.status)}
                                </p>
                              ) : role === "reseller" ||
                                (data?.status === "inactive" &&
                                  permissions?.customerActivate) ? (
                                <p
                                  onClick={(e) =>
                                    statusAutoConnectionUpdateHandler(
                                      data,
                                      e,
                                      "status"
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  {badge(data?.status)}
                                </p>
                              ) : (
                                <p>{badge(data?.status)}</p>
                              )}
                            </div>
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
                          <p>৳{FormatNumber(data?.monthlyFee)}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("balance")}</p>
                          <p>৳{FormatNumber(data?.balance)}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("package")}</p>
                          <p>{data?.pppoe?.profile}</p>
                        </div>

                        {bpSettings?.hasMikrotik && (
                          <div className="displayGridHorizontalFill5_5 profileDetails">
                            <p>{t("autoConnection")}</p>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id={data?.id}
                                checked={data?.autoDisable}
                                onClick={(e) =>
                                  (permission?.customerAutoDisableEdit ||
                                    resellerData.permission
                                      ?.customerAutoDisableEdit) &&
                                  statusAutoConnectionUpdateHandler(
                                    data,
                                    e,
                                    "auto"
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}

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
                          <p>{t("connectionFee")}</p>
                          <p>৳{FormatNumber(data?.connectionFee || 0)}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("connectionFeeDue")}</p>
                          <p>
                            ৳
                            {FormatNumber(
                              connectionFeeDue >= 0 &&
                                data.connectionFee - connectionFeeDue
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

                        {data?.createdBy && (
                          <div className="displayGridHorizontalFill5_5 profileDetails">
                            <p>{t("createdBy")}</p>
                            <p>{`${
                              getCustomerCreatedBy(data?.createdBy)?.name
                            } (${
                              getCustomerCreatedBy(data?.createdBy)?.role
                            })`}</p>
                          </div>
                        )}

                        {data?.referenceName && (
                          <div className="displayGridHorizontalFill5_5 profileDetails">
                            <p>{t("referenceName")}</p>
                            <p>{data?.referenceName}</p>
                          </div>
                        )}

                        {data?.referenceMobile && (
                          <div className="displayGridHorizontalFill5_5 profileDetails">
                            <p>{t("referenceMobile")}</p>
                            <p>{data?.referenceMobile}</p>
                          </div>
                        )}

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("queueType")}</p>
                          <p>{data?.queue?.type}</p>
                        </div>
                      </div>
                    </FontColor>
                  </Card.Body>
                </div>

                {/* customer details view end */}
              </Card>
              <Card className="border border-2 shadow-none overflow-auto">
                {profileOption === "profileEdit" ? (
                  <CustomerEdit
                    customerId={customerId}
                    setProfileOption={setProfileOption}
                  />
                ) : profileOption === "recharge" ? (
                  <CustomerBillCollect
                    customerId={customerId}
                    customerData={data}
                  />
                ) : profileOption === "report" ? (
                  <CustomerBillReport customerId={customerId} />
                ) : (
                  <CustomerMessage customerId={customerId} page={"customer"} />
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
          status="reseller"
          page="pppoe"
        />
      )}

      {/* password reset modal */}
      {modalStatus === "passwordReset" && (
        <PasswordReset
          show={modalShow}
          setShow={setModalShow}
          userId={userId}
        />
      )}
    </>
  );
};

export default CustomerDetails;
