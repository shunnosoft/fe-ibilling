import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

export default function Details({ activityId }) {
  console.log(activityId);

  const activityLogData = useSelector(
    (state) => state.persistedReducer.activityLog.activityLog
  );
  console.log(activityLogData);

  const singleData = activityLogData.find((item) => item.id === activityId);
  console.log(singleData?.data);

  const [value, setValue] = useState([]);

  useEffect(() => {
    if (singleData?.data) {
      setValue(JSON.parse(singleData.data));
    }
  }, [singleData]);
  console.log(value);

  return (
    <div>
      <div
        className="modal fade"
        id="showActivityLogDetails"
        tabIndex="-1"
        aria-labelledby="customerModalDetails"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="customerModalDetails"
              >
                {/* {data?.name} - প্রোফাইল */}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">পূর্বের ভ্যালু </th>
                    <th scope="col">বর্তমান ভ্যালু</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {value.map((item, index) => {
                    console.log(item);
                    return (
                      <tr key={index}>
                        <td>{item?.oldVal}</td>
                        <td>{item?.val}</td>
                      </tr>
                    );
                  })} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
