import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

// internal import
import { useCallback } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";
import { FontColor, FourGround } from "../../assets/js/theme";

import Footer from "../../components/admin/footer/Footer";
import Loader from "../../components/common/Loader";

import "./message.css";
import useDash from "../../assets/css/dash.module.css";

import apiLink from "../../api/apiLink";
import { isBangla, smsCount } from "../../components/common/UtilityMethods";
import { useTranslation } from "react-i18next";
import { getArea } from "../../features/apiCalls";
import { Button } from "react-bootstrap";
import SMSPurchase from "./SMSPurchase";
import MessageAlert from "./MessageAlert";

const useForceUpdate = () => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
};

const makeMessageObj = (template, ispOwnerId, customer, subAreaIds = null) => {
  if (subAreaIds.includes(customer.subArea)) {
    let msg = template
      // .replace("USERNAME", customer?.pppoe?.name)
      .replace("CUSTOMER_NAME", customer?.name)
      .replace("CUSTOMER_ID", customer?.customerId)
      .replace(
        "BILL_DATE",
        moment(customer?.billingCycle).format("DD-MM-YYYY hh:mm A")
      )
      .replace("AMOUNT", customer?.monthlyFee)
      .replace(
        "BILL_DUE",
        customer.monthlyFee - customer.balance > 0
          ? customer.monthlyFee - customer.balance
          : 0
      );

    if (customer.userType === "pppoe") {
      msg = msg.replace("USERNAME", customer?.pppoe?.name);
    } else if (customer.userType === "firewall-queue") {
      msg = msg.replace("USERNAME", customer?.queue?.address);
    } else if (customer.userType === "simple-queue") {
      let temp = customer.queue.target
        ? customer.queue.target.split("/")[0]
        : "";
      msg = msg.replace("USERNAME", temp);
    }

    return {
      app: "netfee",
      type: "bulk",
      senderId: ispOwnerId,
      message: msg,
      mobile: customer?.mobile,
      count: smsCount(msg),
    };
  }
  return null;
};

