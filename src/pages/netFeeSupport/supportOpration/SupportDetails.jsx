import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const SupportDetails = ({ supportId }) => {
  const { t } = useTranslation();

  // oneBilling support data
  const supportAllData = useSelector(
    (state) => state.netFeeSupport?.netFeeSupport
  );

  const support = supportAllData.find((item) => item.id === supportId);

  return (
    <div
      className="modal fade"
      id="netFeeSupportDetails"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("netFeeSupportDetails")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <h4 style={{ color: "#0abb7a" }} className="modal-title">
              {support?.company}
            </h4>
            <>
              <div className="comment-show">
                <div className="d-flex">
                  <small className="mb-3">
                    {moment(support?.createdAt).format("MMM DD YYYY")}
                  </small>
                </div>
                <div className="comment-info" style={{ marginTop: "-10px" }}>
                  <i class="badge bg-primary me-1">{support?.support}</i>
                  <i class="badge bg-info">{support?.status}</i>
                </div>
                <p className="mt-2" style={{ textAlign: "justify" }}>
                  {support?.description}
                </p>
              </div>
              <br />
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDetails;
