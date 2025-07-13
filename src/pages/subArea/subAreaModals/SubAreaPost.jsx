import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";

import { addSubArea } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

export default function SubAreaPost({ postShow, setPostShow, name, id }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  //modal show handler
  const handleClose = () => {
    setPostShow(false);
  };

  const subAreaHandler = async (data) => {
    if (auth.ispOwner) {
      const sendingData = {
        name: data.name,
        remarks,
        area: id,
        ispOwner: auth.ispOwner.id,
      };
      addSubArea(dispatch, sendingData, setIsLoading, setPostShow);
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={postShow}
        setShow={setPostShow}
        header={`${name || ""} - ${t("addSubArea")}`}
        footer={
          <div className="displayGrid1">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              form="subAreaPost"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : t("save")}
            </button>
          </div>
        }
      >
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={linemanValidator}
          onSubmit={(values) => {
            subAreaHandler(values);
          }}
        >
          {() => (
            <Form id="subAreaPost">
              <div className="displayGrid">
                <FtextField
                  type="text"
                  label={t("nameSubArea")}
                  name="name"
                  validation={true}
                />

                <div>
                  <label className="changeLabelFontColor">{t("remarks")}</label>
                  <textarea
                    cols={200}
                    className="form-control shadow-none"
                    id="noteField"
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
}
