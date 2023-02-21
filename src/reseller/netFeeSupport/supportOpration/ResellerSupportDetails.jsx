import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const ResellerSupportDetails = ({ detailsID }) => {
  const { t } = useTranslation();

  // get reseller all support
  const resellerSupport = useSelector(
    (state) => state.resellerSupport?.resellerSupport
  );

  // support details data state
  const [detailsData, setDetailsData] = useState("");

  // find details reseller support
  const detailsSupport = resellerSupport.find((item) => item.id === detailsID);

  useEffect(() => {
    if (detailsSupport) {
      setDetailsData(detailsSupport);
    }
  }, [detailsSupport]);

  const { company, createdAt, description, status, support } = detailsData;

  return (
    <>
      <div
        className="modal fade"
        id="resellerSupportDetails"
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

export default ResellerSupportDetails;
