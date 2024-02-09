import Sidebar from "../../components/admin/sidebar/Sidebar";

import { ToastContainer } from "react-toastify";

import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import "../message/message.css";

import BillConfirmationSmsTemplate from "./template/BillConfirmationSmsTemplate";
import AlertSmsTemplate from "./template/AlertSmsTemplate";
import CalenderAlert from "./template/CalenderAlert";
import CreateCustomerSmsTemplate from "./template/CreateCustomerSmsTemplate";
import CustomerInactiveSmsTemplate from "./template/CustomerInactiveSmsTemplate";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import SalarySMSTemplate from "./template/SalarySMSTemplate";
import ResellerRechargeSmsTemplate from "./template/ResellerRechargeSmsTemplate";
import SMSPurchase from "../message/SMSPurchase";
import { Button } from "react-bootstrap";
import { getIspOwnerWitSMS } from "../../features/apiCalls";
import MessageAlert from "../message/MessageAlert";
import { useSelector } from "react-redux";
import { EnvelopePlus } from "react-bootstrap-icons";
import CustomerTicketSmsTemplate from "./template/CustomerTicketSmsTemplate";
import CustomerManualEdit from "./template/CustomerManualEdit";
import StaffAssignTicketSMSTemplate from "./template/StaffAssignTicketSMSTemplate";
import CustomerTicketAssignSmsTemplate from "./template/CustomerAssignTicketSmsTemplate";
import ConnectionFeeSMSTemplate from "./template/ConnectionFeeSMSTemplate";
export default function Settings() {
  const { t } = useTranslation();

  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  const [settingSelect, setSettingSelect] = useState("confirmation");
  const [show, setShow] = useState(false);
  const selectSettingHandler = (e) => {
    setSettingSelect(e.target.value);
  };
  const [loading, setLoading] = useState(false);
  const [ispOwner, setIspOwner] = useState("");

  useEffect(() => {
    getIspOwnerWitSMS(ispOwnerId, setIspOwner, setLoading);
  }, [ispOwnerId]);

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
                    <div className="textButton" onClick={() => setShow(true)}>
                      <EnvelopePlus className="text_icons" /> {t("buySms")}
                    </div>
                  </div>
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
                      eventKey="connectionFee"
                      title={t("connectionFee")}
                    >
                      <FourGround>
                        <ConnectionFeeSMSTemplate />
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
                      eventKey="calenderAlert"
                      title={t("calenderAlert")}
                    >
                      <FourGround>
                        <CalenderAlert />
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
                      eventKey="expiredCustomer"
                      title={t("expiredCustomer")}
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
                    <Tab
                      className="mt-5"
                      eventKey="customerTicket"
                      title={t("customerTicket")}
                    >
                      <FourGround>
                        <CustomerTicketSmsTemplate />
                      </FourGround>
                    </Tab>

                    <Tab
                      className="mt-5"
                      eventKey="customerNotify"
                      title={t("customerNotify")}
                    >
                      <FourGround>
                        <CustomerTicketAssignSmsTemplate />
                      </FourGround>
                    </Tab>
                    <Tab
                      className="mt-5"
                      eventKey="assignTicket"
                      title={t("assignTicket")}
                    >
                      <FourGround>
                        <StaffAssignTicketSMSTemplate />
                      </FourGround>
                    </Tab>
                    <Tab
                      className="mt-5"
                      eventKey="manualInactive"
                      title={t("manualInactive")}
                    >
                      <FourGround>
                        <CustomerManualEdit />
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
      <SMSPurchase show={show} setShow={setShow} />
      <MessageAlert ispOwner={ispOwner} />
    </>
  );
}
