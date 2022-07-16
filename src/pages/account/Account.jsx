import React from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";

// internal import
import "./account.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";
import { useTranslation } from "react-i18next";

export default function Account() {
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
                <h2 className="collectorTitle">{t("account")}</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="acccountWrapper">
                    <h2>{t("february")} - ২০২২</h2>
                    <table className="AccountCusotomTable1">
                      <tbody>
                        <tr className="Accounttableheader">
                          <th></th>
                          <th>{t("message")}</th>
                          <th>{t("SMS")}</th>
                          <th>{t("cost")}</th>
                        </tr>
                        <tr>
                          <td>{t("bill")}</td>
                          <td>32</td>
                          <td>23</td>
                          <td>0 tk.</td>
                        </tr>
                        <tr>
                          <td>{t("alert")}</td>
                          <td>00</td>
                          <td>00</td>
                          <td>0 tk.</td>
                        </tr>
                        <tr>
                          <td>{t("bulk/custom")}</td>
                          <td>00</td>
                          <td>00</td>
                          <td>0 tk.</td>
                        </tr>
                        <tr>
                          <td>{t("others")}</td>
                          <td>00</td>
                          <td>00</td>
                          <td>0 tk.</td>
                        </tr>
                      </tbody>
                    </table>
                    <hr />
                    <table className="AccountCusotomTable">
                      <tbody>
                        <tr>
                          <th>{t("messageBill")} :</th>
                          <td>2500 tk.</td>
                        </tr>
                        <tr>
                          <th>{t("serviceCharge")} :</th>
                          <td>200 tk.</td>
                        </tr>
                        <tr>
                          <th>{t("totalBill")}</th>
                          <td>2700 tk.</td>
                        </tr>
                      </tbody>
                    </table>
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
