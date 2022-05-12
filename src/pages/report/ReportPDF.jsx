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
    <>
      <div ref={ref}>
        <div className="page_header letter_header d-flex justify-content-between align-items-center pb-3 ">
          <div className="logo_side">
            <div className="company_logo">
              <img src="/assets/img/logo.png" alt="" />
            </div>
            <div className="company_name">{ispOwnerData.company}</div>
          </div>
          <div className="details_side">
            <p>কোম্পানির নামঃ {ispOwnerData.company}</p>
            {ispOwnerData.address && <p>এড্রেসঃ {ispOwnerData?.address}</p>}
          </div>
        </div>

        <ul className="d-flex justify-content-around">
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
                <td className="p-1">{val?.customer?.customerId}</td>
                <td className="p-1">{val?.customer?.name}</td>
                <td className="p-1">{FormatNumber(val?.amount)}</td>
                <td className="p-1">
                  {moment(val?.createdAt).format("DD-MM-YYYY")}
                </td>
              </tr>
            ))}
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

export default PrintReport;
