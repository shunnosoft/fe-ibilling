import moment from "moment";
import React, { useEffect, useState } from "react";
import apiLink from "../../../api/apiLink";
import "../customer.css";
import FormatNumber from "../../../components/common/NumberFormat";
import { useTranslation } from "react-i18next";
export default function CustomerReport({ single }) {
  const { t } = useTranslation();
  const [customerReport, setCustomerReport] = useState([]);

  useEffect(() => {
    const getCustoemrReport = async () => {
      try {
        const res = await apiLink(`/reseller/bills/customer/${single?.id}`);
        const data = await res.data;
        setCustomerReport(data);
      } catch (err) {
        console.log("Error to get report: ", err);
      }
    };
    single?.id && getCustoemrReport();
  }, [single]);

  return (
    <div>
      <div
        className="modal fade"
        id="showCustomerReport"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                {single?.name} - {t("report")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive-lg">
                <table className="table table-striped ">
                  <thead>
                    <tr className="spetialSortingRow">
                      <th scope="col"> {t("bill")} </th>
                      <th scope="col"> {t("date")} </th>
                      <th scope="col"> {t("medium")} </th>
                      <th scope="col"> {t("collector")} </th>
                      <th scope="col"> {t("note")} </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerReport?.map((val, index) => (
                      <tr className="spetialSortingRow" key={index}>
                        <td>{FormatNumber(val.amount)}</td>
                        <td>
                          {moment(val.createdAt).format(
                            "DD-MM-YYYY hh:mm:ss A"
                          )}
                        </td>
                        <td>{val.medium}</td>
                        <td>{val.name}</td>
                        <td>
                          <p>{val.note}</p>
                          {val.start && val.end && (
                            <span className="badge bg-secondary">
                              {moment(val.start).format("DD/MM/YY")}--
                              {moment(val.end).format("DD/MM/YY")}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
