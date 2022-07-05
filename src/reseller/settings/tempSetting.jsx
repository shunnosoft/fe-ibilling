import Sidebar from "../../components/admin/sidebar/Sidebar";

import { ToastContainer } from "react-toastify";

// internal import
// import "../../pages/message/message.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import "../message/message.css";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
export default function Settings() {
  const { t } = useTranslation();
  const [day, setDay] = useState(0);
  const daySettingHandler = (e) => {
    setDay(e);
    // console.log(e);
  };

  const [cursorPosition, setPosition] = useState(0);
  const [totalText, setTotaltext] = useState("hello world");

  const textRef = useRef();

  const insertMyText = (e) => {
    // console.log(textRef.current.value);
    // let textToInsert = " this is the inserted text ";
    let cp = e.target.selectionStart;
    // console.log(cp);
    setPosition(cp);
  };

  const handletextAdd = (e) => {
    let textBeforeCursorPosition = totalText.substring(0, cursorPosition);
    let textAfterCursorPosition = totalText.substring(
      cursorPosition,
      totalText.length
    );
    var index = totalText.indexOf("Name");
    if (index !== -1) {
      const endIndex = index + totalText.length - 1;
      // console.log(index, endIndex);
    }
    // console.log(textAfterCursorPosition);
    setTotaltext(textBeforeCursorPosition + e + textAfterCursorPosition);
  };
  const keyDown = (e) => {
    // if (e.keyCode === 8) console.log("hello");
  };
  const ssref = useRef();
  const handle = () => {
    // console.log(ssref.current);
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
                <h2 className="collectorTitle">{t("SMStemplate")}</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="profileWrapper uiChange">
                    <div className="AllAreaClass mb-4">
                      <div className="writeMessageSection">
                        <div className="displayFlex">
                          <input
                            checked={day === "1"}
                            type="checkbox"
                            className="getValueUsingClass"
                            value={"1"}
                            onChange={(e) => {
                              daySettingHandler(e.target.value);
                            }}
                          />
                          <label>{t("billDueOneDay")}</label>
                          <input
                            checked={day === "2"}
                            type="checkbox"
                            className="getValueUsingClass"
                            value={"2"}
                            onChange={(e) => {
                              daySettingHandler(e.target.value);
                            }}
                          />
                          <label>{t("billDueTwoDay")}</label>
                          <input
                            type="checkbox"
                            checked={day === "3"}
                            className="getValueUsingClass"
                            value={"3"}
                            onChange={(e) => {
                              daySettingHandler(e.target.value);
                            }}
                          />
                          <label>{t("billDueThreeDay")}</label>
                          <input
                            ref={ssref}
                            type="checkbox"
                            className="getValueUsingClass"
                            value={"5"}
                            onChange={handle}
                          />
                          <label>{t("billDueFiveDay")}</label>
                          <input
                            type="checkbox"
                            checked={day === "7"}
                            className="getValueUsingClass"
                            value={"7"}
                            onChange={(e) => {
                              daySettingHandler(e.target.value);
                            }}
                          />
                          <label>{t("billDueSevenDay")}</label>
                          <button>submit</button>
                        </div>
                        <div>
                          <button
                            value={" Name "}
                            onClick={(e) => handletextAdd(e.target.value)}
                          >
                            Name
                          </button>
                          <button>Amount</button>
                          <button>Date</button>
                        </div>
                        <textarea
                          id="messageTextArea"
                          rows="6"
                          className="form-control mt-4"
                          placeholder={t("messageLikhun")}
                          ref={textRef}
                          value={totalText}
                          onClick={insertMyText}
                          onChange={(e) => setTotaltext(e.target.value)}
                          onKeyDown={keyDown}
                        >
                          {" "}
                        </textarea>
                        <hr />
                        <button
                          // onClick={handleSendMessage}
                          className="btn btn-success"
                        >
                          {t("sendMessage")}
                        </button>
                      </div>
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
