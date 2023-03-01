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
import SalarySMSTemplate from "./template/SalarySMSTemplate";
import ResellerRechargeSmsTemplate from "./template/ResellerRechargeSmsTemplate";
import SMSPurchase from "../message/SMSPurchase";
import { Button } from "react-bootstrap";
export default function Settings() {
  const { t } = useTranslation();
  const [settingSelect, setSettingSelect] = useState("confirmation");
  const [show, setShow] = useState(false);
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
                <div className="collectorTitle d-flex justify-content-between px-5">
                  <div className="d-flex">
                    <div>{t("message setting")}</div>
                  </div>
                  <Button
                    className="header_icon"
                    onClick={() => setShow({ ...show, [false]: true })}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-envelope-plus"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2H2Zm3.708 6.208L1 11.105V5.383l4.708 2.825ZM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2-7-4.2Z" />
                      <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1h-1v-1a.5.5 0 0 0-.5-.5Z" />
                    </svg>
                  </Button>
                </div>
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
                        <BillConfirmationSmsTemplate />
                      </FourGround>
                    </Tab>

                    <Tab
                      className="mt-5"
                      eventKey="alertSms"
                      title={t("alertSMS")}
                    >
                      <FourGround>
                        <AlertSmsTemplate />
                      </FourGround>
                    </Tab>

                    <Tab
                      className="mt-5"
                      eventKey="newCustomer"
                      title={t("newCustomerSMS")}
                    >
                      <FourGround>
                        <CreateCustomerSmsTemplate />
                      </FourGround>
                    </Tab>

                    <Tab
                      className="mt-5"
                      eventKey="inactiveCustomer"
                      title={t("customerInactiveSMS")}
                    >
                      <FourGround>
                        <CustomerInactiveSmsTemplate />
                      </FourGround>
                    </Tab>
                    <Tab
                      className="mt-5"
                      eventKey="staffSalary"
                      title={t("SalarySMS")}
                    >
                      <FourGround>
                        <SalarySMSTemplate />
                      </FourGround>
                    </Tab>
                    <Tab
                      className="mt-5"
                      eventKey="resellerRecharge"
                      title={t("resellerRecharge")}
                    >
                      <FourGround>
                        <ResellerRechargeSmsTemplate />
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
      <SMSPurchase show={show} />
    </>
  );
}
