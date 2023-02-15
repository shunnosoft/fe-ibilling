import React from "react";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import useDash from "../../assets/css/dash.module.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { PersonPlusFill } from "react-bootstrap-icons";

const NetFeeSupport = () => {
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
                  <div>{t("netFeeSupport")}</div>
                  <div className="addAndSettingIcon">
                    <PersonPlusFill
                      className="addcutmButton"
                      data-bs-toggle="modal"
                      data-bs-target="#"
                      title={t("addSupportTicket")}
                    />
                  </div>
                </div>
              </FourGround>
              <FourGround>
                <div className="collectorWrapper mt-2 py-2">
                  <div className="table-section">
                    {/* <Table
                      isLoading={isLoading}
                      // customComponent={customComponent}
                      columns={columns}
                      data={supportTickets}
                    ></Table> */}
                  </div>
                </div>
              </FourGround>
              <Footer />
            </FontColor>
          </div>
        </div>
      </div>

      {/* Add Modal Start */}

      {/* Add Modal End */}

      {/* Edit Modal Start */}

      {/* Edit Modal End */}

      {/* Delete Modal Start */}

      {/* Delete Modal end */}
    </>
  );
};

export default NetFeeSupport;
