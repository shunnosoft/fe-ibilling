import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { addPoleBox, addPoleBox2 } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import Loader from "../../../components/common/Loader";
import { FtextField } from "../../../components/common/FtextField";

const TestModal = ({ areaId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get current user(ispOwner)
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);

  //get all sub Area
  const storeSubArea = useSelector((state) => state.area?.subArea);

  const [isLoading, setIsLoading] = useState(false);
  const [subArea, setSubArea] = useState([]);
  const [subAreaId, setSubAreaId] = useState("");

  useEffect(() => {
    let sub = [];
    storeSubArea?.map((val) => {
      if (val.area === areaId) {
        sub.push(val);
      }
    });
    setSubArea(sub);
  }, [storeSubArea, areaId]);

  //validator
  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  //pole box post handler
  const poleBoxPost = async (data) => {
    if (!subAreaId) {
      alert("Select Subarea");
      return;
    }
    if (auth.ispOwner) {
      const sendingData = {
        name: data.name,
        description: data.description,
        subArea: subAreaId,
        ispOwner: auth.ispOwner.id,
      };
      addPoleBox2(dispatch, sendingData, setIsLoading);
    }
  };

  return (
    <div>
      <div
        className="modal fade modal-dialog-scrollable "
        id="poleBoxAdd2"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {t("addPoleBox")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{
                  name: "",
                  description: "",
                }}
                validationSchema={linemanValidator}
                onSubmit={(values) => {
                  poleBoxPost(values);
                }}
              >
                {() => (
                  <Form>
                    <div>
                      <div>
                        <div className="w-100 me-2 mb-3">
                          <label className="form-control-label changeLabelFontColor">
                            {t("subArea")}
                          </label>

                          <select
                            className="form-select mt-0 mw-100"
                            onChange={(e) => setSubAreaId(e.target.value)}
                          >
                            <option value=""> {t("subArea")} </option>

                            {subArea?.map((val) => (
                              <option value={`${val.id}`}>{val.name}</option>
                            ))}
                          </select>
                        </div>
                        <FtextField type="text" label={t("name")} name="name" />

                        <label
                          className="changeLabelFontColor"
                          htmlFor="description"
                        >
                          {t("description")}
                        </label>
                        <Field
                          className="form-control shadow-none"
                          style={{
                            height: "100px",
                            width: "100%",
                            padding: "10px",
                          }}
                          component="textarea"
                          name="description"
                        />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestModal;
