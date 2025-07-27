import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

// internal import
import { useCallback } from "react";
import { ArrowClockwise, EnvelopePlus, PlayBtn } from "react-bootstrap-icons";
import { FontColor, FourGround } from "../../assets/js/theme";

import Footer from "../../components/admin/footer/Footer";
import Loader from "../../components/common/Loader";

import "./message.css";
import useDash from "../../assets/css/dash.module.css";

import apiLink from "../../api/apiLink";
import { isBangla, smsCount } from "../../components/common/UtilityMethods";
import { useTranslation } from "react-i18next";
import { getArea } from "../../features/apiCalls";
import SMSPurchase from "./SMSPurchase";
import MessageAlert from "./MessageAlert";
import { getSubAreasApi } from "../../features/actions/customerApiCall";
import DatePicker from "react-datepicker";
import NetFeeBulletin from "../../components/bulletin/NetFeeBulletin";
import { getBulletinPermission } from "../../features/apiCallAdmin";
import { areasSubareasChecked } from "../staff/staffCustomFucn";
import useISPowner from "../../hooks/useISPOwner";
import InformationTooltip from "../../components/common/tooltipInformation/InformationTooltip";
import { informationEnBn } from "../../components/common/tooltipInformation/informationEnBn";
import PlayTutorial from "../tutorial/PlayTutorial";

const makeMessageObj = (
  template,
  ispOwnerId,
  customer,
  areaSubareas = null
) => {
  if (areaSubareas?.includes(customer.subArea)) {
    let msg = template
      .replace(/CUSTOMER_NAME/g, customer?.name || "")
      .replace(/CUSTOMER_ID/g, customer?.customerId || "")
      .replace(
        /BILL_DATE/g,
        moment(customer?.billingCycle).format("DD-MM-YYYY hh:mm A")
      )
      .replace(/AMOUNT/g, customer?.monthlyFee || "")
      .replace(
        /BILL_DUE/g,
        customer.monthlyFee - customer.balance > 0
          ? customer.monthlyFee - customer.balance
          : 0
      );

    if (customer.userType === "pppoe") {
      msg = msg.replace(/USERNAME/g, customer?.pppoe?.name || "");
    } else if (customer.userType === "firewall-queue") {
      msg = msg.replace(/USERNAME/g, customer?.queue?.address || "");
    } else if (customer.userType === "simple-queue") {
      let temp = customer.queue.target
        ? customer.queue.target.split("/")[0]
        : "";
      msg = msg.replace(/USERNAME/g, temp);
    }

    return {
      app: "onebilling",
      type: "bulk",
      senderId: ispOwnerId,
      message: msg,
      mobile: customer?.mobile,
      count: smsCount(msg.trim()),
    };
  }
  return null;
};

