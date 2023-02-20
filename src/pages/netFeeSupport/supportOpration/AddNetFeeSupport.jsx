import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { addNetFeeSupport } from "../../../features/apiCalls";

const AddNetFeeSupport = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  //get user id
  const user = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.user?.id
  );

  //get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // add netFee support state
  const [support, setSupport] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //add netFee support submit handler
  const netFeeSupportSubmit = (e) => {
    e.preventDefault();
    if (!support) {
      toast.error(t("pleaseSelectYourSupportType"));
    }
    if (!description) {
      toast.error(t("pleaseInputYourComment"));
    }
    const data = { ispOwner, user, support, description };
    addNetFeeSupport(dispatch, data, setIsLoading);
  };

  return (
    <>
      <div
        className="modal fade"
        id="addNetFeeSupport"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("netFeeSupportAdd")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={netFeeSupportSubmit}>
                <div className="form-group px-2">
                  <label>{t("pleaseSelectYourSupporType")}</label>
                  <select
                    onChange={(e) => setSupport(e.target.value)}
                    className="form-select mw-100"
                    aria-label="Default select example"
                  >
                    <option value="">{t("select")}</option>
                    <option value="complain">{t("complain")}</option>
                    <option value="feature">{t("featureRequest")}</option>
                    <option value="support">{t("support")}</option>
                  </select>
                </div>
                <div className="form-group px-2 mt-3">
                  <label>{t("pleaseInputYourComment")}</label>
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows="3"
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

export default AddNetFeeSupport;
