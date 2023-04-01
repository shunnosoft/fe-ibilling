import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { smsCount } from "../../../components/common/UtilityMethods";
import { smsSettingUpdateIsp } from "../../../features/authSlice";
import { useTranslation } from "react-i18next";
import Select from "react-select";

//All days in a month
const dayOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },
  { value: "14", label: "14" },
  { value: "15", label: "15" },
  { value: "16", label: "16" },
  { value: "17", label: "17" },
  { value: "18", label: "18" },
  { value: "19", label: "19" },
  { value: "20", label: "20" },
  { value: "21", label: "21" },
  { value: "22", label: "22" },
  { value: "23", label: "23" },
  { value: "24", label: "24" },
  { value: "25", label: "25" },
  { value: "26", label: "26" },
  { value: "27", label: "27" },
  { value: "28", label: "28" },
  { value: "29", label: "29" },
  { value: "30", label: "30" },
  { value: "31", label: "31" },
];

function CalenderAlert() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  //get ISP Owner ID
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //get settings
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );

  //get title from settings
  const title = settings?.sms?.template?.calenderAlert?.split("\n")[0];

  //get botttom message from settings
  const message = settings?.sms?.template?.calenderAlert?.split("\n").at(-1);

  //get template Setting removing title and message from first and last
  const templateSetting = settings?.sms?.template?.calenderAlert?.split("\n");
  templateSetting?.pop();
  templateSetting?.shift();

  const dispatch = useDispatch();
  const [bottomText, setBottomText] = useState(message);
  const [fontValue, setFontValue] = useState(title);
  const [upperText, setUpperText] = useState("");
  const [days, setDays] = useState([]);
  const [calenderDays, setCalenderDays] = useState([]);

  const [billConfirmation, setBillConfirmation] = useState("");

  const [sendingType, setSendingType] = useState();

  //initially getting the status from settings
  const fetchedStatus = settings.sms.template.calenderAlertCustomerStatus;
  const [status, setStatus] = useState(fetchedStatus);

  //select all status button check
  const [allSelect, setAllSelect] = useState(
    fetchedStatus?.length === 5 ? true : false
  );

  const textRef = useRef();
  const formRef = useRef();

  const [smsTemplet, setTemplet] = useState(templateSetting);

  //Status Handler
  const statusHandler = (val) => {
    if (!status.includes(val)) setStatus([...status, val]);
    else {
      const newStatus = status.filter((temp) => temp !== val);
      setStatus(newStatus);
    }
  };

  const allSelectHandler = () => {
    if (!allSelect) {
      setStatus(["active", "inactive", "paid", "unpaid", "expired"]);
      setAllSelect(!allSelect);
    } else {
      setStatus([]);
      setAllSelect(!allSelect);
    }
  };

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
    smsTemplet?.map((i) => {
      return (theText = theText + "\n" + i);
    });

    setUpperText(theText);

    setTemplet(smsTemplet);
  };

  const onChangeHandler = (value) => {
    setCalenderDays([...value]);
  };

  useEffect(() => {
    setDays(settings?.sms?.calenderDays);

    if (settings?.sms?.calenderAlert) {
      setBillConfirmation("on");
    } else {
      setBillConfirmation("off");
    }

    setSendingType(settings?.sms?.calenderAlertSendBy);
  }, [settings]);

  const radioCheckHandler = (e) => {
    setBillConfirmation(e.target.value);
  };

  const bottomTextHandler = (item) => {
    setBottomText(item.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allDays = e.target.day;
    let monthDays = [];
    for (let i = 0; i < allDays.length; i++) {
      monthDays.push(allDays[i].value);
    }

    const temp = upperText.split("\n");
    temp.length = smsTemplet.length + 1;
    const newUpperText = temp.join("\n");
    let data = {
      ...settings?.sms,
      calenderAlertSendBy: sendingType,
      calenderAlert:
        billConfirmation === "on"
          ? true
          : billConfirmation === "off"
          ? false
          : null,
      calenderDays: monthDays,
      template: {
        ...settings?.sms?.template,
        calenderAlert: fontValue + newUpperText + "\n" + bottomText,
        calenderAlertCustomerStatus: status,
      },
    };
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

  useEffect(() => {
    const filteredDate = dayOptions?.filter(
      (calenderDay) =>
        calenderDay?.value == days?.find((day) => calenderDay?.value == day)
    );
    setCalenderDays(filteredDate);
  }, [days]);

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
              <h4> {t("calenderAlertTemplate")} </h4>
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
              {smsTemplet?.map((item, key) => {
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
              <div className="d-flex">
                <div className="displayFlexx me-4">
                  <div className="radioselect">
                    <input
                      id="customerUserName"
                      type="checkbox"
                      className="getValueUsingClass"
                      value={"USER: USERNAME"}
                      checked={smsTemplet?.includes("USER: USERNAME")}
                      onChange={(e) => {
                        itemSettingHandler(e.target.value);
                      }}
                    />
                    <label className="templatelabel" htmlFor="customerUserName">
                      {"USER: USERNAME"}
                    </label>
                  </div>
                  <div className="radioselect">
                    <input
                      id="customerUserId"
                      type="checkbox"
                      className="getValueUsingClass"
                      checked={smsTemplet?.includes("ID: CUSTOMER_ID")}
                      value={"ID: CUSTOMER_ID"}
                      onChange={(e) => {
                        itemSettingHandler(e.target.value);
                      }}
                    />
                    <label className="templatelabel" htmlFor="customerUserId">
                      {"ID: CUSTOMER_ID"}
                    </label>
                  </div>
                  <div className="radioselect">
                    <input
                      id="customerName"
                      type="checkbox"
                      className="getValueUsingClass"
                      checked={smsTemplet?.includes("NAME: CUSTOMER_NAME")}
                      value={"NAME: CUSTOMER_NAME"}
                      onChange={(e) => {
                        itemSettingHandler(e.target.value);
                      }}
                    />
                    <label className="templatelabel" htmlFor="customerName">
                      {"NAME: CUSTOMER_NAME"}
                    </label>
                  </div>
                  <div className="radioselect">
                    <input
                      id="customerBillAmount"
                      type="checkbox"
                      className="getValueUsingClass"
                      checked={smsTemplet?.includes("BILL: AMOUNT")}
                      value={"BILL: AMOUNT"}
                      onChange={(e) => {
                        itemSettingHandler(e.target.value);
                      }}
                    />
                    <label
                      className="templatelabel"
                      htmlFor="customerBillAmount"
                    >
                      {"BILL: AMOUNT"}
                    </label>
                  </div>
                  <div className="radioselect">
                    <input
                      id="customerBillData"
                      type="checkbox"
                      className="getValueUsingClass"
                      checked={smsTemplet?.includes("LAST DATE: BILL_DATE")}
                      value={"LAST DATE: BILL_DATE"}
                      onChange={(e) => {
                        itemSettingHandler(e.target.value);
                      }}
                    />
                    <label className="templatelabel" htmlFor="customerBillData">
                      {"LAST DATE: BILL_DATE"}
                    </label>
                  </div>
                </div>

                <div>
                  <div>
                    <div className="radioselect">
                      <input
                        id="activeCustomer"
                        type="checkbox"
                        className="getValueUsingClass"
                        value="active"
                        checked={status?.includes("active")}
                        onChange={(e) => {
                          statusHandler(e.target.value);
                        }}
                      />
                      <label className="templatelabel" htmlFor="activeCustomer">
                        {t("active")}
                      </label>
                    </div>
                    <div className="radioselect">
                      <input
                        id="inactiveCustomer"
                        type="checkbox"
                        className="getValueUsingClass"
                        value="inactive"
                        checked={status?.includes("inactive")}
                        onChange={(e) => {
                          statusHandler(e.target.value);
                        }}
                      />
                      <label
                        className="templatelabel"
                        htmlFor="inactiveCustomer"
                      >
                        {t("inactive")}
                      </label>
                    </div>

                    <div className="radioselect">
                      <input
                        id="expiredCustomer"
                        type="checkbox"
                        className="getValueUsingClass"
                        value="expired"
                        checked={status?.includes("expired")}
                        onChange={(e) => {
                          statusHandler(e.target.value);
                        }}
                      />
                      <label
                        className="templatelabel"
                        htmlFor="expiredCustomer"
                      >
                        {t("expired")}
                      </label>
                    </div>
                    <div className="radioselect">
                      <input
                        id="paidCustomer"
                        type="checkbox"
                        className="getValueUsingClass"
                        checked={status?.includes("paid")}
                        value="paid"
                        onChange={(e) => {
                          statusHandler(e.target.value);
                        }}
                      />
                      <label className="templatelabel" htmlFor="paidCustomer">
                        {t("paid")}
                      </label>
                    </div>
                    <div className="radioselect">
                      <input
                        id="10"
                        type="checkbox"
                        className="getValueUsingClass"
                        checked={status?.includes("unpaid")}
                        value="unpaid"
                        onChange={(e) => {
                          statusHandler(e.target.value);
                        }}
                      />
                      <label className="templatelabel" htmlFor="10">
                        {t("unpaid")}
                      </label>
                    </div>
                    <div className="radioselect">
                      <input
                        id="selectAllCustomerStatus"
                        type="checkbox"
                        className="getValueUsingClass"
                        checked={allSelect}
                        value="selectAll"
                        onChange={allSelectHandler}
                      />
                      <label
                        className="templatelabel"
                        htmlFor="selectAllCustomerStatus"
                      >
                        {t("selectAll")}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* //working */}
            </div>

            <div className="templateSelect">
              <Select
                value={calenderDays}
                onChange={onChangeHandler}
                isMulti
                name="day"
                options={dayOptions}
                className="basic-multi-select"
                classNamePrefix="select"
              />

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

            <p style={{ marginTop: "20px" }}> {t("selectMonthDate")} </p>
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
            onChange={bottomTextHandler}
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

export default CalenderAlert;
