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
import SmsParchase from "./smsParchaseModal";
import Loader from "../../components/common/Loader";

import "./message.css";
import useDash from "../../assets/css/dash.module.css";

import apiLink from "../../api/apiLink";
import { isBangla, smsCount } from "../../components/common/UtilityMethods";
import { useTranslation } from "react-i18next";

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
      .replace("AMOUNT", customer?.monthlyFee);

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
  const area = useSelector((state) => state.persistedReducer.area.area);
  const [areaIds, setAreaIds] = useState([]);
  const [subAreaIds, setSubAreaIds] = useState([]);

  const [days, setDays] = useState([]);
  const [smsReceiverType, setsmsReceiverType] = useState("");

  const userData = useSelector((state) => state.persistedReducer.auth.userData);
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
      setSms(res.data.smsBalance);
      setIsrefresh(false);
    } catch (error) {
      console.log(error.response?.data.message);
      setIsrefresh(false);
    }
  }, [ispOwnerId]);

  useEffect(() => {
    if (userRole === "ispOwner" || userRole === "manager") {
      getIspownerwitSMS();
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
  //   (state) => state.persistedReducer.customer.customer
  // );

  // const [loading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    console.log(smsReceiverType);
    let messageTemplate = upperText + "\n" + bottomText;
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
          customer.paymentStatus === "unpaid" &&
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

      alert(` ${t("sampleSMS")}:\n${items[0]?.message}`);
      if (owner.data.smsBalance >= totalSmsCount) {
        let con = window.confirm(
          `${items.length}  ${t("getSMS")} ${totalSmsCount}  ${t("expenseSMS")}`
        );
        if (con && items.length) {
          // post
          const res = await apiLink.post(`sms/bulk/${ispOwnerId}`, {
            items,
            totalSmsCount,
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
      if ((upperText + "\n" + bottomText).length + item.length > 480) {
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
  console.log(subAreaIds);
  return (
    <>
      <SmsParchase></SmsParchase>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle"> {t("SMSboard")} </h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="profileWrapper uiChange">
                    <div className="smsbal">
                      <div className="refreshDiv">
                        <div className="balancetext">
                          {t("SMSbalance")}
                          <strong className="mainsmsbalance">{sms}</strong>
                        </div>
                        <div title={t("refresh")} className="refreshIcon">
                          {isRefrsh ? (
                            <Loader></Loader>
                          ) : (
                            <ArrowClockwise
                              onClick={() => getIspownerwitSMS()}
                            ></ArrowClockwise>
                          )}
                        </div>
                      </div>

                      {userRole === "ispOwner" && (
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#smsparchase"
                          className="buysms"
                        >
                          {t("buySMS")}
                        </button>
                      )}
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
                        {smsTemplet.map((item, key) => {
                          return <p key={key}>{item}</p>;
                        })}

                        <p className="endingtext">{bottomText}</p>
                      </div>
                      <div className="smsCount">
                        <span className="smsLength">
                          {t("letter")} {(smsTemplet + bottomText).length}
                        </span>
                        <span>SMS: {smsCount(smsTemplet + bottomText)}</span>
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
    </>
  );
}
