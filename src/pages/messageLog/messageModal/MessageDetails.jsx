import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const MessageDetails = ({ messageData }) => {
  const { t } = useTranslation();

  // current data state
  const [currentData, setCurrentData] = useState("");

  useEffect(() => {
    if (messageData) {
      setCurrentData(messageData);
    }
  }, [messageData]);

  return (
    <>
      <div>
        <div
          className="modal fade modal-dialog-scrollable "
          id="maskingMessageDetails"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4
                  style={{ color: "#0abb7a" }}
                  className="modal-title"
                  id="supportDetails"
                >
                  Mobile : {currentData.mobile}
                </h4>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <>
                  <div className="comment-show">
                    <div className="d-flex">
                      <small className="mb-3 fw-bold">
                        {moment(currentData.createdAt).format("MMM DD YYYY")}
                      </small>
                    </div>
                    <div
                      className="comment-info"
                      style={{ marginTop: "-10px" }}
                    >
                      <i class="badge bg-primary me-1">{currentData.type}</i>
                      <i class="badge bg-success">{currentData.status}</i>
                    </div>
                    <p className="mt-2" style={{ textAlign: "justify" }}>
                      {currentData.message}
                    </p>
                  </div>
                  <br />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageDetails;
