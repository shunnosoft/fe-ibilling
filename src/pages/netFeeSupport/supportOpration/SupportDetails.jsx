import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const SupportDetails = ({ detailsId }) => {
  const { t } = useTranslation();

  // netFee all support data
  const supportAllData = useSelector(
    (state) => state.netFeeSupport?.netFeeSupport
  );

  // support details data state
  const [detailsSupport, setDetailsSupport] = useState("");

  // find support details data
  const detailsData = supportAllData.find((item) => item.id === detailsId);

  useEffect(() => {
    if (detailsData) {
      setDetailsSupport(detailsData);
    }
  }, [detailsData]);

  const { company, createdAt, description, status, support } = detailsSupport;

  return (
    <>
      <div
        className="modal fade"
        id="supportDetails"
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
              <h4
                style={{ color: "#0abb7a" }}
                className="modal-title"
                id="supportDetails"
              >
                {company}
              </h4>
              <>
                <div className="comment-show">
                  <div className="d-flex">
                    <small className="mb-3">
                      {moment(createdAt).format("MMM DD YYYY")}
                    </small>
                  </div>
                  <div className="comment-info" style={{ marginTop: "-10px" }}>
                    <i class="badge bg-primary me-1">{support}</i>
                    <i class="badge bg-info">{status}</i>
                  </div>
                  <p className="mt-2" style={{ textAlign: "justify" }}>
                    {description}
                  </p>
                </div>
                <br />
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupportDetails;
