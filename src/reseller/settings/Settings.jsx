import Sidebar from "../../components/admin/sidebar/Sidebar";

import { ToastContainer } from "react-toastify";

import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import "../message/message.css";

import BillConfirmationSmsTemplate from "./template/BillConfirmationSmsTemplate";
import AlertSmsTemplate from "./template/AlertSmsTemplate";
import CreateCustomerSmsTemplate from "./template/CreateCustomerSmsTemplate";
import CustomerInactiveSmsTemplate from "./template/CustomerInactiveSmsTemplate";
import { useState } from "react";
export default function RSettings() {
  const [settingSelect, setSettingSelect] = useState("confirmation");
  const selectSettingHandler = (e) => {
    setSettingSelect(e.target.value);
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="rightSideMikrotik"
                  >
                    <h4 style={{ marginTop: "20px", marginRight: "30px" }}>
                      SMS টেমপ্লেট সিলেক্ট করুন
                    </h4>{" "}
                    <select
                      id="selectMikrotikOption"
                      onChange={selectSettingHandler}
                      className="form-select"
                    >
                      <option value="confirmation">বিল কনফার্মেশন SMS</option>
                      <option value="alert">এলার্ট SMS</option>
                      <option value="newCustomer">নতুন গ্রাহক SMS</option>
                      <option value="inactiveCustomer">
                        গ্রাহক ইন-এক্টিভ SMS
                      </option>
                    </select>
                  </div>
                  <div className="profileWrapper uiChange">
                    {settingSelect === "confirmation" ? (
                      <div className="settingMainDiv  mb-4">
                        <BillConfirmationSmsTemplate />
                      </div>
                    ) : settingSelect === "alert" ? (
                      <div className="settingMainDiv  mb-4">
                        <AlertSmsTemplate />
                      </div>
                    ) : settingSelect === "newCustomer" ? (
                      <div className="settingMainDiv  mb-4">
                        <CreateCustomerSmsTemplate />
                      </div>
                    ) : settingSelect === "inactiveCustomer" ? (
                      <div className="settingMainDiv  mb-4">
                        <CustomerInactiveSmsTemplate />
                      </div>
                    ) : (
                      ""
                    )}
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
