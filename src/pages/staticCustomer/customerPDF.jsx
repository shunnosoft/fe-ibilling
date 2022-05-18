import React from "react";
import { ArrowDownUp } from "react-bootstrap-icons";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { badge } from "../../components/common/Utils";
import { useSelector } from "react-redux";

const PrintCustomer = React.forwardRef((props, ref) => {
  const { currentCustomers, filterData } = props;
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );
  console.log(ispOwnerData);
  return (
    <div className="mt-3 p-4" ref={ref}>
      <h2 className="text-center">{ispOwnerData.company}</h2>
      <h5 className="text-center">মোবাইল {ispOwnerData.mobile}</h5>
      <h6 className="text-center text-mute">গ্রাহক রিপোর্ট ডিটেইলস</h6>
      <ul className="d-flex justify-content-evenly">
        <li>এরিয়াঃ {filterData.area}</li>
        <li>সাবএরিয়াঃ {filterData.subArea}</li>
        <li>স্টাটাসঃ {filterData.status}</li>
        <li>পেমেন্টঃ {filterData.payment}</li>
      </ul>
      <table className="table table-striped ">
        <thead>
          <tr className="spetialSortingRow">
            <th scope="col">আইডি</th>
            <th scope="col">নাম</th>
            <th scope="col">মোবাইল</th>
            <th scope="col">স্ট্যাটাস</th>
            <th scope="col">পেমেন্ট</th>
            <th scope="col">প্যাকেজ</th>
            <th scope="col">মাসিক ফি</th>
            <th scope="col">ব্যালান্স</th>
            <th scope="col">বিল সাইকেল</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((val, key) => (
            <tr key={key} id={val.id}>
              <td className="prin_td">{val.customerId}</td>
              <td className="prin_td">{val.name}</td>
              <td className="prin_td">{val.mobile}</td>
              <td className="prin_td">{badge(val.status)}</td>
              <td className="prin_td">{badge(val.paymentStatus)}</td>
              <td className="prin_td">{val.pppoe.profile}</td>
              <td className="prin_td">{FormatNumber(val.monthlyFee)}</td>
              <td className="prin_td">
                <strong>{FormatNumber(val.balance)}</strong>
              </td>
              <td className="prin_td">
                {moment(val.billingCycle).format("DD-MM-YYYY")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div className="pdf_footer_line"></div>
      <div className="signature_text text-mute">সাক্ষর এবং তারিখ</div>
      <div className="signature_container">
        <div className="p-3 signature_wraper">
          <div className="signamture_field">ম্যানেজার</div>
          <div className="signamture_field">এডমিন</div>
        </div>
      </div> */}
    </div>
  );
});

export default PrintCustomer;
