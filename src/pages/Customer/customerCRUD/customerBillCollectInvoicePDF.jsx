import React from "react";
import moment from "moment";
const BillCollectInvoiceWithNote = React.forwardRef((props, ref) => {
  const { billingData, ispOwnerData, customerData, paymentDate } = props;
  return (
    <>
      <div ref={ref}>
        <div className="page_header letter_header d-flex justify-content-between align-items-center pb-3 ">
          <div className="logo_side">
            <div className="company_logo">
              <img src="/assets/img/logo.png" alt="Company Logo" />
            </div>
            <div className="company_name">{ispOwnerData.company}</div>
          </div>
          <div className="details_side">
            <p>কোম্পানির নামঃ {ispOwnerData.company}</p>
            {ispOwnerData.address && <p>এড্রেসঃ {ispOwnerData?.address}</p>}
          </div>
        </div>

        {/* <table className="table table-striped ">
          <thead>
            <tr>
              <th scope="col">নাম</th>
              <th scope="col">মোবাইল</th>
              <th scope="col">বিল টাইপ</th>
              <th scope="col">বিলের ধরণ</th>
              <th scope="col">এমাউন্ট</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{customerData?.name}</td>
              <td>{customerData?.mobile}</td>
              <td>{customerData?.billPayType}</td>
              <td>{billingData?.billType == "bill" ? "বিল" : "কানেকশন ফি"}</td>
              <td>{billingData?.amount && customerData?.monthlyFee}</td>
            </tr>
          </tbody>
        </table> */}
        {/* <div className="page-footer">
          <div className="signature_container">
            <div className="p-3 signature_wraper">
              <div className="signamture_field">ম্যানেজার</div>
              <div className="signamture_field">এডমিন</div>
            </div>
          </div>
        </div>
        </div>
        */}

        <div className="container mt-3 mb-5">
          <table>
            <tbody>
              <tr>
                <td>গ্রাহক ডাটা</td>
              </tr>
              <tr>
                <td className="font-weight-bold">
                  নামঃ {customerData.name} <br />
                  {customerData.mobile && `মোবাইলঃ ${customerData.mobile}`}
                  <br />
                  {customerData.address && `ঠিকানা ${customerData.address}`}
                </td>
              </tr>
            </tbody>
          </table>
          <table className="table table-bordered mt-2">
            <tbody>
              <tr>
                <th>বিল টাইপ</th>
                <th>বিলের ধরণ</th>
                <th>প্যাকেজ</th>
                <th>এমাউন্ট</th>
                <th>মাধ্যম</th>
                <th style={{ width: "30%" }}>পরিশোধের তারিখ</th>
              </tr>

              <tr>
                <td>{customerData?.billPayType}</td>
                <td>
                  {billingData?.billType == "bill" ? "বিল" : "কানেকশন ফি"}
                </td>

                <td>
                  {customerData.userType === "simple-queue" ||
                  customerData.userType === "firewall-queue"
                    ? customerData.queue.package
                    : customerData.pppoe.profile}
                </td>
                <td>{billingData?.amount}</td>
                <td>{billingData?.medium}</td>
                <td>{moment(paymentDate).format("MMM-DD-YYYY")}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <strong>নোটঃ</strong>{" "}
            {moment(billingData?.startDate).format("MMM/DD/YYYY")}-
            {moment(billingData?.endDate).format("MMM/DD/YYYY")} সময়কালীন বিল
            পরিশোধ করা হয়েছে।
          </div>

          <div className="page-footer">
            <div className="signature_container">
              <div className="p-3 signature_wraper">
                <div className="signamture_field">প্রোপাইটার</div>
                <div className="signamture_field">কাস্টমার</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
export default BillCollectInvoiceWithNote;
