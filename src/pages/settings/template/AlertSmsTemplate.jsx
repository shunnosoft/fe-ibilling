import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { smsCount } from "../../../components/common/UtilityMethods";
import { smsSettingUpdateIsp } from "../../../features/authSlice";
import { useTranslation } from "react-i18next";
import useISPowner from "../../../hooks/useISPOwner";

function AlertSmsTemplate() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const textRef = useRef();
  const formRef = useRef();

  // get user & current user data form useISPOwner
  const { ispOwnerData, ispOwnerId } = useISPowner();

  // loading state
  const [loading, setLoading] = useState(false);

  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );

  const [bottomText, setBottomText] = useState("");
  const [fontValue, setFontValue] = useState("");
  const [upperText, setUpperText] = useState("");
  const [numberOfDay, setnumberOfDay] = useState();
  const [days, setDays] = useState([]);

  const [billConfirmation, setBillConfirmation] = useState("");
  // const [billconfarmationparametres, setbillconparametres] = useState([]);
  // const [matchFound, setMatchFound] = useState([]);

  const [sendingType, setSendingType] = useState();

  const [smsTemplet, setTemplet] = useState([]);

  const [alertNum, setAlertNum] = useState("");

  // payment link state
  const [paymentLink, setPaymentLink] = useState("");

  // ispOwner payment gateway payment link
  const customerPaymentLink = `Payment Link: https://netfeebd.com/isp/${ispOwnerData?.netFeeId}`;

  const itemSettingHandler = (item) => {
    if (smsTemplet.includes(item)) {
      const index = smsTemplet.indexOf(item);
      if (index > -1) {
        smsTemplet.splice(index, 1);
      }
    } else {
      if (
        (fontValue + "\n" + upperText + "\n" + bottomText + "\n" + paymentLink)
          .length +
          item.length >
        334
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

  useEffect(() => {
    setDays(settings?.sms.alertDays);

    if (settings?.sms?.alert) {
      setBillConfirmation("on");
    } else {
      setBillConfirmation("off");
    }

    setSendingType(settings?.sms?.alertSendBy);
  }, [settings]);

  const radioCheckHandler = (e) => {
    setBillConfirmation(e.target.value);
  };

  useEffect(() => {
    setnumberOfDay(Math.max(...days));
  }, [days]);
  // day checkbox select
  const daySettingHandler = (e) => {
    let tempDays = [...days];
    let item = Number(e);

    if (tempDays.includes(item)) {
      const index = tempDays.indexOf(item);
      if (index > -1) {
        tempDays.splice(index, 1);
      }
    } else {
      tempDays.push(item);
    }

    setDays(tempDays);
  };

  // customer payment link handler
  const paymentLinkHandler = (e) => {
    if (paymentLink) {
      setPaymentLink("");
    } else {
      setPaymentLink(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const temp = upperText.split("\n");
    temp.length = smsTemplet.length + 1;
    const newUpperText = temp.join("\n");
    let data = {
      ...settings?.sms,
      alertSendBy: sendingType,
      alert:
        billConfirmation === "on"
          ? true
          : billConfirmation === "off"
          ? false
          : null,
      alertDays: days,
      template: {
        ...settings?.sms?.template,
        alert: newUpperText + "\n" + bottomText,
        [alertNum]:
          fontValue + newUpperText + "\n" + bottomText + "\n" + paymentLink,
      },
    };
    // if (!alertNum) {
    //   toast.warn("অনুগ্রহ করে টেমপ্লেট সিলেক্ট করুন");
    //   return 0;
    // }
    setLoading(true);

    try {
      const res = await apiLink.patch(
        `/ispOwner/settings/sms/${ispOwnerId}`,
        data
      );
      dispatch(smsSettingUpdateIsp(res.data));
      setLoading(false);
      toast.success(t("alertSMStemplateSaveAlert"));
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // formRef.current.reset();
  };

  const smstempletDay = useMemo(() => {
    return [
      {
        name: t("onedayTemplate"),
        value: (settings?.sms?.template?.alert1 || "") + "\nalert1",
      },
      {
        name: t("twodaysTemplate"),
        value: (settings?.sms?.template?.alert2 || "") + "\nalert2",
      },
      {
        name: t("threedaysTemplate"),
        value: (settings?.sms?.template?.alert3 || "") + "\nalert3",
      },
      {
        name: t("fourdaysTemplate"),
        value: (settings?.sms?.template?.alert4 || "") + "\nalert4",
      },
      {
        name: t("fivedaysTemplate"),
        value: (settings?.sms?.template?.alert5 || "") + "\nalert5",
      },
      {
        name: t("sixdaysTemplate"),
        value: (settings?.sms?.template?.alert6 || "") + "\nalert6",
      },
      {
        name: t("sevendaysTemplate"),
        value: (settings?.sms?.template?.alert7 || "") + "\nalert7",
      },
    ];
  }, [settings, t]);

  const dayTempletHandler = (e) => {
    let temp2 = e.target.value
      ?.replace("ইউজারনেমঃ USERNAME", "")
      .replace("ইউজার আইডিঃ USERID", "")
      .replace("গ্রাহকঃ NAME", "")
      .replace("বিলঃ AMOUNT", "")
      .replace("তারিখঃ DATE", "");
    let temp = temp2.split("\n");
    temp.splice(-2);
    const temp9 = temp;
    const temp10 = temp9.filter((i) =>
      [
        "USER: USERNAME",
        "ID: CUSTOMER_ID",
        "NAME: CUSTOMER_NAME",
        "BILL: AMOUNT",
        "LAST DATE: BILL_DATE",
      ].includes(i)
    );
    setTemplet(temp10);
    setAlertNum(temp2.split("\n").splice(-1)[0]);
    if (!e.target.value) {
      setTemplet(temp);
    }

    let messageBoxStr = e.target.value
      ?.replace("USER: USERNAME", "")
      .replace("ID: CUSTOMER_ID", "")
      .replace("NAME: CUSTOMER_NAME", "")
      .replace("BILL: AMOUNT", "")
      .replace("LAST DATE: BILL_DATE", "");
    let temp4 = messageBoxStr.split("\n");
    temp4.splice(-1);
    // let temp5 = "";
    // temp4.map((i) => {
    //   if (i !== "") {
    //     temp5 = temp5 + i + "\n";
    //   }
    //   return temp5;
    // });

    // setBottomText(temp5);

    var theText = "";
    temp.map((i) => {
      return (theText = theText + "\n" + i);
    });

    setUpperText(theText);

    if (temp4.length > 0) {
      setFontValue(temp4[0] || "");

      let temptxt = "";
      temp4.map((value, index) => {
        if (index > 1 && value !== "") {
          temptxt += value + "\n";
        }
      });
      setBottomText(temptxt);
    }
  };

  return (
    <div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        action=""
        className="settingForm"
      >
        <div className="writeMessageSection">
          <div className="messageStatus d-flex justify-content-between">
            <div className="sending-status">
              <h4> {t("alertSMStemplate")} </h4>
              <div className="displayGrid1">
                <div className="message_radio">
                  <input
                    type="radio"
                    name="billConfirmation"
                    id="onTemplate"
                    value={"on"}
                    checked={billConfirmation === "on"}
                    onChange={radioCheckHandler}
                  />
                  <label htmlFor="onTemplate">{t("ON")}</label>
                </div>

                <div className="message_radio">
                  <input
                    type="radio"
                    name="billConfirmation"
                    id="offTemplate"
                    value={"off"}
                    checked={billConfirmation === "off"}
                    onChange={radioCheckHandler}
                  />
                  <label htmlFor="offTemplate">{t("OFF")}</label>
                </div>
              </div>
            </div>

            <div className="message-sending-type">
              <h4> {t("sendingMessageType")} </h4>
              <input
                name="messageSendingType"
                type="radio"
                checked={sendingType === "nonMasking"}
                value={"nonMasking"}
                onChange={(event) => setSendingType(event.target.value)}
              />
              {t("nonMasking")}
              <input
                name="messageSendingType"
                type="radio"
                checked={sendingType === "masking"}
                value={"masking"}
                onChange={(event) => setSendingType(event.target.value)}
              />
              {t("masking")}
              <input
                name="messageSendingType"
                type="radio"
                checked={sendingType === "fixedNumber"}
                value={"fixedNumber"}
                onChange={(event) => setSendingType(event.target.value)}
              />
              {t("fixedNumber")}
            </div>
          </div>

          <div className="billconfirm">
            <div className="showthesequence ">
              <p className="endingText">{fontValue}</p>
              {smsTemplet.map((item, key) => {
                return <p key={key}>{item}</p>;
              })}

              <p className="endingtext">{bottomText}</p>
              {paymentLink && <p className="text-primary">{paymentLink}</p>}
            </div>

            <div className="displayGrid">
              <div className="radioselect">
                <input
                  id="USERNAME"
                  type="checkbox"
                  className="getValueUsingClass"
                  value={"USER: USERNAME"}
                  checked={smsTemplet.includes("USER: USERNAME")}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="USERNAME">
                  {"USER: USERNAME"}
                </label>
              </div>

              <div className="radioselect">
                <input
                  id="CUSTOMER_ID"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={smsTemplet.includes("ID: CUSTOMER_ID")}
                  value={"ID: CUSTOMER_ID"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="CUSTOMER_ID">
                  {"ID: CUSTOMER_ID"}
                </label>
              </div>

              <div className="radioselect">
                <input
                  id="CUSTOMER_NAME"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={smsTemplet.includes("NAME: CUSTOMER_NAME")}
                  value={"NAME: CUSTOMER_NAME"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="CUSTOMER_NAME">
                  {"NAME: CUSTOMER_NAME"}
                </label>
              </div>

              <div className="radioselect">
                <input
                  id="AMOUNT"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={smsTemplet.includes("BILL: AMOUNT")}
                  value={"BILL: AMOUNT"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="AMOUNT">
                  {"BILL: AMOUNT"}
                </label>
              </div>

              <div className="radioselect">
                <input
                  id="BILL_DATE"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={smsTemplet.includes("LAST DATE: BILL_DATE")}
                  value={"LAST DATE: BILL_DATE"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="BILL_DATE">
                  {"LAST DATE: BILL_DATE"}
                </label>
              </div>

              {ispOwnerData?.bpSettings.hasPG && (
                <div className="radioselect">
                  <input
                    id="PAYMENT_LINK"
                    type="checkbox"
                    className="getValueUsingClass"
                    value={customerPaymentLink}
                    onChange={paymentLinkHandler}
                  />
                  <label className="templatelabel" htmlFor="PAYMENT_LINK">
                    {"PAYMENT_LINK"}
                  </label>
                </div>
              )}
            </div>

            <div className="displayGrid">
              <select
                className="form-select mw-100 mt-0"
                onChange={(e) => dayTempletHandler(e)}
                style={{ backgroundColor: "#dcdcdc" }}
              >
                <option value=""> {t("selectTemplate")} </option>
                {smstempletDay
                  ?.filter((s, i) => days.includes(i + 1))
                  .map((item, index) => {
                    return (
                      <option key={index} value={item.value}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>

              <input
                value={fontValue}
                onChange={(event) => setFontValue(event.target.value)}
                class="form-control"
                type="text"
                placeholder={t("title")}
                maxLength={40}
              />
            </div>

            <div className="displayGrid d-flex mb-3">
              <div className="day_checkbox">
                <input
                  type="checkbox"
                  className="getValueUsingClass"
                  id="OneDay"
                  value={"1"}
                  checked={days.includes(1)}
                  onChange={(e) => {
                    daySettingHandler(e.target.value);
                  }}
                />
                <label htmlFor="OneDay">{t("billDueOneDay")}</label>
              </div>

              <div className="day_checkbox">
                <input
                  type="checkbox"
                  className="getValueUsingClass"
                  id="TwoDay"
                  value={"2"}
                  checked={days.includes(2)}
                  onChange={(e) => {
                    daySettingHandler(e.target.value);
                  }}
                />
                <label htmlFor="TwoDay">{t("billDueTwoDay")}</label>
              </div>

              <div className="day_checkbox">
                <input
                  type="checkbox"
                  className="getValueUsingClass"
                  id="ThreeDay"
                  value={"3"}
                  checked={days.includes(3)}
                  onChange={(e) => {
                    daySettingHandler(e.target.value);
                  }}
                />
                <label htmlFor="ThreeDay">{t("billDueThreeDay")}</label>
              </div>

              <div className="day_checkbox">
                <input
                  type="checkbox"
                  className="getValueUsingClass"
                  id="FourDay"
                  value={"4"}
                  checked={days.includes(4)}
                  onChange={(e) => {
                    daySettingHandler(e.target.value);
                  }}
                />
                <label htmlFor="FourDay">{t("billDueFourDay")}</label>
              </div>

              <div className="day_checkbox">
                <input
                  type="checkbox"
                  className="getValueUsingClass"
                  id="FiveDay"
                  value={"5"}
                  checked={days.includes(5)}
                  onChange={(e) => {
                    daySettingHandler(e.target.value);
                  }}
                />
                <label htmlFor="FiveDay">{t("billDueFiveDay")}</label>
              </div>

              <div className="day_checkbox">
                <input
                  type="checkbox"
                  className="getValueUsingClass"
                  id="SixDay"
                  value={"6"}
                  checked={days.includes(6)}
                  onChange={(e) => {
                    daySettingHandler(e.target.value);
                  }}
                />
                <label htmlFor="SixDay">{t("billDueSixDay")}</label>
              </div>

              <div className="day_checkbox">
                <input
                  type="checkbox"
                  className="getValueUsingClass"
                  id="SevenDay"
                  value={"7"}
                  checked={days.includes(7)}
                  onChange={(e) => {
                    daySettingHandler(e.target.value);
                  }}
                />
                <label htmlFor="SevenDay">{t("billDueSevenDay")}</label>
              </div>
            </div>
            <p className="h6 mt-3"> {t("dueToFinishBillCycle")} </p>
          </div>

          <div className="smsCount">
            <span className="smsLength">
              {t("letter")}
              {(fontValue + smsTemplet + bottomText + paymentLink).length}
            </span>
            <span>
              SMS:
              {smsCount(fontValue + smsTemplet + bottomText + paymentLink)}
            </span>
          </div>

          <textarea
            id="messageTextArea"
            rows="6"
            className="form-control mt-4"
            placeholder={t("messageLikhun")}
            ref={textRef}
            value={bottomText}
            // onClick={insertMyText}
            maxLength={335 - upperText.length}
            onChange={(e) => setBottomText(e.target.value)}
          ></textarea>
          <hr />
          <button
            type="submit"
            // onClick={handleSendMessage}
            className="btn btn-success"
          >
            {loading ? <Loader></Loader> : t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AlertSmsTemplate;
