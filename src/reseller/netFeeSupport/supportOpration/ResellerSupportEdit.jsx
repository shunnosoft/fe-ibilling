import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";
import { putResellerNetFeeSupport } from "../../../features/apiCallReseller";

const ResellerSupportEdit = ({ editID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get reseller support
  const resellerAllSupport = useSelector(
    (state) => state.resellerSupport?.resellerSupport
  );

  // support edit data store state
  const [editSupportData, setEditSupportData] = useState("");

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  // support edit data find
  const supportEdit = resellerAllSupport.find((item) => item.id === editID);

  // support edit onchange handler
  const resellerSupportEditHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setEditSupportData({ ...editSupportData, [name]: value });
  };

  // support update data submit handler
  const resellerSupportUpdateHandler = (e) => {
    e.preventDefault();
    if (!description) {
      toast.error(t("pleaseInputYourComment"));
    }
    if (!support) {
      toast.error(t("pleaseSelectYourSupportType"));
    }
    putResellerNetFeeSupport(dispatch, setIsLoading, editSupportData);
  };

  useEffect(() => {
    if (supportEdit) {
      setEditSupportData(supportEdit);
    }
  }, [supportEdit]);

  const { support, description } = editSupportData;

  return (
    <>
      <div
        className="modal fade"
        id="resellerSupportEditId"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("netFeeSupportUpdate")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={resellerSupportUpdateHandler}>
                <div className="form-group px-2">
                  <label>{t("pleaseSelectYourSupportType")}</label>
                  <select
                    style={{ width: "100%" }}
                    class="form-select mw-100"
                    aria-label="Default select example"
                    name="support"
                    onChange={resellerSupportEditHandler}
                  >
                    <option selected={support === "complain"} value="complain">
                      {t("complain")}
                    </option>
                    <option selected={support === "feature"} value="feature">
                      {t("featureRequest")}
                    </option>
                    <option selected={support === "support"} value="support">
                      {t("support")}
                    </option>
                  </select>
                </div>
                <div className="form-group px-2 mt-3">
                  <label>{t("pleaseInputYourComment")}</label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
                    name="description"
                    value={description}
                    onChange={resellerSupportEditHandler}
                  ></textarea>
                </div>
                <div className="modal-footer bg-whitesmoke br">
                  <button
                    disabled={isLoading}
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="btn btn-success"
                  >
                    {isLoading ? <Loader /> : t("submit")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResellerSupportEdit;
