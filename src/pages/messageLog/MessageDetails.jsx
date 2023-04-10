import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const MessageDetails = ({ fixedId, status }) => {
  const { t } = useTranslation();

  let message = useSelector((state) =>
    status === "fixedNumber" ? state?.messageLog?.fixedNumber : ""
  );

  const findMessage = message.find((item) => item.id === fixedId);

  return (
    <div
      className="modal fade"
      id="messageLogDetails"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("messageDetails")}
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
              {findMessage?.mobile}
            </h4>
            <>
              <div className="comment-show">
                <div className="d-flex">
                  <small className="mb-3">
                    {moment(findMessage?.createdAt).format("MMM DD YYYY")}
                  </small>
                </div>
                <div className="comment-info" style={{ marginTop: "-10px" }}>
                  <i class="badge bg-primary me-1">{findMessage?.type}</i>
                  <i class="badge bg-info">{findMessage?.status}</i>
                </div>
                <p className="mt-2" style={{ textAlign: "justify" }}>
                  {findMessage?.message}
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

export default MessageDetails;
