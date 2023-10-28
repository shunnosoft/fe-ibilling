import React, { useMemo, useState } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Card, CloseButton, Modal, ModalBody } from "react-bootstrap";
import {
  Cash,
  Collection,
  Envelope,
  Geo,
  GeoAltFill,
  PencilSquare,
  Person,
  PersonVcard,
  TelephoneFill,
  Trash3Fill,
} from "react-bootstrap-icons";

// internal import
import "../customer.css";
import { badge } from "../../../components/common/Utils";
import CustomerEdit from "./CustomerEdit";
import { FontColor } from "../../../assets/js/theme";
import CustomerBillCollect from "./CustomerBillCollect";
import ProfileDelete from "../ProfileDelete";
import CustomerMessage from "./CustomerMessage";
import CustomerBillReport from "./CustomerBillReport";
import { editCustomer } from "../../../features/apiCalls";

export default function CustomerDetails({ show, setShow, customerId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get bpSettings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // get mikrotiks
  const mikrotiks = useSelector((state) => state?.mikrotik?.mikrotik);

  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // find single customer data
  const data = customer.find((item) => item.id === customerId);

  //get all areas
  const areas = useSelector((state) => state.area?.area);

  // get all subarea
  const subAreas = useSelector((state) => state.area?.subArea);

  // loading state
  const [loading, setLoading] = useState(false);

  // modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [modalShow, setModalShow] = useState(false);

  // profile option state
  const [profileOption, setProfileOption] = useState("profileEdit");

  // modal close handler
  const handleClose = () => {
    setShow(false);
    setProfileOption("profileEdit");
  };

  // mikrotik find
  const getMikrotik = (id) => {
    const mikrotik = mikrotiks.find((val) => val?.id === id);
    return mikrotik;
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
      };
    }
    editCustomer(dispatch, data, setLoading, "", update);
  };

  // customer area subarea find
  const customerAreaSubareaFind = useMemo(() => {
    // customer area find
    const findArea = areas.find((val) => val.id === data.area);

    // customer subArea find
    const findSubarea = subAreas.find((val) => val.id === data.subArea);

    return { findArea, findSubarea };
  }, [areas, subAreas, data]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <div className="profile_header">
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
        <ModalBody>
          <div className="container">
            <Card className="clintProfile shadow-sm mb-4 bg-white rounded">
              <Card.Title className="clintTitle">
                <img
                  src="./assets/img/noAvater.jpg"
                  alt=""
                  className="clintPotos"
                />

                <p className="clintName">{data?.name}</p>
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
                  <p class="vr ms-2" />

                  <div>
                    <div className="d-flex gap-3">
                      <Geo />
                      <p>
                        {customerAreaSubareaFind.findArea?.name},
                        {customerAreaSubareaFind.findSubarea?.name}
                      </p>
                    </div>

                    <div className="d-flex gap-3">
                      <GeoAltFill />
                      <p>{data?.address}</p>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <p class="vr ms-2" />

                  <div>
                    <div className="d-flex gap-3">
                      <TelephoneFill />
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
                  <Card.Title className="clintTitle">
                    <h5 className="profileInfo">{t("profileDetail")}</h5>
                  </Card.Title>

                  <Card.Body>
                    <FontColor>
                      <div>
                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("mikrotik")}</p>
                          <p>{data && getMikrotik(data.mikrotik)?.name}</p>
                        </div>

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("status")}</p>
                          {data?.status !== "expired" ? (
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

                        <div className="displayGridHorizontalFill5_5 profileDetails">
                          <p>{t("paymentStatus")}</p>
                          <p>{data?.paymentStatus}</p>
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
                          <p>{data.pppoe?.profile}</p>
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
                  <CustomerEdit
                    customerId={customerId}
                    setProfileOption={setProfileOption}
                  />
                ) : profileOption === "recharge" ? (
                  <CustomerBillCollect
                    single={customerId}
                    customerData={data}
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

            {/* <div className="profileMain">
              <div>
                <h5> {t("customer")}</h5>
                <hr />
                <h6>
                  {t("customerId")} : {data?.customerId}
                </h6>
                <h6>
                  {t("name")} : {data?.name}
                </h6>
                <h6>
                  {t("mobile")} : {data?.mobile}
                </h6>
                <h6>
                  {t("address")} : {data?.address}
                </h6>
                <h6>
                  {t("email")} : {data?.email}
                </h6>
                <h6>
                  {t("createdAt")} :{" "}
                  {moment(data?.createdAt).format("MMM DD YYYY hh:mm A")}
                </h6>
                <h6>
                  {t("NIDno")} : {data?.nid}
                </h6>
                <h6>
                  {t("status")} : {badge(data?.status)}
                </h6>
                <h6>
                  {t("payment")} : {badge(data?.paymentStatus)}
                </h6>
                <h6>
                  {t("monthFee")} : {FormatNumber(data?.monthlyFee)}
                </h6>
                <h6>
                  {t("connectionFee")} : {FormatNumber(data?.connectionFee)}
                </h6>
                <h6>
                  {t("balance")} : {FormatNumber(data?.balance)}
                </h6>
                <h6>
                  {t("billingCycle")} :{" "}
                  {moment(data?.billingCycle).format("MMM DD YYYY hh:mm A")}
                </h6>
                <h6>
                  {t("promiseDate")} :{" "}
                  {moment(data?.promiseDate).format("MMM DD YYYY hh:mm A")}
                </h6>
                <h6>
                  {t("connectionDate")} :{" "}
                  {data?.connectionDate &&
                    moment(data?.connectionDate).format("MMM DD YYYY hh:mm A")}
                </h6>
                {bpSettings?.hasMikrotik && (
                  <h6>
                    {t("automaticConnectionOff")} :{" "}
                    {data?.autoDisable ? "YES" : "NO"}
                  </h6>
                )}
              </div>
              <div>
                <div className="pppoe">
                  <h5>PPPoE</h5>
                  <hr />
                  <h6>
                    {t("userName")} : {data?.pppoe?.name}
                  </h6>
                  <h6>
                    {t("password")} : {data?.pppoe?.password}
                    <br />
                    {t("profile")} : {data?.pppoe?.profile}
                  </h6>
                  <h6>
                    {t("service")} : {data?.pppoe?.service}
                  </h6>
                  <h6>
                    {t("comment")} : {data?.pppoe?.comment}
                  </h6>
                  <hr />
                </div>
                <div className="reference">
                  <h5>{t("reference")}</h5>
                  <hr />
                  <h6>
                    {t("referenceName")} : {data?.referenceName}
                  </h6>
                  <h6>
                    {t("referenceMobile")} : {data?.referenceMobile}
                  </h6>
                  <h6>
                    {t("createdBy")} :{" "}
                    {performer && performer[data?.createdBy].name}
                  </h6>
                  <h6>
                    {t("role")} : {performer && performer[data?.createdBy].role}
                  </h6>
                </div>
              </div>
            </div> */}
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
          page="ispOwner"
        />
      )}
    </>
  );
}
