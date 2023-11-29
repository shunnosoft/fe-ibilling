import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { smsSettingUpdateIsp } from "../../../features/authSlice";
import { smsCount } from "../../../components/common/UtilityMethods";
import { useTranslation } from "react-i18next";

function BillConfirmationSmsTemplate() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [totalText, setTotalText] = useState("");

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );

  const dispatch = useDispatch();
  const textRef = useRef();
  const formRef = useRef();
  const [fontText, setFontText] = useState("");
  const [bottomText, setBottomText] = useState("");

  const [upperText, setUpperText] = useState("");

  const [billConfirmation, setBillConfirmation] = useState("");
  const [billconfarmationparametres, setbillconparametres] = useState([]);
  const [matchFound, setMatchFound] = useState([]);
  const [sendingType, setSendingType] = useState();

  const [inputValue, setInputValue] = useState("");

  const itemSettingHandler = (item) => {
    if (billconfarmationparametres.includes(item)) {
      const index = billconfarmationparametres.indexOf(item);
      if (index > -1) {
        billconfarmationparametres.splice(index, 1);
      }
    } else {
      billconfarmationparametres.push(item);
    }
    if (matchFound.includes(item)) {
      const index = matchFound.indexOf(item);
      if (index > -1) {
        matchFound.splice(index, 1);
      }
    } else {
      if ((fontText + totalText + item).length > 334) {
        toast.error(t("exceedSMSLimit"));
        return;
      }
      matchFound.push(item);
    }

    setMatchFound(matchFound);

    let theText = "";
    matchFound.map((i) => {
      return (theText = theText + "\n" + i);
    });
    setUpperText(theText);

    setbillconparametres(billconfarmationparametres);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {
      ...settings.sms,
      billConfirmationSendBy: sendingType,
      billConfirmation:
        billConfirmation === "on"
          ? true
          : billConfirmation === "off"
          ? false
          : null,
      template: {
        ...settings.sms.template,
        billConfirmation: fontText + upperText + "\n" + bottomText,
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
      toast.success(t("billConfirmationSaveSuccess"));
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // formRef.current.reset();
  };
  useEffect(() => {
    var theText = "";
    matchFound.map((i) => {
      return (theText = theText + "\n" + i);
    });

    setUpperText(theText);
    setTotalText(upperText + bottomText);
  }, [matchFound, bottomText, upperText]);

  useEffect(() => {
    const fixedValues = [
      "USER: USERNAME",
      "ID: CUSTOMER_ID",
      "NAME: CUSTOMER_NAME",
      "BILL: AMOUNT",
      "DATE: BILL_NOTE_DATE",
      "MONTH: BILL_MONTH",
      "NOTE: BILL_NOTE",
      "DUE: BILL_DUE",
      "PAID AT: PAID_AT",
    ];
    let found = [];
    let messageBoxStr = settings?.sms?.template?.billConfirmation
      ?.replace("USER: USERNAME", "")
      .replace("ID: CUSTOMER_ID", "")
      .replace("NAME: CUSTOMER_NAME", "")
      .replace("BILL: AMOUNT", "")
      .replace("DATE: BILL_NOTE_DATE", "")
      .replace("MONTH: BILL_MONTH", "")
      .replace("NOTE: BILL_NOTE", "")
      .replace("DUE: BILL_DUE", "")
      .replace("PAID AT: PAID_AT", "");

    let temp = messageBoxStr?.split("\n");

    if (temp?.length > 0) {
      setFontText(temp[0] || "");

      let temptxt = "";
      temp?.map((value, index) => {
        if (index > 1 && value !== "") {
          temptxt += value + "\n";
        }
      });
      setBottomText(temptxt);
    }

    fixedValues.map((i) => {
      if (settings?.sms?.template?.billConfirmation?.includes(i)) {
        found.push(i);
      }
      return found;
    });
    setMatchFound(found);
    // setbillconparametres(found);

    if (settings?.sms?.billConfirmation) {
      setBillConfirmation("on");
    } else {
      setBillConfirmation("off");
    }

    setSendingType(settings?.sms?.billConfirmationSendBy);
  }, [settings]);

  const radioCheckHandler = (e) => {
    setBillConfirmation(e.target.value);
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
              <h4> {t("billConfirmSMStemplate")} </h4>
              <div className="displayGrid1 mb-3">
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

              <div className="">
                {/* <label className="templatelabel" htmlFor="20">
                    {"ID: CUSTOMER_ID"}
                  </label> */}
                <input
                  // style={{ width: "90%" }}
                  value={fontText}
                  onChange={(event) => setFontText(event.target.value)}
                  class="form-control"
                  type="text"
                  placeholder="Title"
                  maxLength={40}
                />
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
              <p className="endingText">{fontText}</p>
              {matchFound.map((item, key) => {
                return <p key={key}>{item}</p>;
              })}

              <p className="endingtext">{bottomText}</p>
            </div>

            <div className="d-flex">
              <div className="displayFlexx">
                <div className="radioselect">
                  <input
                    id="1"
                    type="checkbox"
                    className="getValueUsingClass"
                    value={"USER: USERNAME"}
                    checked={matchFound.includes("USER: USERNAME")}
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
                    checked={matchFound.includes("ID: CUSTOMER_ID")}
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
                    checked={matchFound.includes("NAME: CUSTOMER_NAME")}
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
                    checked={matchFound.includes("BILL: AMOUNT")}
                    value={"BILL: AMOUNT"}
                    onChange={(e) => {
                      itemSettingHandler(e.target.value);
                    }}
                  />
                  <label className="templatelabel" htmlFor="4">
                    {"BILL: AMOUNT"}
                  </label>
                </div>
              </div>
              <div>
                <div>
                  <div className="radioselect">
                    <input
                      id="5"
                      type="checkbox"
                      className="getValueUsingClass"
                      value={"DUE: BILL_DUE"}
                      checked={matchFound.includes("DUE: BILL_DUE")}
                      onChange={(e) => {
                        itemSettingHandler(e.target.value);
                      }}
                    />
                    <label className="templatelabel" htmlFor="5">
                      {"DUE: BILL_DUE"}
                    </label>
                  </div>
                  <div className="radioselect">
                    <input
                      id="6"
                      type="checkbox"
                      className="getValueUsingClass"
                      value={"NOTE: BILL_NOTE"}
                      checked={matchFound.includes("NOTE: BILL_NOTE")}
                      onChange={(e) => {
                        itemSettingHandler(e.target.value);
                      }}
                    />
                    <label className="templatelabel" htmlFor="6">
                      {"NOTE: BILL_NOTE"}
                    </label>
                  </div>

                  <div className="radioselect">
                    <input
                      id="7"
                      type="checkbox"
                      className="getValueUsingClass"
                      value={"MONTH: BILL_MONTH"}
                      checked={matchFound.includes("MONTH: BILL_MONTH")}
                      onChange={(e) => {
                        itemSettingHandler(e.target.value);
                      }}
                    />
                    <label className="templatelabel" htmlFor="7">
                      {"MONTH: BILL_MONTH"}
                    </label>
                  </div>
                  <div className="radioselect">
                    <input
                      id="8"
                      type="checkbox"
                      className="getValueUsingClass"
                      checked={matchFound.includes("DATE: BILL_NOTE_DATE")}
                      value={"DATE: BILL_NOTE_DATE"}
                      onChange={(e) => {
                        itemSettingHandler(e.target.value);
                      }}
                    />
                    <label className="templatelabel" htmlFor="8">
                      {"DATE: BILL_NOTE_DATE"}
                    </label>
                  </div>
                  <div className="radioselect">
                    <input
                      id="9"
                      type="checkbox"
                      className="getValueUsingClass"
                      checked={matchFound.includes("PAID AT: PAID_AT")}
                      value={"PAID AT: PAID_AT"}
                      onChange={(e) => {
                        itemSettingHandler(e.target.value);
                      }}
                    />
                    <label className="templatelabel" htmlFor="9">
                      {"PAID AT: PAID_AT"}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* </div> */}
          <div className="smsCount">
            <span className="smsLength">
              {t("letter")} {(fontText + matchFound + bottomText).length}
            </span>
            <span>SMS: {smsCount(fontText + matchFound + bottomText)}</span>
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
            {loading ? <Loader /> : t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BillConfirmationSmsTemplate;
