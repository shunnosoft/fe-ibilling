import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { smsSettingUpdateIsp } from "../../../features/authSlice";
import { smsCount } from "../../../components/common/UtilityMethods";

function CreateCustomerSmsTemplate() {
  const [loading, setLoading] = useState(false);
  const [totalText, setTotalText] = useState("");

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );
  const settings = useSelector(
    (state) => state.persistedReducer.auth.userData?.settings
  );
  const dispatch = useDispatch();
  const [bottomText, setBottomText] = useState("");
  const [upperText, setUpperText] = useState("");

  const [billConfirmation, setBillConfirmation] = useState("");
  const [billconfarmationparametres, setbillconparametres] = useState([]);
  const [matchFound, setMatchFound] = useState([]);

  const textRef = useRef();
  const formRef = useRef();

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
      if (totalText.length + item.length > 334) {
        toast.error("মেসেজের অক্ষর লিমিট অতিক্রম করেছে ");
        return;
      }
      matchFound.push(item);
    }

    setMatchFound(matchFound);

    var theText = "";
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
      createCustomer:
        billConfirmation === "on"
          ? true
          : billConfirmation === "off"
          ? false
          : null,
      template: {
        ...settings.sms.template,
        createCustomer: upperText + "\n" + bottomText,
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
      toast.success("নতুন গ্রাহক SMS টেমপ্লেট সেভ সফল হয়েছে");
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
    const fixedvalues = [
      "USER: USERNAME",
      "ID: CUSTOMER_ID",
      "NAME: CUSTOMER_NAME",
      "BILL: AMOUNT",
      "LAST DATE: BILL_DATE",
    ];
    var found = [];

    let messageBoxStr = settings?.sms?.template?.createCustomer
      ?.replace("USER: USERNAME", "")
      .replace("ID: CUSTOMER_ID", "")
      .replace("NAME: CUSTOMER_NAME", "")
      .replace("BILL: AMOUNT", "")
      .replace("LAST DATE: BILL_DATE", "");

    setBottomText(messageBoxStr !== "undefined" ? messageBoxStr?.trim() : "");

    fixedvalues.map((i) => {
      if (settings?.sms?.template?.createCustomer?.includes(i)) {
        found.push(i);
      }
      return found;
    });
    setMatchFound(found);
    // setbillconparametres(found);

    if (settings?.sms?.createCustomer) {
      setBillConfirmation("on");
    } else {
      setBillConfirmation("off");
    }
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
          <h4>নতুন গ্রাহক SMS টেমপ্লেট</h4>
          <div>
            <input
              name="billConfirmation"
              type="radio"
              checked={billConfirmation === "on"}
              value={"on"}
              onChange={radioCheckHandler}
            />{" "}
            অন {"              "}
            <input
              name="billConfirmation"
              type="radio"
              checked={billConfirmation === "off"}
              value={"off"}
              onChange={radioCheckHandler}
            />{" "}
            অফ
          </div>
          <div className="billconfirm">
            <div className="showthesequence">
              {matchFound.map((item, key) => {
                return <p key={key}>{item}</p>;
              })}

              <p className="endingtext">{bottomText}</p>
            </div>
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
              <div className="radioselect">
                <input
                  id="5"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("LAST DATE: BILL_DATE")}
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
          <div className="smsCount">
            <span className="smsLength">
              অক্ষরঃ {(matchFound + bottomText).length}
            </span>
            <span>SMS: {smsCount(matchFound + bottomText)}</span>
          </div>

          <textarea
            id="messageTextArea"
            rows="6"
            className="form-control mt-4"
            placeholder="মেসেজ লিখুন..."
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
            {loading ? <Loader></Loader> : "সেভ"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCustomerSmsTemplate;
