import React, { useState } from "react";
import { useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Select from "react-select";
import Loader from "../../../components/common/Loader";
import { editBillReport } from "../../../features/apiCalls";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const EditReport = ({ reportId, note, setNote }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const options = [
    { value: "January", label: t("january") },
    { value: "February", label: t("february") },
    { value: "March", label: t("march") },
    { value: "April", label: t("april") },
    { value: "May", label: t("may") },
    { value: "June", label: t("june") },
    { value: "July", label: t("july") },
    { value: "August", label: t("august") },
    { value: "September", label: t("september") },
    { value: "October", label: t("october") },
    { value: "November", label: t("november") },
    { value: "December", label: t("december") },
  ];

  // get all report from redux
  const report = useSelector((state) => state?.payment?.allBills);

  const data = report.find((item) => item.id === reportId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // start date state
  const [startDate, setStartDate] = useState(false);

  // end date state
  const [endDate, setEndDate] = useState(false);

  // month state
  const [selectedMonth, setSelectedMonth] = useState([]);

  // console.log(getMonth);
  // if (data) {
  //   const getMonth = data?.month.split(",");
  //   const value = options.filter((item) => getMonth.includes(item.value));
  //   console.log(value);
  // }
  useEffect(() => {
    setNote(data?.note);
    // setStartDate(data?.start ? new Date(data?.start) : null);
    // setEndDate(data?.end ? new Date(data?.end) : null);
    // if (data) {
    //   const getMonth = data?.month.split(",");
    //   setSelectedMonth(options.filter((item) => getMonth.includes(item.value)));
    // }
  }, [data]);

  //form resetFunction
  // const resetForm = () => {
  //   setStartDate(false);
  //   setEndDate(false);
  //   setNote("");
  //   // setNoteCheck(false);
  //   setSelectedMonth(null);
  // };

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

              {/* <div className="me-3" style={{ width: "100%" }}>
                <label className="form-control-label changeLabelFontColor">
                  {t("startDate")}
                </label>
                <ReactDatePicker
                  className="form-control mw-100"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t("selectDate")}
                />
              </div>
              <div cla style={{ width: "100%" }}>
                <label className="form-control-label changeLabelFontColor">
                  {t("endDate")}
                </label>

                <ReactDatePicker
                  className="form-control mw-100"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t("selectDate")}
                />
              </div>

              <label
                className="form-check-label changeLabelFontColor"
                htmlFor="selectMonth"
              >
                {t("selectMonth")}
              </label>
              <Select
                className="w-100 mt-1"
                value={selectedMonth}
                defaultValue={selectedMonth.map((item) => item)}
                onChange={setSelectedMonth}
                options={options}
                isMulti={true}
                // placeholder={t("selectMonth")}
                isSearchable
                components={animatedComponents}
                id="selectMonth"
              /> */}
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
