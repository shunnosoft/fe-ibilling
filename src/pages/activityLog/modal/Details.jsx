import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ArrowRight } from "react-bootstrap-icons";
import { useSelector, useDispatch } from "react-redux";

export default function Details({ activityId }) {
  const activityLogData = useSelector(
    (state) => state.persistedReducer.activityLog.activityLog
  );

  const singleData = activityLogData.find((item) => item.id === activityId);

  const [value, setValue] = useState([]);

  useEffect(() => {
    if (singleData?.data) {
      setValue(JSON.parse(singleData.data));
    }
  }, [singleData]);
  console.log(value);
  const checkOp = value[0]?.op;

  return (
    <div
      className="modal fade"
      id="showActivityLogDetails"
      tabIndex="-1"
      aria-labelledby="customerModalDetails"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ color: "#0abb7a" }}
              className="modal-title"
              id="customerModalDetails"
            >
              ডিটেলস
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {checkOp === "update" && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">পাথ</th>
                    <th scope="col">পূর্বের ভ্যালু </th>
                    <th scope="col">বর্তমান ভ্যালু</th>
                  </tr>
                </thead>
                <tbody>
                  {value.map((item, index) => {
                    const lastIndex = item.path.length - 1;
                    if (
                      item.path[lastIndex] != "id" &&
                      item.path[lastIndex] != "_id" &&
                      item.path[lastIndex] != "createdAt" &&
                      item.path[lastIndex] != "updatedAt" &&
                      item.path[lastIndex] != "bill"
                    ) {
                      // let oldVal
                      return (
                        <tr key={index}>
                          <td>
                            {item.path.map((value, index) => (
                              <>
                                <span key={index}>{value} </span>{" "}
                                <span key={index} className="text-primary">
                                  {item.path.length - 1 != index && (
                                    <ArrowRight />
                                  )}
                                </span>
                              </>
                            ))}
                          </td>
                          <td>
                            {typeof item?.oldVal === "boolean"
                              ? item.oldVal
                                ? "true"
                                : "false"
                              : item.oldVal}
                          </td>
                          <td>
                            {typeof item?.val === "boolean"
                              ? item.val
                                ? "true"
                                : "false"
                              : item.val}
                          </td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            )}
            {checkOp == "add" &&
              value.map((item) => {
                let renderValue = [];
                for (const key in item.val) {
                  const activityLogData = item.val[key];

                  if (typeof activityLogData !== "object") {
                    if (activityLogData) {
                      if (
                        key === "address" ||
                        key === "name" ||
                        key === "email" ||
                        key === "monthlyFee" ||
                        key === "mobile" ||
                        key === "customerId" ||
                        key === "createdAt" ||
                        key === "billingCycle" ||
                        key === "balance" ||
                        key === "autoDisable" ||
                        typeof key === "object"
                      ) {
                        renderValue.push(
                          <h6>
                            {key} :{" "}
                            <span>
                              {typeof activityLogData === "boolean"
                                ? activityLogData
                                  ? "true"
                                  : "false"
                                : activityLogData}
                            </span>
                          </h6>
                        );
                      }
                    }
                  } else {
                    for (const key2 in activityLogData) {
                      if (activityLogData[key2]) {
                        // console.log(activityLogData);
                        if (
                          key2 === "name" ||
                          key2 === "type" ||
                          key2 === "target" ||
                          key2 === "address" ||
                          key2 === "billingCycle" ||
                          key2 === "createdAt" ||
                          key2 === "customerId" ||
                          key2 === "email" ||
                          key2 === "mobile"
                        ) {
                          renderValue.push(
                            <h6>
                              {key}: {key2} :{" "}
                              <span>{activityLogData[key2]}</span>
                            </h6>
                          );
                        }
                      }
                    }
                  }
                }
                return renderValue;
                // else{

                // }
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
