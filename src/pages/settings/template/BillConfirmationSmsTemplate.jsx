import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import apiLink from "../../../api/apiLink";
import Loader from "../../../components/common/Loader";
import { smsSettingUpdateIsp } from "../../../features/authSlice";
function BillConfirmationSmsTemplate() {
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
        toast.warn("মেসেজের অক্ষর লিমিট অতিক্রম করেছে ");
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
      billConfirmation:
        billConfirmation === "on"
          ? true
          : billConfirmation === "off"
          ? false
          : null,
      template: {
        ...settings.sms.template,
        billConfirmation: upperText + "\n" + bottomText,
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
      "ইউজারনেমঃ USERNAME",
      "ইউজার আইডিঃ USERID",
      "গ্রাহকঃ NAME",
      "বিলঃ AMOUNT",
      "তারিখঃ DATE",
    ];
    var found = [];

    let messageBoxStr = settings?.sms?.template?.billConfirmation
      ?.replace("ইউজারনেমঃ USERNAME", "")
      .replace("ইউজার আইডিঃ USERID", "")
      .replace("গ্রাহকঃ NAME", "")
      .replace("বিলঃ AMOUNT", "")
      .replace("তারিখঃ DATE", "");

    setBottomText(messageBoxStr?.trim());

    fixedvalues.map((i) => {
      if (settings?.sms?.template?.billConfirmation?.includes(i)) {
        found.push(i);
      }
      return found;
    });
    setMatchFound(found);
    // setbillconparametres(found);

    if (settings.sms.billConfirmation) {
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
          <h4>বিল কনফার্মেশন SMS </h4>
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
                  value={"ইউজারনেমঃ USERNAME"}
                  checked={matchFound.includes("ইউজারনেমঃ USERNAME")}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="1">
                  {"ইউজারনেমঃ USERNAME"}
                </label>
              </div>
              <div className="radioselect">
                <input
                  id="2"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("ইউজার আইডিঃ USERID")}
                  value={"ইউজার আইডিঃ USERID"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="2">
                  {"ইউজার আইডিঃ USERID"}
                </label>
              </div>
              <div className="radioselect">
                <input
                  id="3"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("গ্রাহকঃ NAME")}
                  value={"গ্রাহকঃ NAME"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="3">
                  {"গ্রাহকঃ NAME"}
                </label>
              </div>
              <div className="radioselect">
                <input
                  id="4"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("বিলঃ AMOUNT")}
                  value={"বিলঃ AMOUNT"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="4">
                  {"বিলঃ AMOUNT"}
                </label>
              </div>
              <div className="radioselect">
                <input
                  id="5"
                  type="checkbox"
                  className="getValueUsingClass"
                  checked={matchFound.includes("তারিখঃ DATE")}
                  value={"তারিখঃ DATE"}
                  onChange={(e) => {
                    itemSettingHandler(e.target.value);
                  }}
                />
                <label className="templatelabel" htmlFor="5">
                  {"তারিখঃ DATE"}
                </label>
              </div>
            </div>
          </div>
          <div className="smsCount">
            <span className="smsLength">
              অক্ষরঃ{(matchFound + bottomText).length}
            </span>
            <span>
              SMS:
              {Math.ceil([...(matchFound + bottomText)].length / 67)}
            </span>
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

export default BillConfirmationSmsTemplate;
