import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { addPoleBox } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

export default function PoleBoxPost({
  areaName,
  areaId,
  postShow,
  setPostShow,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //get current user(ispOwner)
  const auth = useSelector((state) => state.persistedReducer.auth.currentUser);

  //get all sub Area
  const storeSubArea = useSelector((state) => state.area?.subArea);

  //Loading state
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

  //modal show handler
  const handleClose = () => {
    setPostShow(false);
  };

  //pole box post handler
  const poleBoxPost = async (data) => {
    if (auth.ispOwner) {
      const sendingData = {
        name: data.name,
        description: data.description,
        subArea: subAreaId,
        ispOwner: auth.ispOwner.id,
      };
      addPoleBox(dispatch, sendingData, setIsLoading, setPostShow);
    }
  };

  return (
    <>
      <Modal
        show={postShow}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>
            {areaName}- {t("addPoleBox")}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
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
              <Form id="polePost">
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
              </Form>
            )}
          </Formik>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            form="polePost"
            className="btn btn-success customBtn"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("save")}
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
}