export default function Message() {
  const { t } = useTranslation();

  // get user & current user data form useISPOwner
  const { role, ispOwnerData, ispOwnerId } = useISPowner();

  // get ispOwner all area form redux store
  const area = useSelector((state) => state.area.area);

  // get ispOwner areas subarea form redux
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // get ispOwner masking name
  const maskingId = useSelector(
    (state) => state.persistedReducer.auth.currentUser.ispOwner?.maskingId
  );

  // get bulletin permission
  const butPermission = useSelector(
    (state) => state.adminNetFeeSupport?.bulletinPermission
  );

  const [sms, setSms] = useState("");
  const [isChecked, setisChecked] = useState(false);
  const [smsTemplet, setTemplet] = useState([]);

  const [bottomText, setBottomText] = useState("");
  const [upperText, setUpperText] = useState("");
  // const [totalText, setTotalText] = useState("");
  // console.log(upperText + "\n" + bottomText);

  // payment link state
  const [paymentLink, setPaymentLink] = useState("");

  const [isRefrsh, setIsrefresh] = useState(false);
  const [title, setTitle] = useState("");

  const [days, setDays] = useState([]);
  const [smsReceiverType, setsmsReceiverType] = useState("");
  const [sendingType, setSendingType] = useState("nonMasking");
  const [billDate, setBillDate] = useState(new Date());

  const [show, setShow] = useState(false);
  const [modalStatus, setModalStatus] = useState("");

  const [loading, setIsLoading] = useState(false);

  // ispOwner all areas state
  const [areaSubareas, setAreaSubareas] = useState();

  //customer sms receiver type state
  const [receiverCustomerType, setReceiverCustomerType] = useState([]);

  const dispatch = useDispatch();
  const mobileNumRef = useRef();
  const smsRef = useRef();

  const messageTypes = [
    {
      label: t("nonMasking"),
      value: "nonMasking",
    },
    {
      label: t("masking"),
      value: "masking",
    },
    {
      label: t("fixedNumber"),
      value: "fixedNumber",
    },
  ];

  const getIspownerwitSMS = useCallback(async () => {
    setIsrefresh(true);
    try {
      const res = await apiLink.get(`/ispOwner/${ispOwnerId}`);
      // setSms(res.data.smsBalance);
      setSms(res.data);
      setIsrefresh(false);
    } catch (error) {
      console.log(error.response?.data.message);
      setIsrefresh(false);
    }
  }, [ispOwnerId]);

  // ispOwner payment gateway payment link
  const customerPaymentLink = `Payment Link: https://app.netfeebd.com/isp/${ispOwnerData?.netFeeId}`;

  useEffect(() => {
    if (role === "ispOwner" || role === "manager") {
      getIspownerwitSMS();
      if (area.length === 0) getArea(dispatch, ispOwnerId, setIsLoading);
      getSubAreasApi(dispatch, ispOwnerId);
    }

    //get netFee bulletin api
    Object.keys(butPermission)?.length === 0 && getBulletinPermission(dispatch);
  }, [role, getIspownerwitSMS]);

  // ispOwner all areas subarea handle
  useEffect(() => {
    let temp = [];

    area?.map((val) =>
      storeSubArea?.map((sub) => {
        if (val.id === sub.area) {
          let subarea = {
            ...sub,
            isChecked: false,
          };
          temp.push(subarea);
        }
      })
    );

    // set ispOwner subAreas checked key include
    setAreaSubareas(temp);
  }, [area, storeSubArea]);

  // select area handle for the bulk message
  const areaSubareaSelectHandler = ({ target }) => {
    const { name, checked, id } = target;

    let subAreas = [...areaSubareas];

    if (name === "allAreas") {
      subAreas = subAreas.map((val) => ({ ...val, isChecked: checked }));
    } else if (name === "area") {
      subAreas = subAreas.map((val) =>
        val.area === id ? { ...val, isChecked: checked } : val
      );
    } else {
      subAreas = subAreas.map((val) =>
        val.id === id ? { ...val, isChecked: checked } : val
      );
    }

    // set collector areas
    setAreaSubareas(subAreas);
  };

  //customer type handler
  const smsReceiveCustomerTypeHandler = (e) => {
    let customerType = [...receiverCustomerType];

    if (customerType.includes(e.target.value)) {
      customerType = customerType.filter((value) => value !== e.target.value);
    } else if (!customerType.includes(e.target.value)) {
      customerType.push(e.target.value);
    }
    setReceiverCustomerType(customerType);
  };

  // customer payment link handler
  const paymentLinkHandler = (e) => {
    if (paymentLink) {
      setPaymentLink("");
    } else {
      setPaymentLink(e.target.value);
    }
  };

  // day checkbox select
  const daySettingHandler = (e) => {
    let item = Number(e);
    if (days.includes(item)) {
      const index = days.indexOf(item);
      if (index > -1) {
        days.splice(index, 1);
      }
    } else {
      days.push(item);
    }

    setDays(days);
  };

  const handleSendMessage = async () => {
    let messageTemplate =
      title + upperText + "\n" + bottomText + "\n" + paymentLink;
    const now = moment();
    try {
      const owner = await apiLink.get(`/ispOwner/${ispOwnerId}`);
      const res = await apiLink.get(`/ispOwner/all-customer/${ispOwnerId}`);

      let items = [],
        totalSmsCount = 0;

      // all area subareas id
      let subAreaIds = areaSubareas
        .filter((val) => val.isChecked)
        .map((val) => val.id);

      res.data.map((customer) => {
        let dueDate = moment(customer.billingCycle);
        // send sms to unpaid customers by billing cycle ending date
        if (
          smsReceiverType === "unpaidCustomerByDate" &&
          customer.mobile &&
          customer.monthlyFee > customer.balance &&
          days.includes(dueDate.diff(now, "days"))
        ) {
          let sms = makeMessageObj(
            messageTemplate,
            ispOwnerId,
            customer,
            subAreaIds
          );
          if (sms) {
            totalSmsCount += sms.count;
            items.push(sms);
          }
        }

        // send sms to all customer
        if (smsReceiverType === "allCustomer" && customer.mobile) {
          let sms = makeMessageObj(
            messageTemplate,
            ispOwnerId,
            customer,
            subAreaIds
          );
          if (sms) {
            totalSmsCount += sms.count;
            items.push(sms);
          }
        }

        // send sms to unpaid customer
        if (
          smsReceiverType === "unpaid" &&
          customer.mobile &&
          customer.paymentStatus === "unpaid"
        ) {
          let sms = makeMessageObj(
            messageTemplate,
            ispOwnerId,
            customer,
            subAreaIds
          );
          if (sms) {
            totalSmsCount += sms.count;
            items.push(sms);
          }
        }

        // send sms to paid customer
        if (
          smsReceiverType === "paid" &&
          customer.mobile &&
          customer.paymentStatus === "paid"
        ) {
          let sms = makeMessageObj(
            messageTemplate,
            ispOwnerId,
            customer,
            subAreaIds
          );
          if (sms) {
            totalSmsCount += sms.count;
            items.push(sms);
          }
        }

        // send sms to active customer
        if (
          smsReceiverType === "active" &&
          customer.mobile &&
          customer.status === "active" &&
          receiverCustomerType.includes(customer.paymentStatus)
        ) {
          let sms = makeMessageObj(
            messageTemplate,
            ispOwnerId,
            customer,
            subAreaIds
          );
          if (sms) {
            totalSmsCount += sms.count;
            items.push(sms);
          }
        }

        // send sms to inactive customer
        if (
          smsReceiverType === "inactive" &&
          customer.mobile &&
          customer.status === "inactive"
        ) {
          let sms = makeMessageObj(
            messageTemplate,
            ispOwnerId,
            customer,
            subAreaIds
          );
          if (sms) {
            totalSmsCount += sms.count;
            items.push(sms);
          }
        }

        // send sms to expired customer
        if (
          smsReceiverType === "expired" &&
          customer.mobile &&
          customer.status === "expired"
        ) {
          let sms = makeMessageObj(
            messageTemplate,
            ispOwnerId,
            customer,
            subAreaIds
          );
          if (sms) {
            totalSmsCount += sms.count;
            items.push(sms);
          }
        }

        // send sms to customer billing cycle date
        if (
          smsReceiverType === "billDate" &&
          customer.mobile &&
          customer.monthlyFee > customer.balance &&
          dueDate._d.getDate() === billDate.getDate()
        ) {
          let sms = makeMessageObj(
            messageTemplate,
            ispOwnerId,
            customer,
            subAreaIds
          );
          if (sms) {
            totalSmsCount += sms.count;
            items.push(sms);
          }
        }
      });

      if (items.length === 0) {
        alert(t("notFoundCustomer"));
        return;
      }

      if (sendingType === "masking") {
        if (maskingId === "") {
          toast.error(t("maskingIdNotFound"));
          return;
        }
      }

      alert(` ${t("sampleSMS")}:\n${items[0]?.message}`);
      if (
        (sendingType === "nonMasking" &&
          owner.data.smsBalance >= totalSmsCount) ||
        (sendingType === "masking" &&
          owner.data.maskingSmsBalance >= totalSmsCount) ||
        (sendingType === "fixedNumber" &&
          owner.data.fixedNumberSmsBalance >= totalSmsCount)
      ) {
        let con = window.confirm(
          `${items.length}  ${t("getSMS")} ${totalSmsCount}  ${t("expenseSMS")}`
        );

        if (con && items.length) {
          // post
          const res = await apiLink.post(`sms/bulk/${ispOwnerId}`, {
            items,
            totalSmsCount,
            sendBy: sendingType,
          });

          if (res.data.status) {
            toast.success(t("successSMS"));
            const subareas = areaSubareas.map((val) =>
              val.isChecked ? { ...val, isChecked: false } : val
            );
            setAreaSubareas(subareas);

            setDays([]);
            smsRef.current.value = "";
            window.location.reload();
          }
        }
      } else {
        toast.error(t("unseccessAlertSMS"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSMSreceiver = (e) => {
    setsmsReceiverType(e.target.value);
  };

  const itemSettingHandler = (item) => {
    if (smsTemplet.includes(item)) {
      const index = smsTemplet.indexOf(item);
      if (index > -1) {
        smsTemplet.splice(index, 1);
      }
    } else {
      if (
        (title + "\n" + upperText + "\n" + bottomText + "\n" + paymentLink)
          .length +
          item.length >
        480
      ) {
        toast.error(t("exceedSMSLimit"));
        return;
      } else {
        smsTemplet.push(item);
      }
    }

    var theText = "";
    smsTemplet.map((i) => {
      return (theText = theText + "\n" + i);
    });

    setUpperText(theText);

    setTemplet(smsTemplet);
  };

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div>{t("SMSboard")}</div>

                  <div className="d-flex align-items-center">
                    <div className="addAndSettingIcon">
                      <PlayBtn
                        className="addcutmButton"
                        onClick={() => {
                          setModalStatus("playTutorial");
                          setShow(true);
                        }}
                        title={t("tutorial")}
                      />
                    </div>

                    <div
                      className="textButton"
                      onClick={() => {
                        setModalStatus("buySms");
                        setShow(true);
                      }}
                    >
                      <EnvelopePlus className="text_icons" /> {t("buySms")}
                    </div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="profileWrapper uiChange">
                    <div className="smsbal">
                      <div className="refreshDiv ">
                        <div className="balancetext px-2">
                          <div className="mx-content">
                            {t("nonMasking")}&nbsp;
                          </div>
                          {sms.smsBalance}
                        </div>
                        <div className="balancetext px-2 mx-1">
                          <div className="mx-content">
                            {t("masking")} &nbsp;
                          </div>

                          {sms.maskingSmsBalance}
                        </div>
                        <div className="balancetext px-2 ">
                          <div className="mx-content">
                            {t("fixedNumber")} &nbsp;
                          </div>
                          {sms.fixedNumberSmsBalance}
                        </div>

                        <div title={t("refresh")} className="refreshIcon px-2">
                          {isRefrsh ? (
                            <Loader />
                          ) : (
                            <ArrowClockwise
                              onClick={() => getIspownerwitSMS()}
                            ></ArrowClockwise>
                          )}
                        </div>
                      </div>

                      <div className="message-sending-type">
                        <h4>{t("sendingMessageType")}</h4>
                        <div className="smsType">
                          {messageTypes.map((type) => (
                            <div className="message_radio" key={type.value}>
                              <input
                                type="radio"
                                id={type.value}
                                value={type.value}
                                onChange={(event) =>
                                  setSendingType(event.target.value)
                                }
                                checked={sendingType === type.value}
                              />
                              <label htmlFor={type.value}>{type.label}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="writeMessageSection">
                      {isChecked ? (
                        <div className="ifCheckedBox">
                          <p></p>
                          <input
                            type="text"
                            placeholder={t("mobile")}
                            className="form-control"
                            ref={mobileNumRef}
                          />
                        </div>
                      ) : (
                        <div className="ifNotCheckBox">
                          <div style={{ width: "200px", height: "30px" }}>
                            <input
                              type="checkbox"
                              id="allAreas"
                              name="allAreas"
                              className="getValueUsingClasses form-check-input"
                              onClick={areaSubareaSelectHandler}
                              checked={areaSubareas?.every(
                                (item) => item.isChecked
                              )}
                            />

                            <label
                              htmlFor="allAreas"
                              className="areaParent ms-1"
                            >
                              {t("allArea")}
                            </label>
                          </div>

                          <div className="AllAreaClass mb-4">
                            {area?.map((val, key) => (
                              <div key={key}>
                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="area"
                                    id={val.id}
                                    onChange={areaSubareaSelectHandler}
                                    checked={
                                      areaSubareas &&
                                      areasSubareasChecked(val.id, areaSubareas)
                                    }
                                  />

                                  <label
                                    htmlFor={val.id}
                                    className="areaParent ms-1"
                                  >
                                    {val.name}
                                  </label>
                                </div>

                                {areaSubareas?.map(
                                  (subarea, k) =>
                                    subarea.area === val.id && (
                                      <div key={k} className="displayFlex">
                                        <input
                                          type="checkbox"
                                          id={subarea.id}
                                          onChange={areaSubareaSelectHandler}
                                          checked={subarea.isChecked}
                                        />

                                        <label
                                          htmlFor={subarea.id}
                                          className="text-secondary"
                                        >
                                          {subarea.name}
                                        </label>
                                      </div>
                                    )
                                )}
                              </div>
                            ))}
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="displayGrid radio-buttons">
                              <div>
                                <input
                                  id="bilDateEnd"
                                  value="unpaidCustomerByDate"
                                  name="platform"
                                  type="radio"
                                  className="form-check-input"
                                  onChange={(e) => handleSMSreceiver(e)}
                                />
                                <label
                                  className="form-check-lebel ms-2"
                                  htmlFor="bilDateEnd"
                                >
                                  {t("billDueExpire")}
                                </label>
                                {smsReceiverType === "unpaidCustomerByDate" ? (
                                  <div style={{}} className="displayFlex">
                                    <input
                                      type="checkbox"
                                      className="getValueUsingClass"
                                      value={"1"}
                                      onChange={(e) => {
                                        daySettingHandler(e.target.value);
                                      }}
                                    />
                                    <label className="mx-3">
                                      {t("billDueOneDay")}
                                    </label>
                                    <input
                                      type="checkbox"
                                      className="getValueUsingClass"
                                      value={"2"}
                                      onChange={(e) => {
                                        daySettingHandler(e.target.value);
                                      }}
                                    />
                                    <label className="mx-3">
                                      {t("billDueTwoDay")}
                                    </label>
                                    <input
                                      type="checkbox"
                                      className="getValueUsingClass"
                                      value={"3"}
                                      onChange={(e) => {
                                        daySettingHandler(e.target.value);
                                      }}
                                    />
                                    <label className="mx-3">
                                      {t("billDueThreeDay")}
                                    </label>
                                    <input
                                      type="checkbox"
                                      className="getValueUsingClass"
                                      value={"4"}
                                      onChange={(e) => {
                                        daySettingHandler(e.target.value);
                                      }}
                                    />
                                    <label className="mx-3">
                                      {t("billDueFourDay")}
                                    </label>
                                    <input
                                      type="checkbox"
                                      className="getValueUsingClass"
                                      value={"5"}
                                      onChange={(e) => {
                                        daySettingHandler(e.target.value);
                                      }}
                                    />
                                    <label className="mx-3">
                                      {t("billDueFiveDay")}
                                    </label>
                                    <input
                                      type="checkbox"
                                      className="getValueUsingClass"
                                      value={"6"}
                                      onChange={(e) => {
                                        daySettingHandler(e.target.value);
                                      }}
                                    />
                                    <label className="mx-3">
                                      {t("billDueSixDay")}
                                    </label>
                                    <input
                                      type="checkbox"
                                      className="getValueUsingClass"
                                      value={"7"}
                                      onChange={(e) => {
                                        daySettingHandler(e.target.value);
                                      }}
                                    />
                                    <label className="mx-3">
                                      {t("billDueSevenDay")}
                                    </label>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div>
                                <input
                                  id="allCustomer"
                                  value="allCustomer"
                                  name="platform"
                                  type="radio"
                                  className="form-check-input"
                                  onChange={(e) => handleSMSreceiver(e)}
                                />
                                <label
                                  className="form-check-lebel ms-2"
                                  htmlFor="allCustomer"
                                >
                                  {t("sokolCustomer")}
                                </label>
                              </div>
                              <div>
                                <input
                                  id="paid"
                                  value="paid"
                                  name="platform"
                                  type="radio"
                                  className="form-check-input"
                                  onChange={(e) => handleSMSreceiver(e)}
                                />
                                <label
                                  className="form-check-lebel ms-2"
                                  htmlFor="paid"
                                >
                                  {t("payPaid")}
                                </label>
                              </div>
                              <div>
                                <input
                                  id="unpaid"
                                  value="unpaid"
                                  name="platform"
                                  className="form-check-input"
                                  type="radio"
                                  onChange={(e) => handleSMSreceiver(e)}
                                />
                                <label
                                  className="form-check-lebel ms-2"
                                  htmlFor="unpaid"
                                >
                                  {t("unpaid")}
                                </label>
                              </div>

                              <div>
                                <div className="d-flex align-items-center">
                                  <div>
                                    <input
                                      id="activee"
                                      value="active"
                                      name="platform"
                                      type="radio"
                                      className="form-check-input"
                                      onChange={(e) => handleSMSreceiver(e)}
                                    />
                                    <label
                                      className="form-check-lebel ms-2"
                                      htmlFor="activee"
                                    >
                                      {t("active")}
                                    </label>
                                  </div>

                                  {/* there is information to grant permission tooltip */}
                                  {informationEnBn()?.[0] && (
                                    <InformationTooltip
                                      data={informationEnBn()?.[0]}
                                    />
                                  )}
                                </div>

                                {smsReceiverType === "active" && (
                                  <div className="ms-4">
                                    <div>
                                      <input
                                        type="checkbox"
                                        id="activePaid"
                                        value="paid"
                                        name="platform"
                                        className="form-check-input"
                                        onChange={smsReceiveCustomerTypeHandler}
                                      />
                                      <label
                                        className="form-check-lebel ms-2"
                                        htmlFor="activePaid"
                                      >
                                        {t("payPaid")}
                                      </label>
                                    </div>

                                    <div>
                                      <input
                                        type="checkbox"
                                        id="activeUnpaid"
                                        value="unpaid"
                                        name="platform"
                                        className="form-check-input"
                                        onChange={smsReceiveCustomerTypeHandler}
                                      />

                                      <label
                                        className="form-check-lebel ms-2"
                                        htmlFor="activeUnpaid"
                                      >
                                        {t("unpaid")}
                                      </label>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div>
                                <input
                                  id="inactive"
                                  value="inactive"
                                  name="platform"
                                  type="radio"
                                  className="form-check-input"
                                  onChange={(e) => handleSMSreceiver(e)}
                                />
                                <label
                                  className="form-check-lebel ms-2"
                                  htmlFor="inactive"
                                >
                                  {t("in active")}
                                </label>
                              </div>
                              <div>
                                <input
                                  id="expire"
                                  value="expired"
                                  name="platform"
                                  type="radio"
                                  className="form-check-input"
                                  onChange={(e) => handleSMSreceiver(e)}
                                />
                                <label
                                  className="form-check-lebel ms-2"
                                  htmlFor="expire"
                                >
                                  {t("expired")}
                                </label>
                              </div>

                              <div>
                                <input
                                  id="billDate"
                                  value="billDate"
                                  name="platform"
                                  type="radio"
                                  className="form-check-input"
                                  onChange={(e) => handleSMSreceiver(e)}
                                />
                                <label
                                  className="form-check-lebel ms-2"
                                  htmlFor="billDate"
                                >
                                  {t("billDate")}
                                </label>

                                {smsReceiverType === "billDate" && (
                                  <DatePicker
                                    className="form-control mt-1 mw-100"
                                    selected={billDate}
                                    onChange={(date) => setBillDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={billDate}
                                  />
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="mt-3">
                                <input
                                  value={title}
                                  onChange={(event) =>
                                    setTitle(event.target.value)
                                  }
                                  className="form-control"
                                  type="text"
                                  placeholder={t("title")}
                                  maxlength="40"
                                />
                              </div>
                              <div className="radioselect">
                                <input
                                  id="1"
                                  type="checkbox"
                                  className="getValueUsingClass"
                                  value={"USER: USERNAME"}
                                  checked={smsTemplet.includes(
                                    "USER: USERNAME"
                                  )}
                                  onChange={(e) => {
                                    itemSettingHandler(e.target.value);
                                  }}
                                />
                                <label className="templatelabel" htmlFor="1">
                                  {"USER: USERNAME"}
                                </label>
                              </div>
                              <div className="radioselect">
                                <input
                                  id="2"
                                  type="checkbox"
                                  className="getValueUsingClass"
                                  checked={smsTemplet.includes(
                                    "ID: CUSTOMER_ID"
                                  )}
                                  value={"ID: CUSTOMER_ID"}
                                  onChange={(e) => {
                                    itemSettingHandler(e.target.value);
                                  }}
                                />
                                <label className="templatelabel" htmlFor="2">
                                  {"ID: CUSTOMER_ID"}
                                </label>
                              </div>
                              <div className="radioselect">
                                <input
                                  id="3"
                                  type="checkbox"
                                  className="getValueUsingClass"
                                  checked={smsTemplet.includes(
                                    "NAME: CUSTOMER_NAME"
                                  )}
                                  value={"NAME: CUSTOMER_NAME"}
                                  onChange={(e) => {
                                    itemSettingHandler(e.target.value);
                                  }}
                                />
                                <label className="templatelabel" htmlFor="3">
                                  {"NAME: CUSTOMER_NAME"}
                                </label>
                              </div>
                              <div className="radioselect">
                                <input
                                  id="4"
                                  type="checkbox"
                                  className="getValueUsingClass"
                                  checked={smsTemplet.includes(
                                    "BILL: AMOUNT Tk"
                                  )}
                                  value={"BILL: AMOUNT Tk"}
                                  onChange={(e) => {
                                    itemSettingHandler(e.target.value);
                                  }}
                                />
                                <label className="templatelabel" htmlFor="4">
                                  {"BILL: AMOUNT Tk"}
                                </label>
                              </div>
                              <div className="radioselect">
                                <input
                                  id="5"
                                  type="checkbox"
                                  className="getValueUsingClass"
                                  checked={smsTemplet.includes(
                                    "LAST DATE: BILL_DATE"
                                  )}
                                  value={"LAST DATE: BILL_DATE"}
                                  onChange={(e) => {
                                    itemSettingHandler(e.target.value);
                                  }}
                                />
                                <label className="templatelabel" htmlFor="5">
                                  {"LAST DATE: BILL_DATE"}
                                </label>
                              </div>
                              <div className="radioselect">
                                <input
                                  id="6"
                                  type="checkbox"
                                  className="getValueUsingClass"
                                  checked={smsTemplet.includes(
                                    "BILL DUE: BILL_DUE"
                                  )}
                                  value={"BILL DUE: BILL_DUE"}
                                  onChange={(e) => {
                                    itemSettingHandler(e.target.value);
                                  }}
                                />
                                <label className="templatelabel" htmlFor="6">
                                  {"BILL DUE: BILL_DUE"}
                                </label>
                              </div>

                              {ispOwnerData?.bpSettings.hasPG && (
                                <div className="radioselect">
                                  <input
                                    id="7"
                                    type="checkbox"
                                    className="getValueUsingClass"
                                    value={customerPaymentLink}
                                    onChange={paymentLinkHandler}
                                  />
                                  <label className="templatelabel" htmlFor="7">
                                    {"PAYMENT_LINK"}
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* area */}
                          {/* <select
                            id="selectCustomerID3"
                            className="form-select"
                          >
                            <option value="">সকল গ্রাহক</option>
                            <option value="">dummy</option>
                            <option value="">dummy</option>
                          </select> */}
                        </div>
                      )}

                      <br />
                      {/* <p>
                        ID: ID
                        <br />
                        গ্রাহকঃ NAME
                        <br />
                        বিলঃ AMOUNT Tk
                        <br />
                        তারিখঃ DATE
                        <br />
                      </p> */}
                      <div className="showthesequence">
                        <p className="endingText">{title}</p>
                        {smsTemplet.map((item, key) => {
                          return <p key={key}>{item}</p>;
                        })}

                        <p className="endingtext">{bottomText}</p>
                        {paymentLink && (
                          <p className="text-primary">{paymentLink}</p>
                        )}
                      </div>
                      <div className="smsCount">
                        <span className="smsLength">
                          {t("letter")}
                          {
                            (title + smsTemplet + bottomText + paymentLink)
                              .length
                          }
                        </span>
                        <span>
                          SMS:
                          {smsCount(
                            title + smsTemplet + bottomText + paymentLink
                          )}
                        </span>
                      </div>
                      <textarea
                        id="messageTextArea"
                        rows="6"
                        className="form-control mt-4"
                        placeholder={t("messageLikhun")}
                        value={bottomText}
                        // onClick={insertMyText}
                        maxLength={335 - upperText.length}
                        onChange={(e) => setBottomText(e.target.value)}
                      ></textarea>
                      <hr />
                      <button
                        onClick={handleSendMessage}
                        className="btn btn-success"
                      >
                        {t("sendMessage")}
                      </button>
                    </div>
                  </div>
                </div>

                {(butPermission?.message || butPermission?.allPage) && (
                  <NetFeeBulletin />
                )}
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      <SMSPurchase />
      <MessageAlert ispOwner={sms} />

      {/* sms purchase board modal */}
      {modalStatus === "buySms" && (
        <SMSPurchase show={show} setShow={setShow} />
      )}

      {/* tutorial play modal */}
      {modalStatus === "playTutorial" && (
        <PlayTutorial
          {...{
            show,
            setShow,
            video: "smsTemplate",
          }}
        />
      )}
    </>
  );
}
