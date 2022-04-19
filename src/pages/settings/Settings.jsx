import Sidebar from "../../components/admin/sidebar/Sidebar";

import { ToastContainer } from "react-toastify";

// internal import
// import "../../pages/message/message.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import "../message/message.css";
import { useRef, useState } from "react";
export default function Settings() {
  const [day, setDay] = useState(0);
  const daySettingHandler = (e) => {
    setDay(e);
    console.log(e);
  };

  const [cursorPosition, setPosition] = useState(0);

  const textRef = useRef("hello world");

  const insertMyText = (e) => {
    console.log(textRef.current.value);
    // let textToInsert = " this is the inserted text ";
    let cp = e.target.selectionStart;
    // console.log(cp);
    setPosition(cp);
    // let textBeforeCursorPosition = e.target.value.substring(0, cursorPosition);
    // let textAfterCursorPosition = e.target.value.substring(
    //   cursorPosition,
    //   e.target.value.length
    // );
    // e.target.value =
    //   textBeforeCursorPosition + textToInsert + textAfterCursorPosition;
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
                <h2 className="collectorTitle">বিলিং সাইকেল এর মেসেজ সেটিং</h2>
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
                          <label>{"একদিন"}</label>
                          <input
                            checked={day === "2"}
                            type="checkbox"
                            className="getValueUsingClass"
                            value={"2"}
                            onChange={(e) => {
                              daySettingHandler(e.target.value);
                            }}
                          />
                          <label>{"দুইদিন"}</label>
                          <input
                            type="checkbox"
                            checked={day === "3"}
                            className="getValueUsingClass"
                            value={"3"}
                            onChange={(e) => {
                              daySettingHandler(e.target.value);
                            }}
                          />
                          <label>{"তিনদিন"}</label>
                          <input
                            type="checkbox"
                            checked={day === "5"}
                            className="getValueUsingClass"
                            value={"5"}
                            onChange={(e) => {
                              daySettingHandler(e.target.value);
                            }}
                          />
                          <label>{"পাঁচদিন"}</label>
                          <input
                            type="checkbox"
                            checked={day === "7"}
                            className="getValueUsingClass"
                            value={"7"}
                            onChange={(e) => {
                              daySettingHandler(e.target.value);
                            }}
                          />
                          <label>{"সাতদিন"}</label>
                          <button>submit</button>
                        </div>
                        <div>
                          <button>Name</button>
                          <button>Amount</button>
                          <button>Date</button>
                        </div>
                        <textarea
                          id="messageTextArea"
                          rows="6"
                          className="form-control mt-4"
                          placeholder="মেসেজ লিখুন..."
                          ref={textRef}
                          onClick={insertMyText}
                        ></textarea>
                        <hr />
                        <button
                          // onClick={handleSendMessage}
                          className="btn btn-success"
                        >
                          সেন্ড মেসেজ
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
