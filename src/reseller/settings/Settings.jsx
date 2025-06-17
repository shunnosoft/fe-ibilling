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
import CustomerTicketSmsTemplate from "../../pages/settings/template/CustomerTicketSmsTemplate";
import { PlayBtn } from "react-bootstrap-icons";
import PlayTutorial from "../../pages/tutorial/PlayTutorial";
export default function RSettings() {
  const { t } = useTranslation();

  //===============|| Local State ||================//
  const [settingSelect, setSettingSelect] = useState("confirmation");
  const [show, setShow] = useState(false);
  const [modalStatus, setModalStatus] = useState("");

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
                <div className="collectorTitle d-flex justify-content-between px-4">
                  <div>{t("message setting")}</div>

                  <div className="d-flex align-items-center">
                    <div className="addAndSettingIcon">
                      <PlayBtn
                        className="addcutmButton"
                        onClick={() => {
                          setModalStatus("playTutorial");
                          setShow(true);
                        }}
                        title={t("tutorial")}
                      />
                    </div>

                    {/* <div
                      className="textButton"
                      onClick={() => {
                        setModalStatus("buySms");
                        setShow(true);
                      }}
                    >
                      <EnvelopePlus className="text_icons" /> {t("buySms")}
                    </div> */}
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper p-3">
                  <Tabs
                    defaultActiveKey="billConfirmation"
                    id="uncontrolled-tab-example"
                    className="mb-3 rounded"
                  >
                    <Tab
                      eventKey="billConfirmation"
                      title={t("billConfirmSMS")}
                    >
                      <FourGround>
                        <BillConfirmationSmsTemplate />
                      </FourGround>
                    </Tab>

                    <Tab eventKey="alertSms" title={t("alertSMS")}>
                      <FourGround>
                        <AlertSmsTemplate />
                      </FourGround>
                    </Tab>

                    <Tab eventKey="newCustomer" title={t("newCustomerSMS")}>
                      <FourGround>
                        <CreateCustomerSmsTemplate />
                      </FourGround>
                    </Tab>

                    <Tab
                      eventKey="expiredCustomer"
                      title={t("expiredCustomer")}
                    >
                      <FourGround>
                        <CustomerInactiveSmsTemplate />
                      </FourGround>
                    </Tab>

                    <Tab eventKey="customerTicket" title={t("customerTicket")}>
                      <FourGround>
                        <CustomerTicketSmsTemplate />
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

      {/* tutorial play modal */}
      {modalStatus === "playTutorial" && (
        <PlayTutorial
          {...{
            show,
            setShow,
            video: "smsTemplate",
          }}
        />
      )}
    </>
  );
}
