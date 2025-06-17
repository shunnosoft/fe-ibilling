import React, { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

// internal import
import Loader from "../../../components/common/Loader";
import { editBillReport } from "../../../features/apiCalls";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const EditReport = ({ show, setShow, reportId, note, setNote }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get all report from redux
  const report = useSelector((state) => state?.payment?.allBills);

  // single report find
  const data = report.find((item) => item._id === reportId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNote(data?.note);
  }, [data]);

  // report edit handler
  const reportEditHandler = () => {
    const sendingData = {
      note,
    };
    editBillReport(dispatch, setIsLoading, data?._id, sendingData, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("editReport")}
      >
        <div class="form-group">
          <label for="exampleFormControlTextarea1">{t("editNote")}</label>
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        <div className="displayGrid1 float-end mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
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
      </ComponentCustomModal>
    </>
  );
};

export default EditReport;
