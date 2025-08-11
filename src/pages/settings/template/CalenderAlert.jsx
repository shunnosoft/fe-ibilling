import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { smsCount } from "../../../components/common/UtilityMethods";
import { smsSettingUpdateIsp } from "../../../features/authSlice";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import useISPowner from "../../../hooks/useISPOwner";

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

const CalenderAlert = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //---> @Get user & current user data form useISPOwner hooks
  const { ispOwnerData, ispOwnerId, settings } = useISPowner();

  const [loading, setLoading] = useState(false);

  const [bottomText, setBottomText] = useState("");
  const [fontValue, setFontValue] = useState("");
  const [upperText, setUpperText] = useState("");
  const [days, setDays] = useState([]);
  const [calenderDays, setCalenderDays] = useState([]);

  const [billConfirmation, setBillConfirmation] = useState("");

  const [sendingType, setSendingType] = useState();
  const [selected, setSelected] = useState(true);

  //initially getting the status from settings
  const fetchedStatus = settings?.sms?.template?.calenderAlertCustomerStatus;
  const [status, setStatus] = useState(fetchedStatus ? fetchedStatus : []);

  //select all status button check
  const [allSelect, setAllSelect] = useState(
    fetchedStatus?.length === 5 ? true : false
  );

  const textRef = useRef();
  const formRef = useRef();

  const [smsTemplet, setTemplet] = useState([]);

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

  //Status Handler
  const statusHandler = (e) => {
    const val = e.target.value;
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

  // ispOwner payment gateway payment link
  const customerPaymentLink = `Payment Link: https://app.one-billing.com/isp/${ispOwnerData?.netFeeId}`;

  const itemSettingHandler = (e) => {
    const item = e.target.value;

    if (smsTemplet.includes(item)) {
      const index = smsTemplet.indexOf(item);
      if (index > -1) {
        smsTemplet.splice(index, 1);
      }
      smsTemplet.length === 0 ? setSelected(false) : setSelected(true);
    } else {
      if (
        (fontValue + "\n" + upperText + "\n" + bottomText).length +
          item.length >
        334
      ) {
        toast.error(t("exceedSMSLimit"));
        return;
      } else {
        smsTemplet.push(item);
        setSelected(true);
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
    const fixedValues = [
      "USER: USERNAME",
      "ID: CUSTOMER_ID",
      "NAME: CUSTOMER_NAME",
      "BILL: AMOUNT",
      "LAST DATE: BILL_DATE",
      customerPaymentLink,
    ];
    let found = [];
    let messageBoxStr = settings?.sms?.template?.calenderAlert
      ?.replace("USER: USERNAME", "")
      .replace("ID: CUSTOMER_ID", "")
      .replace("NAME: CUSTOMER_NAME", "")
      .replace("BILL: AMOUNT", "")
      .replace("LAST DATE: BILL_DATE", "")
      .replace(customerPaymentLink, "");

    let temp = messageBoxStr?.split("\n");

    if (temp?.length > 0) {
      setFontValue(temp[0] || "");

      let temptxt = "";
      temp?.map((value, index) => {
        if (index > 1 && value !== "") {
          temptxt += value + "\n";
        }
      });
      setBottomText(temptxt);
    }

    fixedValues.map((i) => {
      if (settings?.sms?.template?.calenderAlert?.includes(i)) {
        found.push(i);
      }
      return found;
    });
    setTemplet(found);
  }, [settings]);

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

    const form = e.target;

    // Extract checked form values safely
    const getCheckedValue = (name) =>
      form[name]?.checked ? form[name].value : "";

    const selectedValues = [
      getCheckedValue("user_name"),
      getCheckedValue("customer_id"),
      getCheckedValue("customer_name"),
      getCheckedValue("amount"),
      getCheckedValue("bill_date"),
      getCheckedValue("payment_link"),
    ];

    // Build `uppText` efficiently using reduce
    const uppText = selectedValues
      .reduce((acc, value) => (value ? `${acc}\n${value}` : acc), "")
      .trim();

    // Extract calendar days values
    const monthDays = calenderDays.map((day) => day.value);

    // Limit `uppText` length based on `smsTemplet`
    const newUppText = uppText
      .split("\n")
      .slice(0, smsTemplet.length + 1)
      .join("\n");

    // Construct API payload
    const data = {
      ...settings?.sms,
      calenderAlertSendBy: sendingType,
      calenderAlert: billConfirmation === "on",
      calenderDays: monthDays,
      template: {
        ...settings?.sms?.template,
        calenderAlert: `${fontValue}${newUppText}\n${bottomText}`,
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
      toast.success(t("alertSMStemplateSaveAlert"));
    } catch (error) {
      toast.error("Error updating SMS settings:", error);
    } finally {
      setLoading(false);
    }
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
              <h4>{t("sendingMessageType")}</h4>
              <div className="smsType">
                {messageTypes.map((type) => (
                  <div className="message_radio" key={type.value}>
                    <input
                      type="radio"
                      id={type.value + "calender"}
                      value={type.value}
                      onChange={(event) => setSendingType(event.target.value)}
                      checked={sendingType === type.value}
                    />
                    <label htmlFor={type.value + "calender"}>
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
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
                      onChange={itemSettingHandler}
                      name="user_name"
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
                      onChange={itemSettingHandler}
                      name="customer_id"
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
                      onChange={itemSettingHandler}
                      name="customer_name"
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
                      onChange={itemSettingHandler}
                      name="amount"
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
                      onChange={itemSettingHandler}
                      name="bill_date"
                    />
                    <label className="templatelabel" htmlFor="customerBillData">
                      {"LAST DATE: BILL_DATE"}
                    </label>
                  </div>

                  {ispOwnerData?.bpSettings.hasPG && (
                    <div className="radioselect">
                      <input
                        id="PAYMENT_LINK_ALERT"
                        type="checkbox"
                        className="getValueUsingClass"
                        value={customerPaymentLink}
                        checked={smsTemplet?.includes(customerPaymentLink)}
                        onChange={itemSettingHandler}
                        name="payment_link"
                      />
                      <label
                        className="templatelabel"
                        htmlFor="PAYMENT_LINK_ALERT"
                      >
                        {"PAYMENT_LINK"}
                      </label>
                    </div>
                  )}
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
                        onChange={statusHandler}
                        name="active"
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
                        onChange={statusHandler}
                        name="inactive"
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
                        onChange={statusHandler}
                        name="expired"
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
                        onChange={statusHandler}
                        name="paid"
                      />
                      <label className="templatelabel" htmlFor="paidCustomer">
                        {t("paid")}
                      </label>
                    </div>
                    <div className="radioselect">
                      <input
                        id="unPaidCustomer"
                        type="checkbox"
                        className="getValueUsingClass"
                        checked={status?.includes("unpaid")}
                        value="unpaid"
                        onChange={statusHandler}
                        name="unpaid"
                      />
                      <label className="templatelabel" htmlFor="unPaidCustomer">
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
                        name="selectAll"
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
                placeholder={t("select")}
              />

              <div className="mt-3">
                <input
                  value={fontValue}
                  onChange={(event) => setFontValue(event.target.value)}
                  className="form-control"
                  type="text"
                  placeholder={t("title")}
                  maxLength={40}
                />
              </div>
            </div>

            <p style={{ marginTop: "20px" }}> {t("selectMonthDate")} </p>
          </div>

          <div className="smsCount">
            <span className="smsLength">
              {t("letter")}
              {(fontValue + smsTemplet + bottomText).length}
            </span>
            <span>SMS: {smsCount(fontValue + smsTemplet + bottomText)}</span>
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
};

export default CalenderAlert;
