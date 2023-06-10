import { t } from "i18next";
import React from "react";
import { useState } from "react";
import { addTicketCategoryApi } from "../../../features/supportTicketApi";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Loader from "../../../components/common/Loader";

const CategoryPost = ({ ispOwner }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addCategory = () => {
    const sendData = {
      name: category,
      ispOwner,
    };

    if (category && ispOwner) {
      addTicketCategoryApi(dispatch, sendData, setIsLoading);
    }
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="addCategoryModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {t("addCategory")}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="input-group mb-3">
              <div className="w-100">
                <label htmlFor="name">{t("name")}</label>
                <input
                  className="form-control mw-100"
                  type="text"
                  name="name"
                  id="name"
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <button
                className="btn btn-success ms-auto shadow-none mt-3"
                type="button"
                onClick={addCategory}
              >
                {isLoading ? <Loader /> : t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPost;
