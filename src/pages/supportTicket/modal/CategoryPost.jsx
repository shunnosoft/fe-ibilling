import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// internal import
import { addTicketCategoryApi } from "../../../features/supportTicketApi";
import Loader from "../../../components/common/Loader";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const CategoryPost = ({ show, setShow, ispOwner }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // modal state
  const [category, setCategory] = useState("");

  // api call
  const addCategory = () => {
    const sendData = {
      name: category,
      ispOwner,
    };

    if (category && ispOwner) {
      addTicketCategoryApi(dispatch, sendData, setIsLoading, setShow);
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("addCategory")}
      >
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
      </ComponentCustomModal>
    </>
  );
};

export default CategoryPost;
