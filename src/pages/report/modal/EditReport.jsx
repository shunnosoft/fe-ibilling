import React, { useState } from "react";
import { useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { editBillReport } from "../../../features/apiCalls";

const EditReport = ({ reportId, note, setNote }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  console.log(reportId);

  // get all report from redux
  const report = useSelector(
    (state) => state?.persistedReducer?.payment?.allBills
  );

  const data = report.find((item) => item.id === reportId);
  console.log(data);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNote(data?.note);
  }, [data?.note]);

  // report edit handler
  const reportEditHandler = () => {
    const sendingData = {
      note,
    };
    editBillReport(dispatch, setIsLoading, data?.id, sendingData);
  };

  return (
    <div
      className="modal fade"
      id="reportEditModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("editReport")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <>
              <div class="form-group">
                <label for="exampleFormControlTextarea1">
                  Example textarea
                </label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>
            </>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              {t("cancel")}
            </button>

            <button
              type="button"
              className="btn btn-success"
              onClick={reportEditHandler}
            >
              {isLoading ? <Loader></Loader> : t("submit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReport;
