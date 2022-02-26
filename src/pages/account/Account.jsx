import React from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";

// internal import
import "./account.css";
import { FontColor, FourGround } from "../../assets/js/theme";
import Footer from "../../components/admin/footer/Footer";
import useDash from "../../assets/css/dash.module.css";

export default function Account() {
  return (
    <>
      <Sidebar />
      <ToastContainer position="top-right" theme="colored" />
      <div className={useDash.dashboardWrapper}>
        <div className="container-fluied collector">
          <div className="container">
            <FontColor>
              <FourGround>
                <h2 className="collectorTitle">একাউন্ট</h2>
              </FourGround>

              <FourGround>
                <div className="collectorWrapper">
                  <div className="acccountWrapper">
                    <h2>ফেব্রুয়ারী - ২০২২</h2>
                    <table className="AccountCusotomTable1">
                      <tbody>
                        <tr className="Accounttableheader">
                          <th></th>
                          <th>ম্যাসেজ</th>
                          <th>এসএমএস</th>
                          <th>খরচ</th>
                        </tr>
                        <tr>
                          <td>বিল</td>
                          <td>32</td>
                          <td>23</td>
                          <td>0 tk.</td>
                        </tr>
                        <tr>
                          <td>এলার্ট</td>
                          <td>00</td>
                          <td>00</td>
                          <td>0 tk.</td>
                        </tr>
                        <tr>
                          <td>বাল্ক/কাস্টম</td>
                          <td>00</td>
                          <td>00</td>
                          <td>0 tk.</td>
                        </tr>
                        <tr>
                          <td>অন্যান্য</td>
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
                          <th>ম্যাসেজ বিলঃ</th>
                          <td>2500 tk.</td>
                        </tr>
                        <tr>
                          <th>সার্ভিস চার্জঃ</th>
                          <td>200 tk.</td>
                        </tr>
                        <tr>
                          <th>মোট বিলঃ</th>
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
