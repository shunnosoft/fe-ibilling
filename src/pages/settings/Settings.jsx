import Sidebar from "../../components/admin/sidebar/Sidebar";

import { toast, ToastContainer } from "react-toastify";

import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import "../message/message.css";

import { useEffect, useRef, useState } from "react";
import apiLink from "../../api/apiLink";
import { useDispatch, useSelector } from "react-redux";
import { smsSettingUpdateIsp } from "../../features/authSlice";
import BillConfirmationSmsTemplate from "./template/BillConfirmationSmsTemplate";
export default function Settings() {
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
        billConfirmation: upperText + "\n" + bottomText,
      },
    };

    try {
      const res = await apiLink.patch(
        `/ispOwner/settings/sms/${ispOwnerId}`,
        data
      );
      dispatch(smsSettingUpdateIsp(res.data));
    } catch (error) {
      console.log(error);
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

    let messageBoxStr = settings.sms.template.billConfirmation
      .replace("ইউজারনেমঃ USERNAME", "")
      .replace("ইউজার আইডিঃ USERID", "")
      .replace("গ্রাহকঃ NAME", "")
      .replace("বিলঃ AMOUNT", "")
      .replace("তারিখঃ DATE", "");

    setBottomText(messageBoxStr.trim());

    fixedvalues.map((i) => {
      if (settings.sms.template.billConfirmation.includes(i)) {
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
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">সেটিংস</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="profileWrapper uiChange">
                    <div className="settingMainDiv  mb-4">
                      <BillConfirmationSmsTemplate />
                    </div>

                    {/* <div className="settingMainDiv  mb-4">
                      <AlertSmsTemplate />
                    </div>

                    <div className="settingMainDiv  mb-4">
                      <CreateCustomerSmsTemplate />
                    </div>

                    <div className="settingMainDiv  mb-4">
                      <CustomerInactiveSmsTemplate />
                    </div> */}
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
