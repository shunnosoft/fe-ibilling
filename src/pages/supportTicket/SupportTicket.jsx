import Sidebar from "../../components/admin/sidebar/Sidebar";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { Tab, Tabs } from "react-bootstrap";
import Ticket from "./Ticket";
import Category from "./Category";

const SupportTicket = () => {
  const { t } = useTranslation();
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
                    <div>{t("supportTicket")}</div>
                  </div>
                </div>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="table-section">
                    <Tabs
                      defaultActiveKey={"supportTicket"}
                      id="uncontrolled-tab-example"
                      className="mb-3"
                    >
                      <Tab eventKey="supportTicket" title={t("supportTicket")}>
                        <Ticket />
                      </Tab>
                      <Tab
                        eventKey="ticketCategory"
                        title={t("ticketCategory")}
                      >
                        <Category />
                      </Tab>
                    </Tabs>
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
};

export default SupportTicket;
