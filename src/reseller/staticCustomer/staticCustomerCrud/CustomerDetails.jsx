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
  Key,
  PencilSquare,
  Person,
  PersonVcard,
  PhoneFill,
  Trash3Fill,
} from "react-bootstrap-icons";
import moment from "moment";

//internal import
import useISPowner from "../../../hooks/useISPOwner";
import {
  getStaticCustomerApi,
  updateResellerStaticCustomer,
} from "../../../features/apiCallReseller";
import { FontColor } from "../../../assets/js/theme";
import { badge } from "../../../components/common/Utils";
import FormatNumber from "../../../components/common/NumberFormat";
import { getConnectionFee } from "../../../features/apiCalls";
import StaticCustomerEdit from "./CustomerEdit";
import CustomerBillCollect from "./CustomerBillCollect";
import CustomerBillReport from "../../Customer/customerCRUD/CustomerBillReport";
import CustomerMessage from "../../../pages/Customer/customerCRUD/CustomerMessage";
import ProfileDelete from "../../../pages/Customer/ProfileDelete";
import PasswordReset from "../../../components/modals/passwordReset/PasswordReset";
import { getOwnerUsers } from "../../../features/getIspOwnerUsersApi";

const CustomerDetails = ({ show, setShow, customerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner
  const {
    role,
    ispOwnerId,
    bpSettings,
    resellerData,
    permission,
    permissions,
    currentUser,
  } = useISPowner();

  // get mikrotiks
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  // get reseller static customer form redux store
  const customer = useSelector((state) => state?.customer?.staticCustomer);

  //get customer subareas form redux
  const subAreas = useSelector((state) => state?.area?.area);

  // get all packages
  const allPackages = useSelector((state) => state.package.allPackages);

  // find single static customer
  const data = customer.find((val) => val.id === customerId);

  //loading state
  const [isLoading, setIsLoading] = useState(false);

  // modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [modalShow, setModalShow] = useState(false);

  // profile option state
  const [profileOption, setProfileOption] = useState("profileEdit");

  // customer due connection fee state
  const [paidConnectionFee, setPaidConnectionFee] = useState(0);

  // user id state
  const [userId, setUserId] = useState("");

  // get customer api call
  useEffect(() => {
    if (role === "reseller") {
      customer.length === 0 &&
        getStaticCustomerApi(dispatch, currentUser.reseller?.id, setIsLoading);
    }
    if (role === "collector") {
      customer.length === 0 &&
        getStaticCustomerApi(
          dispatch,
          currentUser.collector?.reseller,
          setIsLoading
        );
    }

    // get ispOwner & staffs
    getOwnerUsers(dispatch, ispOwnerId);

    //get customer paid connection fee
    getConnectionFee(customerId, setPaidConnectionFee);
  }, [customerId]);

  //modal close handler
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

  // customer current package find
  const customerPackageFind = (pack) => {
    const findPack = allPackages.find((item) => item.id.includes(pack));
    return findPack;
  };

  // customer creator find
  const getCustomerCreatedBy = (userId) => {
    const findCreator = ownerUsers.find((id) => id[userId]);
    return findCreator[userId];
  };

  // customer status & auto connection update hadnle
  const statusAutoConnectionUpdateHandler = (value, e, update) => {
    let data;

    // status update data
    if (update === "status" && e?.detail == 2) {
      data = {
        ...value,
        status: value?.status === "active" ? "inactive" : "active",
      };
    }

    // auto connection update data
    if (update === "auto") {
      data = {
        ...value,

        autoDisable: !value?.autoDisable,
      };
    }

    data &&
      updateResellerStaticCustomer(
        value?.id,
        value?.reseller,
        dispatch,
        data,
        setIsLoading,
        update
      );
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
            {/* customer profile information title start */}

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
                <div className="row gy-2">
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
                    <p>
                      {data?.userType === "firewall-queue"
                        ? data?.queue.address
                        : data?.userType === "core-queue"
                        ? data?.queue.srcAddress
                        : data?.queue.target}
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <p class="vr_line vr ms-2" />

                  <div className="row gy-2">
                    <div className="d-flex gap-3">
                      <GeoFill />
                      <p>{customerAreaSubareaFind.findSubarea?.name}</p>
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

                  <div className="row gy-2">
                    {data?.mobile && (
                      <div className="d-flex gap-3">
                        <PhoneFill />
                        <p>{data?.mobile}</p>
                      </div>
                    )}

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

            {/* customer profile information title end */}
            {/* customer profile settings start */}

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

                      {data?.monthlyFee > 0 && (
                        <>
                          {/* customer bill colleciton */}
                          {((role === "reseller" &&
                            permission?.customerRecharge) ||
                            (role === "collector" &&
                              resellerData.permission?.customerRecharge &&
                              permissions?.billPosting)) && (
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
                          )}

                          {/* customer bill collection report */}
                          {((role === "reseller" &&
                            permission?.customerRecharge) ||
                            (role === "collector" &&
                              resellerData.permission?.customerRecharge &&
                              permissions?.billPosting)) && (
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
                          )}
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
                          <p>৳{data?.monthlyFee}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("balance")}</p>
                          <p>৳{data?.balance}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("package")}</p>
                          {data &&
                            customerPackageFind(data?.mikrotikPackage)?.name}
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
                          <p>৳{data?.connectionFee}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("connectionFeeDue")}</p>
                          <p>
                            ৳
                            {FormatNumber(
                              data?.connectionFee - paidConnectionFee &&
                                paidConnectionFee
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

              {/* customer profile update,recharge,report and message modal card */}
              <Card className="border border-2 shadow-none overflow-auto">
                {profileOption === "profileEdit" ? (
                  <StaticCustomerEdit
                    customerId={customerId}
                    setProfileOption={setProfileOption}
                  />
                ) : profileOption === "recharge" ? (
                  <CustomerBillCollect
                    customerId={customerId}
                    customerData={data}
                    status="static"
                  />
                ) : profileOption === "report" ? (
                  <CustomerBillReport
                    customerId={customerId}
                    setModalState={setShow}
                  />
                ) : (
                  <CustomerMessage customerId={customerId} page={"customer"} />
                )}
              </Card>
            </div>

            {/* customer profile settings end */}
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
          page="static"
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
