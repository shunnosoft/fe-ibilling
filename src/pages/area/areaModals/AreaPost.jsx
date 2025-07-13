import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";

import { addArea } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const AreaPost = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwnerId from redux store
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  // add area handler function
  const areaHandler = async (data) => {
    setIsLoading(true);
    if (ispOwnerId) {
      const sendingData = {
        name: data.name,
        ispOwner: ispOwnerId,
        remarks,
      };
      addArea(dispatch, sendingData, setIsLoading, setShow);
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("addNewArea")}
      >
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={linemanValidator}
          onSubmit={(values) => {
            areaHandler(values);
          }}
        >
          {() => (
            <Form>
              <div className="displayGrid">
                <FtextField
                  type="text"
                  label={t("areaName")}
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

              <div className="displayGrid1 float-end mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShow(false)}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn btn-success customBtn"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader /> : t("save")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default AreaPost;
