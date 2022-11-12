import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { smsCount } from "../../../components/common/UtilityMethods";
import { smsSettingUpdateIsp } from "../../../features/authSlice";
import { useTranslation } from "react-i18next";

function AlertSmsTemplate() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [totalText, setTotalText] = useState("");

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );
  console.log(settings);
  const dispatch = useDispatch();
  const [bottomText, setBottomText] = useState("");
  const [fontValue, setFontValue] = useState("");
  const [upperText, setUpperText] = useState("");
  const [numberOfDay, setnumberOfDay] = useState();
  const [days, setDays] = useState([]);

  const [billConfirmation, setBillConfirmation] = useState("");
  // const [billconfarmationparametres, setbillconparametres] = useState([]);
  // const [matchFound, setMatchFound] = useState([]);

  const [sendingType, setSendingType] = useState();

  const textRef = useRef();
  const formRef = useRef();

  const [smsTemplet, setTemplet] = useState([]);

  const [alertNum, setAlertNum] = useState("");

  const itemSettingHandler = (item) => {
    if (smsTemplet.includes(item)) {
      const index = smsTemplet.indexOf(item);
      if (index > -1) {
        smsTemplet.splice(index, 1);
      }
    } else {
      if ((upperText + "\n" + bottomText).length + item.length > 334) {
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
        [alertNum]: fontValue + newUpperText + "\n" + bottomText,
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
              <input
                name="billConfirmation"
                type="radio"
                checked={billConfirmation === "on"}
                value={"on"}
                onChange={radioCheckHandler}
              />{" "}
              {t("on")} {"              "}
              <input
                name="billConfirmation"
                type="radio"
                checked={billConfirmation === "off"}
                value={"off"}
                onChange={radioCheckHandler}
              />{" "}
              {t("off")}
            </div>
            <div className="message-sending-type">
              <h4> {t("sendingMessageType")} </h4>
              <input
                name="messageSendingType"
                type="radio"
                checked={sendingType === "nonMasking"}
                value={"nonMasking"}
                onChange={(event) => setSendingType(event.target.value)}
              />{" "}
              {t("nonMasking")} {"              "}
              <input
                name="messageSendingType"
                type="radio"
                checked={sendingType === "masking"}
                value={"masking"}
                onChange={(event) => setSendingType(event.target.value)}
              />{" "}
              {t("masking")} {"              "}
              <input
                name="messageSendingType"
                type="radio"
                checked={sendingType === "fixedNumber"}
                value={"fixedNumber"}
                onChange={(event) => setSendingType(event.target.value)}
              />{" "}
              {t("fixedNumber")} {"              "}
            </div>
          </div>

          <div className="billconfirm">
            <div className="showthesequence">
              <p className="endingText">{fontValue}</p>
              {smsTemplet.map((item, key) => {
                return <p key={key}>{item}</p>;
              })}

              <p className="endingtext">{bottomText}</p>
            </div>

            <div
              style={{
                display: "flex",

                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%",
                marginTop: "10px",
              }}
              className="displayFlexx"
            >
              <div>
                <div className="radioselect">
                  <input
                    id="1"
                    type="checkbox"
                    className="getValueUsingClass"
                    value={"USER: USERNAME"}
                    checked={smsTemplet.includes("USER: USERNAME")}
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
                    checked={smsTemplet.includes("ID: CUSTOMER_ID")}
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
                    checked={smsTemplet.includes("NAME: CUSTOMER_NAME")}
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
                    checked={smsTemplet.includes("BILL: AMOUNT")}
                    value={"BILL: AMOUNT"}
                    onChange={(e) => {
                      itemSettingHandler(e.target.value);
                    }}
                  />
                  <label className="templatelabel" htmlFor="4">
                    {"BILL: AMOUNT"}
                  </label>
                </div>
                <div className="radioselect">
                  <input
                    id="5"
                    type="checkbox"
                    className="getValueUsingClass"
                    checked={smsTemplet.includes("LAST DATE: BILL_DATE")}
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

              {/* //working */}
            </div>
            <div className="templateSelect">
              <select
                style={{
                  width: "150px",
                  border: "2px solid grey",
                  fontWeight: "600",
                  borderRadius: "5px",
                  marginTop: "25px",
                }}
                onChange={(e) => dayTempletHandler(e)}
                name=""
                id=""
              >
                <option value=""> {t("selectTemplate")} </option>
                {smstempletDay
                  .filter((s, i) => days.includes(i + 1))
                  .map((item, index) => {
                    return (
                      <option key={index} value={item.value}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>

              <div className="mt-3">
                <input
                  value={fontValue}
                  onChange={(event) => setFontValue(event.target.value)}
                  class="form-control"
                  type="text"
                  placeholder="Title"
                />
              </div>
            </div>
            <div style={{ marginBotton: "20px" }} className="displayFlex">
              <input
                type="checkbox"
                className="getValueUsingClass"
                value={"1"}
                checked={days.includes(1)}
                onChange={(e) => {
                  daySettingHandler(e.target.value);
                }}
              />
              <label className="mx-3">{t("billDueOneDay")}</label>
              <input
                type="checkbox"
                className="getValueUsingClass"
                value={"2"}
                checked={days.includes(2)}
                onChange={(e) => {
                  daySettingHandler(e.target.value);
                }}
              />
              <label className="mx-3">{t("billDueTwoDay")}</label>
              <input
                type="checkbox"
                className="getValueUsingClass"
                value={"3"}
                checked={days.includes(3)}
                onChange={(e) => {
                  daySettingHandler(e.target.value);
                }}
              />
              <label className="mx-3">{t("billDueThreeDay")}</label>
              <input
                type="checkbox"
                className="getValueUsingClass"
                value={"4"}
                checked={days.includes(4)}
                onChange={(e) => {
                  daySettingHandler(e.target.value);
                }}
              />
              <label className="mx-3">{t("billDueFourDay")}</label>
              <input
                type="checkbox"
                className="getValueUsingClass"
                value={"5"}
                checked={days.includes(5)}
                onChange={(e) => {
                  daySettingHandler(e.target.value);
                }}
              />
              <label className="mx-3">{t("billDueFiveDay")}</label>
              <input
                type="checkbox"
                className="getValueUsingClass"
                value={"6"}
                checked={days.includes(6)}
                onChange={(e) => {
                  daySettingHandler(e.target.value);
                }}
              />
              <label className="mx-3">{t("billDueSixDay")}</label>
              <input
                type="checkbox"
                className="getValueUsingClass"
                value={"7"}
                checked={days.includes(7)}
                onChange={(e) => {
                  daySettingHandler(e.target.value);
                }}
              />
              <label className="mx-3">{t("billDueSevenDay")}</label>
            </div>
            <p style={{ marginTop: "20px" }}> {t("dueToFinishBillCycle")} </p>
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
            ref={textRef}
            value={bottomText}
            // onClick={insertMyText}
            maxLength={335 - upperText.length}
            onChange={(e) => setBottomText(e.target.value)}
          >
            {" "}
          </textarea>
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
