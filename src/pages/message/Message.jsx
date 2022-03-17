import { useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

// internal import
import "./message.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";

export default function Message() {
  const [isChecked, setisChecked] = useState(false);
  const area = useSelector((state) => state.area.area);
  // const [areaIds, setAreaIds] = useState([]);

  const handleMessageCheckBox = (e) => {
    setisChecked(e.target.checked);
  };

  const setAreaHandler = () => {
    const temp = document.querySelectorAll(".getValueUsingClass");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    // setAreaIds(IDS_temp);
  };

  // WE GOT ALL AREA_IDS ON -> areaIds;

  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">মেসেজ বোর্ড</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="profileWrapper uiChange">
                    <div className="messageGuide">
                      <h4>যেভাবে আপনি গ্রাহকদের মোবাইলে মেসেজ দিবেনঃ</h4>
                      <p>
                        ১। যে গ্রাহকদের মেসেজ দিতে চান ড্রপডাউন মেনু থেকে
                        সিলেক্ট করুন।
                      </p>
                      <p>
                        ২। মেসেজ বক্সে আপনার মেসেজ লিখুন এবং মেসেজের শেষে অবশ্যই
                        আপনার <b> প্রতিষ্ঠানের নাম</b> লিখুন অথবা{" "}
                        <b>সিগনেচার</b> যুক্ত করে দিন (নিচের মেসেজ বক্সে যেভাবে
                        আছে)
                      </p>
                      <p>
                        ৩। এবার <b> সেন্ড মেসেজ</b> বাটনে ক্লিক করে একটু অপেক্ষা
                        করুন।{" "}
                      </p>
                      <p>
                        ৪। কিছুক্ষণের মধ্যে আপনি দেখতে পাবেন কতজন গ্রাহক মেসেজ
                        পাবে, মেসেজ সাইজ এবং কত টাকা মেসেজের জন্য খরচ হবে।{" "}
                      </p>
                      <p>
                        ৫। এখন আপনি যদি মেসেজ দিতে চান তাহলে OK বাটনে ক্লিক করে
                        কনফার্ম করুন এবং একটু অপেক্ষা করুন।
                      </p>
                      <p>
                        ৬। আপনি একটি কনফার্মেশন মেসেজ দেখতে পাবেন। এবং স্বল্প
                        সময়ের মধ্যে আপনার সম্মানিত গ্রাহকদের মোবাইলে মেসেজ পৌঁছে
                        যাবে।
                      </p>
                    </div>
                    <div className="writeMessageSection">
                      <h4>মেসেজ লিখুন</h4>
                      <hr />
                      <div className="oneElementInput">
                        <input
                          type="checkbox"
                          className="marginRight"
                          onChange={handleMessageCheckBox}
                        />
                        <h6 className="mb-4">
                          একটি নির্দিষ্ট মোবাইল নম্বরে মেসেজ সেন্ড
                        </h6>
                      </div>
                      {isChecked ? (
                        <div className="ifCheckedBox">
                          <p></p>
                          <input
                            type="text"
                            placeholder="মোবাইল নম্বর"
                            className="form-control"
                          />
                        </div>
                      ) : (
                        <div className="ifNotCheckBox">
                          <select
                            id="selectCustomerID1"
                            className="form-select mb-4"
                          >
                            <option value="">গ্রাহক সিলেক্ট করুন</option>
                            <option value="">dummy</option>
                            <option value="">dummy</option>
                          </select>
                          {/* area */}
                          {/* area section*/}
                          <b className="mt-4">এরিয়া সিলেক্ট</b>
                          <div className="AllAreaClass mb-4">
                            {area?.map((val, key) => (
                              <div key={key}>
                                <h6 className="areaParent">{val.name}</h6>
                                {val.subAreas.map((v, k) => (
                                  <div key={k} className="displayFlex">
                                    <input
                                      type="checkbox"
                                      className="getValueUsingClass"
                                      value={v.id}
                                      onChange={setAreaHandler}
                                    />
                                    <label>{v.name}</label>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                          {/* area */}
                          {/* <select
                            id="selectCustomerID3"
                            className="form-select"
                          >
                            <option value="">সকল গ্রাহক</option>
                            <option value="">dummy</option>
                            <option value="">dummy</option>
                          </select> */}
                        </div>
                      )}

                      <textarea
                        id="messageTextArea"
                        rows="6"
                        className="form-control mt-4"
                        placeholder="মেসেজ লিখুন..."
                      ></textarea>
                      <hr />
                      <button className="btn btn-success">সেন্ড মেসেজ</button>
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
