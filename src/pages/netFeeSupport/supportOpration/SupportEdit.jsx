import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { updateNetFeeSupportData } from "../../../features/apiCalls";

const SupportEdit = ({ editId }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  // update support data state
  const [supportEditData, setSupportEditData] = useState("");

  // netFee support data
  const supportAllData = useSelector(
    (state) => state.netFeeSupport?.netFeeSupport
  );

  //single support update data find
  const singleSupport = supportAllData.find((support) => support.id === editId);

  // isLoading state
  const [isLoading, setIsLoading] = useState(false);

  // netFee support handler
  const handleSupportEdit = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setSupportEditData({ ...supportEditData, [name]: value });
  };

  // update netFee support submit handle
  const netFeeSupportUpdate = (e) => {
    e.preventDefault();
    if (!description) {
      toast.error(t("pleaseInputYourComment"));
    }
    if (!description) {
      toast.error(t("pleaseInputYourComment"));
    }
    updateNetFeeSupportData(dispatch, setIsLoading, supportEditData);
  };

  useEffect(() => {
    if (singleSupport) {
      setSupportEditData(singleSupport);
    }
  }, [singleSupport]);

  const { support, description } = supportEditData;

  return (
    <>
      <div
        className="modal fade"
        id="supportEdit"
        tabindex="-1"
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
              <form onSubmit={netFeeSupportUpdate}>
                <div className="form-group px-2">
                  <label>{t("pleaseSelectYourSupporType")}</label>
                  <select
                    style={{ width: "100%" }}
                    class="form-select mw-100"
                    aria-label="Default select example"
                    name="support"
                    onChange={handleSupportEdit}
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
                    onChange={handleSupportEdit}
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

export default SupportEdit;
