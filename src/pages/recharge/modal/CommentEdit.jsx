import React, { useEffect } from "react";
import { useState } from "react";
import Loader from "../../../components/common/Loader";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { rechargeHistoryEdit } from "../../../features/apiCalls";
import { useDispatch } from "react-redux";

const CommentEdit = ({ rechargeId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get recharge history form redux
  const rechargeHistory = useSelector(
    (state) => state.recharge.rechargeHistory
  );

  // find single data
  const data = rechargeHistory.find((item) => item.id === rechargeId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // comment state
  const [comment, setComment] = useState("");

  // set comment on state
  useEffect(() => {
    setComment(data?.comment);
  }, [data]);

  // comment handler
  const editHandler = () => {
    const data = {
      comment,
    };
    rechargeHistoryEdit(dispatch, rechargeId, data, setIsLoading);
  };

  return (
    <>
      <div
        className="modal fade"
        id="rechargeCommentEdit"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("editComment")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div class="form-floating mt-3">
                <textarea
                  cols={200}
                  class="form-control shadow-none"
                  value={comment}
                  placeholder={t("writeNote")}
                  id="noteField"
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <label for="noteField"> {t("editComment")} </label>
              </div>
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
                onClick={editHandler}
              >
                {isLoading ? <Loader /> : t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentEdit;
