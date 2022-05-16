import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

// internal import
import "./message.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import SmsParchase from "./smsParchaseModal";
import { ArrowClockwise, RecordFill } from "react-bootstrap-icons";
import Loader from "../../components/common/Loader";
import { getCustomer } from "../../features/apiCalls";
import apiLink from "../../api/apiLink";
import { useCallback } from "react";

const isBangla = (str) => {
  for (var i = 0, n = str.length; i < n; i++) {
    if (str.charCodeAt(i) > 255) {
      return true;
    }
  }
  return false;
};

const useForceUpdate = () => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
};

export default function Message() {
  const reset = useForceUpdate();
  const userRole = useSelector((state) => state.persistedReducer.auth.role);
  const [sms, setSms] = useState("");
  const [isChecked, setisChecked] = useState(false);
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [isRefrsh, setIsrefresh] = useState(false);
  const area = useSelector((state) => state.persistedReducer.area.area);
  const [areaIds, setAreaIds] = useState([]);
  const [days, setDays] = useState([]);
  const [smsReceiverType, setsmsReceiverType] = useState("");

  const userData = useSelector((state) => state.persistedReducer.auth.userData);
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );
  const handleMessageCheckBox = (e) => {
    setisChecked(e.target.checked);
  };
  const dispatch = useDispatch();
  const mobileNumRef = useRef();
  const smsRef = useRef();

  const getIspownerwitSMS = useCallback(async () => {
    setIsrefresh(true);
    try {
      const res = await apiLink.get(`/ispOwner/${ispOwnerId}`);
      setSms(res.data.smsBalance);
      setIsrefresh(false);
    } catch (error) {
      console.log(error.response?.data.message);
      setIsrefresh(false);
    }
  }, [ispOwnerId]);

  useEffect(() => {
    if (userRole === "ispOwner" || userRole === "manager") {
      getIspownerwitSMS();
    }
  }, [userRole, getIspownerwitSMS]);

  const setAreaHandler = () => {
    const temp = document.querySelectorAll(".getValueUsingClass");
    let IDS_temp = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].checked === true) {
        IDS_temp.push(temp[i].value);
      }
    }
    setAreaIds(IDS_temp);
  };

  // WE GOT ALL AREA_IDS ON -> areaIds;
  const handleStatusSelect = (e) => {
    setStatus(e);
  };
  const handlePaymentSelect = (e) => {
    setPayment(e);
  };

  // day checkbox select
  const daySettingHandler = (e) => {
    let item = Number(e);
    if (days.includes(item)) {
      const index = days.indexOf(item);
      if (index > -1) {
        days.splice(index, 1);
      }
    } else {
      days.push(item);
    }

    setDays(days);
  };

  const customers = useSelector(
    (state) => state.persistedReducer.customer.customer
  );

  const [loading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    const now = moment();
    try {
      const owner = await apiLink.get(`/ispOwner/${ispOwnerId}`);
      // setSms(owner.data.smsBalance);
      const res = await apiLink.get(`/ispOwner/customer/${ispOwnerId}`);

      let items = [],
        totalSmsCount = 0;

      res.data.map((customer) => {
        var dueDate = moment(customer.billingCycle);
        if (
          customer.mobile &&
          customer.paymentStatus === "unpaid" &&
          areaIds.includes(customer.subArea) &&
          days.includes(dueDate.diff(now, "days"))
        ) {
          const msg = `আইডিঃ ${customer.customerId}\nইউজারনেমঃ ${
            customer?.pppoe?.name
          }\nগ্রাহকঃ ${customer.name}\nবিলঃ ${
            customer.monthlyFee
          } Tk\nতারিখঃ ${moment(customer.billingCycle).format(
            "DD-MM-YYYY"
          )}\n\n${smsRef.current.value}`;

          const isBanglaFlag = isBangla(msg);
          const singleSms = isBanglaFlag ? 67 : 160;
          const smsCount = Math.ceil([...msg].length / singleSms);
          totalSmsCount += smsCount;

          const sms = {
            app: "netfee",
            senderId: ispOwnerId,
            message: msg,
            type: "bulk",
            mobile: customer.mobile,
            count: smsCount,
          };

          items.push(sms);
        }
      });
      alert(`স্যাম্পল SMS:\n\n${items[0].message}`);
      if (owner.data.smsBalance >= totalSmsCount) {
        let con = window.confirm(
          `${items.length} জন গ্রাহক মেসেজ পাবে। ${totalSmsCount} টি SMS খরচ হবে।`
        );
        if (con && items.length) {
          // post
          const res = await apiLink.post(`sms/bulk/${ispOwnerId}`, {
            items,
            totalSmsCount,
          });

          if (res.data.status) {
            setAreaIds([]);
            setDays([]);
            smsRef.current.value = "";
            toast.success("সফলভাবে SMS পাঠানো হয়েছে।");
            window.location.reload();
          }
        }
      } else {
        toast.error(
          "দুঃখিত, আপনার পর্যাপ্ত SMS ব্যাল্যান্স নেই। দয়া করে SMS রিচার্জ করুন।"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSMSreceiver = (e) => {
    console.log(e.target.value);
    setsmsReceiverType(e.target.value);
  };
  return (
    <>
      <SmsParchase></SmsParchase>
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
                    <div className="smsbal">
                      <div className="refreshDiv">
                        <div className="balancetext">
                          এসএমএস ব্যালান্সঃ
                          <strong className="mainsmsbalance">{sms}</strong>
                        </div>
                        <div title="রিফ্রেশ করুন" className="refreshIcon">
                          {isRefrsh ? (
                            <Loader></Loader>
                          ) : (
                            <ArrowClockwise
                              onClick={() => getIspownerwitSMS()}
                            ></ArrowClockwise>
                          )}
                        </div>
                      </div>

                      {userRole === "ispOwner" && (
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#smsparchase"
                          className="buysms"
                        >
                          এসএমএস কিনুন
                        </button>
                      )}
                    </div>

                    {/* <div className="messageGuide">
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
                    </div> */}
                    <div className="writeMessageSection">
                      {/* <h4>মেসেজ লিখুন</h4>
                      <hr /> */}
                      {/* <div className="oneElementInput">
                        <input
                          type="checkbox"
                          className="marginRight"
                          onChange={handleMessageCheckBox}
                        />
                        <h6 className="mb-4">
                          একটি নির্দিষ্ট মোবাইল নম্বরে মেসেজ সেন্ড
                        </h6>
                      </div> */}
                      {isChecked ? (
                        <div className="ifCheckedBox">
                          <p></p>
                          <input
                            type="text"
                            placeholder="মোবাইল নম্বর"
                            className="form-control"
                            ref={mobileNumRef}
                          />
                        </div>
                      ) : (
                        <div className="ifNotCheckBox">
                          {/* <div className="cusSelect">
                            <select
                              id="selectCustomerID1"
                              className="form-select mb-4"
                              onChange={(e) =>
                                handleStatusSelect(e.target.value)
                              }
                            >
                              <option value="">সকল গ্রাহক</option>
                              <option value="active">এক্টিভ</option>
                              <option value="inactive">ইনক্টিভ</option>
                            </select>
                            <select
                              id="selectCustomerID1"
                              className="form-select mb-4"
                              onChange={(e) =>
                                handlePaymentSelect(e.target.value)
                              }
                            >
                              <option value="">সকল গ্রাহক</option>
                              <option value="paid">পরিশোধ</option>
                              <option value="unpaid">বকেয়া </option>
                            </select>
                          </div> */}
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
                          <div className="radio-buttons">
                            <div>
                              <input
                                id="bilDateEnd"
                                value="bilDate"
                                name="platform"
                                type="radio"
                                className="form-check-input"
                                onChange={(e) => handleSMSreceiver(e)}
                              />
                              <label
                                className="form-check-lebel ms-2"
                                htmlFor="bilDateEnd"
                              >
                                বিল ডেট শেষ হতে বাকিঃ
                              </label>
                              {smsReceiverType === "bilDate" ? (
                                <div style={{}} className="displayFlex">
                                  <input
                                    type="checkbox"
                                    className="getValueUsingClass"
                                    value={"1"}
                                    onChange={(e) => {
                                      daySettingHandler(e.target.value);
                                    }}
                                  />
                                  <label className="mx-3">{"এক দিন"}</label>
                                  <input
                                    type="checkbox"
                                    className="getValueUsingClass"
                                    value={"2"}
                                    onChange={(e) => {
                                      daySettingHandler(e.target.value);
                                    }}
                                  />
                                  <label className="mx-3">{"দুই দিন"}</label>
                                  <input
                                    type="checkbox"
                                    className="getValueUsingClass"
                                    value={"3"}
                                    onChange={(e) => {
                                      daySettingHandler(e.target.value);
                                    }}
                                  />
                                  <label className="mx-3">{"তিন দিন"}</label>
                                  <input
                                    type="checkbox"
                                    className="getValueUsingClass"
                                    value={"5"}
                                    onChange={(e) => {
                                      daySettingHandler(e.target.value);
                                    }}
                                  />
                                  <label className="mx-3">{"পাঁচ দিন"}</label>
                                  <input
                                    type="checkbox"
                                    className="getValueUsingClass"
                                    value={"7"}
                                    onChange={(e) => {
                                      daySettingHandler(e.target.value);
                                    }}
                                  />
                                  <label className="mx-3">{"সাত দিন"}</label>
                                </div>
                              ) : (
                                ""
                              )}
                            </div>
                            <div>
                              <input
                                id="allCustomer"
                                value="allCustomer"
                                name="platform"
                                type="radio"
                                className="form-check-input"
                                onChange={(e) => handleSMSreceiver(e)}
                              />
                              <label
                                className="form-check-lebel ms-2"
                                htmlFor="allCustomer"
                              >
                                সকল গ্রাহক
                              </label>
                            </div>
                            <div>
                              <input
                                id="paid"
                                value="paid"
                                name="platform"
                                type="radio"
                                className="form-check-input"
                                onChange={(e) => handleSMSreceiver(e)}
                              />
                              <label
                                className="form-check-lebel ms-2"
                                htmlFor="paid"
                              >
                                পেইড
                              </label>
                            </div>
                            <div>
                              <input
                                id="unpaid"
                                value="unpaid"
                                name="platform"
                                className="form-check-input"
                                type="radio"
                                onChange={(e) => handleSMSreceiver(e)}
                              />
                              <label
                                className="form-check-lebel ms-2"
                                htmlFor="unpaid"
                              >
                                বকেয়া
                              </label>
                            </div>

                            <div>
                              <input
                                id="activee"
                                value="active"
                                name="platform"
                                type="radio"
                                className="form-check-input"
                                onChange={(e) => handleSMSreceiver(e)}
                              />
                              <label
                                className="form-check-lebel ms-2"
                                htmlFor="activee"
                              >
                                এক্টিভ
                              </label>
                            </div>
                            <div>
                              <input
                                id="inactive"
                                value="inactive"
                                name="platform"
                                type="radio"
                                className="form-check-input"
                                onChange={(e) => handleSMSreceiver(e)}
                              />
                              <label
                                className="form-check-lebel ms-2"
                                htmlFor="inactive"
                              >
                                ইন-একটিভ
                              </label>
                            </div>
                            <div>
                              <input
                                id="expire"
                                value="expire"
                                name="platform"
                                type="radio"
                                className="form-check-input"
                                onChange={(e) => handleSMSreceiver(e)}
                              />
                              <label
                                className="form-check-lebel ms-2"
                                htmlFor="expire"
                              >
                                Expire
                              </label>
                            </div>
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

                      <br />
                      <p>
                        আইডিঃ ID
                        <br />
                        গ্রাহকঃ NAME
                        <br />
                        বিলঃ AMOUNT Tk
                        <br />
                        তারিখঃ DATE
                        <br />
                      </p>

                      <textarea
                        id="messageTextArea"
                        rows="6"
                        className="form-control mt-4"
                        placeholder="মেসেজ লিখুন..."
                        ref={smsRef}
                        // onChange={handleMessageChange}
                      ></textarea>
                      <hr />
                      <button
                        onClick={handleSendMessage}
                        className="btn btn-success"
                      >
                        সেন্ড মেসেজ
                      </button>
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
