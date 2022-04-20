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
  const [cursorPosition, setPosition] = useState(0);
  const [totalText, setTotaltext] = useState("");
  const [initialText, setinitialtext] = useState("");
  console.log(initialText);
  const textRef = useRef();
  const formRef = useRef();
  console.log(textRef.current?.value);
  const [billconfarmationparametres, setbillconparametres] = useState([]);

  const daySettingHandler = (item) => {
    if (billconfarmationparametres.includes(item)) {
      const index = billconfarmationparametres.indexOf(item);
      if (index > -1) {
        billconfarmationparametres.splice(index, 1);
      }
    } else {
      billconfarmationparametres.push(item);
    }
    console.log(billconfarmationparametres);

    var theText = "";
    billconfarmationparametres.map((i) => {
      return (theText = theText + "\n" + i + "\n ");
    });
    console.log(theText);
    setinitialtext(theText);
    setbillconparametres(billconfarmationparametres);
  };

  // const insertMyText = (e) => {
  //   console.log(textRef.current.value);
  //   // let textToInsert = " this is the inserted text ";
  //   let cp = e.target.selectionStart;
  //   // console.log(cp);
  //   setPosition(cp);
  // };

  const handletextAdd = (e) => {
    let textBeforeCursorPosition = totalText.substring(0, cursorPosition);
    let textAfterCursorPosition = totalText.substring(
      cursorPosition,
      totalText.length
    );
    var index = totalText.indexOf("Name");
    if (index !== -1) {
      const endIndex = index + totalText.length - 1;
      console.log(index, endIndex);
    }
    console.log(textAfterCursorPosition);
    setTotaltext(textBeforeCursorPosition + e + textAfterCursorPosition);
  };
  const keyDown = (e) => {
    if (e.keyCode === 8) console.log("hello");
  };
  const ssref = useRef();
  const handlesubmitform = (e) => {
    e.preventDefault();
    // console.log(ssref.current);
    console.log("hello");
    formRef.current.reset();
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
                <h2 className="collectorTitle">এস এম এস টেমপ্লেট</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="profileWrapper uiChange">
                    <div className="AllAreaClass mb-4">
                      <form
                        ref={formRef}
                        onSubmit={handlesubmitform}
                        action=""
                        className="settingForm"
                      >
                        <div className="writeMessageSection">
                          <h4>
                            বিল কনফার্মেশন এস এম এস{" "}
                            <div>
                              <input type="checkbox" />
                              <input type="checkbox" />
                            </div>
                          </h4>
                          <div className="billconfirm">
                            <div className="showthesequence">
                              {billconfarmationparametres.map((item, key) => {
                                return <p key={key}>{item}</p>;
                              })}

                              <p className="endingtext">
                                {textRef.current?.value}
                              </p>
                            </div>
                            <div className="displayFlexx">
                              <div className="radioselect">
                                <input
                                  id="1"
                                  type="checkbox"
                                  className="getValueUsingClass"
                                  value={"ইউজারনেমঃ USERNAME"}
                                  onChange={(e) => {
                                    daySettingHandler(e.target.value);
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
                                  value={"ইউজার আইডিঃ USERID"}
                                  onChange={(e) => {
                                    daySettingHandler(e.target.value);
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
                                  value={"গ্রাহকঃ NAME"}
                                  onChange={(e) => {
                                    daySettingHandler(e.target.value);
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
                                  value={"বিলঃ AMOUNT"}
                                  onChange={(e) => {
                                    daySettingHandler(e.target.value);
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
                                  value={"তারিখঃ DATE"}
                                  onChange={(e) => {
                                    daySettingHandler(e.target.value);
                                  }}
                                />
                                <label className="templatelabel" htmlFor="5">
                                  {"তারিখঃ DATE"}
                                </label>
                              </div>
                            </div>
                          </div>
                          <textarea
                            id="messageTextArea"
                            rows="6"
                            className="form-control mt-4"
                            placeholder="মেসেজ লিখুন..."
                            ref={textRef}
                            value={totalText}
                            // onClick={insertMyText}
                            onChange={(e) => setTotaltext(e.target.value)}
                            onKeyDown={keyDown}
                          >
                            {" "}
                          </textarea>
                          <hr />
                          <button
                            type="submit"
                            // onClick={handleSendMessage}
                            className="btn btn-success"
                          >
                            সেভ
                          </button>
                        </div>
                      </form>
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
