import React, { useState } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { badge } from "../../../components/common/Utils";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { getOwnerUsers } from "../../../features/getIspOwnerUsersApi";
import {
  Card,
  CloseButton,
  InputGroup,
  Modal,
  ModalBody,
  ModalHeader,
} from "react-bootstrap";
import {
  Cash,
  Collection,
  Envelope,
  GeoAltFill,
  Globe,
  PencilSquare,
  Person,
  PersonVcard,
  TelephoneFill,
  Trash3Fill,
} from "react-bootstrap-icons";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import SelectField from "../../../components/common/SelectField";
import { TextField } from "../../../components/common/HorizontalTextField";
import CustomerEdit from "./CustomerEdit";
import { FontColor } from "../../../assets/js/theme";
import CustomerBillCollect from "./CustomerBillCollect";
import ProfileDelete from "../ProfileDelete";
import CustomerMessage from "./CustomerMessage";
import { ToastContainer } from "react-toastify";
import CustomerBillReport from "./CustomerBillReport";

export default function CustomerDetails({ show, setShow, customerId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // customer validator
  const customerValidator = Yup.object({
    // customerId: Yup.string().required(t("writeCustomerId")),
    name: Yup.string().required(t("writeCustomerName")),
    mobile: Yup.string()
      // .matches(/^(01){1}[3456789]{1}(\d){8}$/, "মোবাইল নম্বর সঠিক নয়")
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    address: Yup.string(),
    email: Yup.string().email(t("incorrectEmail")),
    nid: Yup.string(),
    monthlyFee: Yup.number()
      .integer()
      .min(0, t("minimumPackageRate"))
      .required(t("enterPackageRate")),
    Pname: Yup.string().required(t("writePPPoEName")),
    Ppassword: Yup.string().required(t("writePPPoEPassword")),
    Pcomment: Yup.string(),
    customerBillingType: Yup.string().required(t("select billing type")),

    // balance: Yup.number().integer(),
  });

  // get all role
  const role = useSelector((state) => state.persistedReducer.auth?.role);

  // get isp owner data
  const userData = useSelector((state) => state.persistedReducer.auth.userData);

  // get user permission
  const permission = useSelector(
    (state) => state.persistedReducer.auth.userData.permissions
  );

  // get isp owner id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get owner users
  const ownerUsers = useSelector((state) => state?.ownerUsers?.ownerUser);

  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // find single customer data
  const data = customer.find((item) => item.id === customerId);

  // get bpSettings
  const bpSettings = useSelector(
    (state) => state.persistedReducer.auth?.userData?.bpSettings
  );

  // find performer
  const performer = ownerUsers.find((item) => item[data?.createdBy]);

  // modal handle state
  const [modalStatus, setModalStatus] = useState("");
  const [modalShow, setModalShow] = useState(false);

  // profile option state
  const [profileOption, setProfileOption] = useState("profileEdit");

  // profile details status update sclect options
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    getOwnerUsers(dispatch, ispOwnerId);
  }, []);

  // modal close handler
  const handleClose = () => {
    setShow(false);
    setProfileOption("");
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
          <ToastContainer position="top-right" theme="colored" />
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

                  <div className="">
                    <div className="d-flex gap-3">
                      <Globe />
                      <p>{`${userData?.upazila},${userData?.district},${userData?.division}`}</p>
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
                          <p>{t("status")}</p>
                          <div className="d-flex justify-content-between">
                            {visible ? (
                              <select
                                className="form-select mw-100 mt-0"
                                aria-label="Default select example"
                                // value={item.value}
                              >
                                <option value="active">{t("active")}</option>
                                <option value="inactive">
                                  {t("inactive")}
                                </option>
                                <option value="expired">{t("expired")}</option>
                              </select>
                            ) : (
                              badge(data?.status)
                            )}
                            <PencilSquare onClick={() => setVisible(true)} />
                          </div>
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
                                // onChange={(e) => supportOnlineHandle(e.target)}
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
                  <CustomerBillReport customerId={customerId} />
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
