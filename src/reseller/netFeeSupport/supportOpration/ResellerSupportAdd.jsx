import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { postResellerNetFeeSupport } from "../../../features/apiCallReseller";

const ResellerSupportAdd = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get isp owner id
  const ispOwner = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  //get user id
  const user = useSelector(
    (state) => state.persistedReducer.auth?.currentUser?.user?.id
  );

  // reseller id
  const reseller = useSelector(
    (state) => state.persistedReducer.auth.currentUser.reseller
  );

  // get support company name
  const company = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData.company
  );

  // support add state
  const [support, setSupport] = useState("");
  const [description, setDescription] = useState("");

  // is Loading state
  const [isLoading, setIsLoading] = useState(false);

  // support submit handler
  const resellerSupportSubmitHandler = (e) => {
    e.preventDefault();
    if (!support) {
      toast.error(t("pleaseSelectYourSupportType"));
    }
    if (!description) {
      toast.error(t("pleaseInputYourComment"));
    }
    const data = {
      support,
      description,
      ispOwner,
      user,
      reseller: reseller.id,
      mobile: reseller.mobile,
      company,
    };
    postResellerNetFeeSupport(dispatch, setIsLoading, data);
    setSupport("");
    setDescription("");
  };

  return (
    <>
      <div
        className="modal fade"
        id="resellerSupportAdd"
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
              <form onSubmit={resellerSupportSubmitHandler}>
                <div className="form-group px-2">
                  <label>{t("pleaseSelectYourSupportType")}</label>
                  <select
                    value={support}
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
                    value={description}
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

export default ResellerSupportAdd;
