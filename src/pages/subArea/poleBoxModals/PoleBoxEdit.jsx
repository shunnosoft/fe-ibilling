import { Field, Form, Formik } from "formik";
import { t } from "i18next";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { FtextField } from "../../../components/common/FtextField";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editPoleBox } from "../../../features/apiCalls";
import Loader from "../../../components/common/Loader";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";

const PoleBoxEdit = ({ areaId, poleId, editShow, setEditShow }) => {
  const dispatch = useDispatch();

  // get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth.ispOwnerId
  );

  //get specific pole
  const singlePole = useSelector((state) => state.area?.poleBox).find(
    (val) => val.id === poleId
  );

  //get all sub Area
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // Loading state
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

  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  //modal show handler
  const handleClose = () => {
    setEditShow(false);
  };

  // Edit subarea
  const poleBoxEdit = async (data) => {
    const sendingData = {
      name: data.name,
      description: data.description,
      subArea: subAreaId,
    };
    editPoleBox(
      dispatch,
      sendingData,
      ispOwnerId,
      poleId,
      setIsLoading,
      setEditShow
    );
  };

  return (
    <>
      <Modal
        show={editShow}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <ModalHeader closeButton>
          <ModalTitle>{t("editPoleBox")}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              name: singlePole?.name || "",
              description: singlePole?.description || "",
            }}
            validationSchema={linemanValidator}
            onSubmit={(values) => {
              poleBoxEdit(values);
            }}
            enableReinitialize
          >
            {() => (
              <Form id="poleEdit">
                <div>
                  <div>
                    {/* <div className="w-100 me-2 mb-3">
                      <label className="form-control-label changeLabelFontColor">
                        {t("subArea")}
                      </label>

                      <select
                        className="form-select mt-0 mw-100"
                        name="subArea"
                        onChange={(e) => setSubAreaId(e.target.value)}
                      >
                        <option value=""> {t("subArea")} </option>

                        {subArea?.map((val) => (
                          <option
                            value={`${val.id}`}
                            selected={singlePole?.subArea === val.id}
                          >
                            {val.name}
                          </option>
                        ))}
                      </select>
                    </div> */}
                    <FtextField type="text" label={t("name")} name="name" />

                    <label
                      className="changeLabelFontColor"
                      htmlFor="description"
                    >
                      {t("description")}
                    </label>
                    <Field
                      style={{
                        height: "100px",
                        width: "100%",
                        padding: "10px",
                      }}
                      className="form-control shadow-none"
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
            form="poleEdit"
            className="btn btn-success customBtn"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("save")}
          </button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default PoleBoxEdit;
