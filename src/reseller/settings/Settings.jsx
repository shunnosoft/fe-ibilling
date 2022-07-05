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
import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
export default function RSettings() {
  const { t } = useTranslation();
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
                <h2 className="collectorTitle">{t("message setting")}</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <Tabs
                    defaultActiveKey="billConfirmation"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab
                      className="mt-5"
                      eventKey="billConfirmation"
                      title={t("billConfirmSMS")}
                    >
                      <FourGround>
                        <BillConfirmationSmsTemplate></BillConfirmationSmsTemplate>
                      </FourGround>
                    </Tab>

                    <Tab
                      className="mt-5"
                      eventKey="alertSms"
                      title={t("alertSMS")}
                    >
                      <FourGround>
                        <AlertSmsTemplate></AlertSmsTemplate>
                      </FourGround>
                    </Tab>

                    <Tab
                      className="mt-5"
                      eventKey="newCustomer"
                      title={t("newCustomerSMS")}
                    >
                      <FourGround>
                        <CreateCustomerSmsTemplate></CreateCustomerSmsTemplate>
                      </FourGround>
                    </Tab>

                    <Tab
                      className="mt-5"
                      eventKey="inactiveCustomer"
                      title={t("customerInactiveSMS")}
                    >
                      <FourGround>
                        <CustomerInactiveSmsTemplate></CustomerInactiveSmsTemplate>
                      </FourGround>
                    </Tab>
                  </Tabs>
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
