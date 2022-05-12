import React from "react";
import { ArrowDownUp } from "react-bootstrap-icons";
import moment from "moment";
import FormatNumber from "../../components/common/NumberFormat";
import { useSelector } from "react-redux";

const PrintReport = React.forwardRef((props, ref) => {
  const { currentCustomers, filterData } = props;
  const ispOwnerData = useSelector(
    (state) => state.persistedReducer.auth.userData
  );
  const startDate = moment(filterData.startDate).format("DD/MM/YYYY");
  const endDate = moment(filterData.endDate).format("DD/MM/YYYY");
  return (
    <div className="mt-3 p-4" ref={ref}>
      <h2 className="text-center">{ispOwnerData.company}</h2>
      <h5 className="text-center">মোবাইল {ispOwnerData.mobile}</h5>
      <h6 className="text-center ">রিপোর্ট ডিটেইলস</h6>
      <ul className="d-flex justify-content-evenly">
        <li>এরিয়াঃ {filterData.area}</li>
        <li>সাবএরিয়াঃ {filterData.subArea}</li>
        <li>কালেক্টরঃ {filterData.collector}</li>
        <li>
          তারিখঃ {startDate} - {endDate}
        </li>
      </ul>
      <table className="table table-striped">
        <thead>
          <tr className="spetialSortingRow">
            <th style={{ fontFamily: "sans-serif" }} scope="col">
              আইডি
              <ArrowDownUp className="arrowDownUp" />
            </th>
            <th style={{ fontFamily: "sans-serif" }} scope="col">
              গ্রাহক
              <ArrowDownUp className="arrowDownUp" />
            </th>
            <th style={{ fontFamily: "sans-serif" }} scope="col">
              বিল
              <ArrowDownUp className="arrowDownUp" />
            </th>

            <th style={{ fontFamily: "sans-serif" }} scope="col">
              তারিখ
              <ArrowDownUp className="arrowDownUp" />
            </th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((val, key) => (
            <tr key={key} id={val?.id}>
              <td>{val?.customer?.customerId}</td>
              <td>{val?.customer?.name}</td>
              <td>{FormatNumber(val?.amount)}</td>
              <td>{moment(val?.createdAt).format("DD-MM-YYYY")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pdf_footer_line"></div>
      <div className="signature_text text-mute">সাক্ষর এবং তারিখ</div>
      <div className="signature_container">
        <div className="p-3 signature_wraper">
          <div className="signamture_field">ম্যানেজার</div>
          <div className="signamture_field">এডমিন</div>
        </div>
      </div>
    </div>
  );
});

export default PrintReport;