export default function Message() {
  const { t } = useTranslation();
  const reset = useForceUpdate();
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const [sms, setSms] = useState("");
  const [isChecked, setisChecked] = useState(false);
  const [isAllChecked, setisAllChecked] = useState(false);
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [smsTemplet, setTemplet] = useState([]);

  const [bottomText, setBottomText] = useState("");
  const [upperText, setUpperText] = useState("");
  // const [totalText, setTotalText] = useState("");
  // console.log(upperText + "\n" + bottomText);

  const [isRefrsh, setIsrefresh] = useState(false);
  const area = useSelector((state) => state.area.area);
  const [areaIds, setAreaIds] = useState([]);
  const [subAreaIds, setSubAreaIds] = useState([]);
  const [title, setTitle] = useState("");

  const [days, setDays] = useState([]);
  const [smsReceiverType, setsmsReceiverType] = useState("");
  const [sendingType, setSendingType] = useState("nonMasking");

  const [show, setShow] = useState(false);

  const maskingId = useSelector(
    (state) => state.persistedReducer.auth.currentUser.ispOwner?.maskingId
  );
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const dispatch = useDispatch();
  const mobileNumRef = useRef();
  const smsRef = useRef();

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

  useEffect(() => {
    if (userRole === "ispOwner" || userRole === "manager") {
      getIspownerwitSMS();
      if (area.length === 0) getArea(dispatch, ispOwnerId, setIsLoading);
    }
  }, [userRole, getIspownerwitSMS]);

  //get all subArea ids

  const getSubAreaIds = () => {
    const subAreaAllId = area.map((item) => {
      return item.subAreas?.map((sub) => sub.id);
    });
    return subAreaAllId.flat(Infinity);
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

  // const customers = useSelector(
  //   (state) => state.customer.customer
  // );

  const [loading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    let messageTemplate = title + upperText + "\n" + bottomText;
    const now = moment();
    try {
      const owner = await apiLink.get(`/ispOwner/${ispOwnerId}`);
      const res = await apiLink.get(`/ispOwner/all-customer/${ispOwnerId}`);

      let items = [],
        totalSmsCount = 0;
      const filterCustomerBySelectedArea = (customer) => {
        if (subAreaIds.includes(customer.subArea)) {
          return customer;
        }
      };

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
        console.log(items);

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
          customer.status === "active"
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
            setSubAreaIds([]);
            setDays([]);
            smsRef.current.value = "";
            toast.success(t("successSMS"));
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
    // console.log(e.target.value);
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
        (title + "\n" + upperText + "\n" + bottomText).length + item.length >
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

  const setSubAreaHandler = (e) => {
    const subIds = getSubAreaIds();
    const { value, checked } = e.target;
    if (checked) {
      const newArr = subAreaIds.push(value);
      setAreaIds(newArr);
      // console.log({ subIds, newArr });
      if (subIds.length === newArr) {
        setisAllChecked(true);
      }
    } else {
      const updatedData = subAreaIds.filter((id) => id !== value);
      setSubAreaIds(updatedData);
      setisAllChecked(false);
    }
  };

  const selectAllHandler = (e) => {
    if (e.target.checked) {
      const newArray = getSubAreaIds();
      setSubAreaIds(newArray);
      setisAllChecked(true);
    } else {
      setSubAreaIds([]);
      setisAllChecked(false);
    }
  };

  return (
    <>
      <SMSPurchase />
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("SMSboard")}</div>
                  </div>
                  <Button
                    className="header_icon"
                    onClick={() => setShow({ ...show, [false]: true })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-envelope-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
                      <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z" />
                    </svg>
                  </Button>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="profileWrapper uiChange">
                    <div className="smsbal">
                      <div className="refreshDiv">
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
                        {/* <div className="balancetext mx-1">
                          {t("SMSbalance")}
                          <strong className="mainsmsbalance">{sms}</strong>
                        </div> */}
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

                      {/* {userRole === "ispOwner" && (
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#smsparchase"
                          className="buysms"
                        >
                          {t("buySMS")}
                        </button>
                      )} */}

                      <div
                        className="message-sending-type"
                        style={{ fontWeight: "normal" }}
                      >
                        <h4> {t("sendingMessageType")} </h4>
                        <input
                          name="messageSendingType"
                          type="radio"
                          checked={sendingType === "nonMasking"}
                          value={"nonMasking"}
                          onChange={(event) =>
                            setSendingType(event.target.value)
                          }
                        />{" "}
                        {t("nonMasking")}&nbsp; &nbsp;
                        <input
                          name="messageSendingType"
                          type="radio"
                          value={"masking"}
                          onChange={(event) =>
                            setSendingType(event.target.value)
                          }
                        />{" "}
                        {t("masking")}&nbsp; &nbsp;
                        <input
                          name="messageSendingType"
                          type="radio"
                          value={"fixedNumber"}
                          onChange={(event) =>
                            setSendingType(event.target.value)
                          }
                        />{" "}
                        {t("fixedNumber")}
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
                          {/* area section*/}
                          {/* <b className="mt-4">এরিয়া সিলেক্ট করুন</b> <br /> */}
                          <div style={{ width: "200px", height: "30px" }}>
                            <input
                              style={{ cursor: "pointer" }}
                              type="checkbox"
                              className="getValueUsingClass"
                              value={"selectAll"}
                              onClick={selectAllHandler}
                              id={"selectAll"}
                              checked={isAllChecked}
                            />
                            <label
                              style={{
                                cursor: "pointer",
                                marginLeft: "5px",
                              }}
                              htmlFor={"selectAll"}
                              className="areaParent"
                            >
                              {t("allArea")}
                            </label>
                          </div>
                          <div className="AllAreaClass mb-4">
                            {area?.map((val, key) => (
                              <div key={key}>
                                <div
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "5px",
                                  }}
                                  className="areaParent"
                                >
                                  {val.name}
                                </div>
                                {val.subAreas.map((v, k) => (
                                  <div key={k} className="displayFlex">
                                    <input
                                      style={{ cursor: "pointer" }}
                                      type="checkbox"
                                      className="getValueUsingClass"
                                      value={v.id}
                                      onChange={setSubAreaHandler}
                                      id={v.id}
                                      checked={subAreaIds.includes(v.id)}
                                    />
                                    <label
                                      style={{ cursor: "pointer" }}
                                      htmlFor={v.id}
                                    >
                                      {v.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="radio-buttons">
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
                                  id="5"
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
                      </div>
                      <div className="smsCount">
                        <span className="smsLength">
                          {t("letter")}{" "}
                          {(title + smsTemplet + bottomText).length}
                        </span>
                        <span>
                          SMS: {smsCount(title + smsTemplet + bottomText)}
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
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>
      <MessageAlert ispOwner={sms} />
      <SMSPurchase show={show} />
    </>
  );
}
