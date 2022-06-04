import React from "react";

const BillCollectInvoice = React.forwardRef((props, ref) => {
  const { billingData, ispOwnerData, customerData } = props;
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

        <table className="table table-striped ">
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
        </table>
        <div className="page-footer">
          <div className="signature_container">
            <div className="p-3 signature_wraper">
              <div className="signamture_field">ম্যানেজার</div>
              <div className="signamture_field">এডমিন</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
export default BillCollectInvoice;
