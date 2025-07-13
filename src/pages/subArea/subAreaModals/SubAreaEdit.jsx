import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { editSubArea } from "../../../features/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const SubAreaEdit = ({
  subAreaID,
  subAreaName,
  ispId,
  editShow,
  setEditShow,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //Loading state
  const [isLoading, setIsLoading] = useState(false);

  //subArea edit validator
  const linemanValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  const [remarks, setRemarks] = useState("");

  const storeSubArea = useSelector((state) => state.area?.subArea);

  const oneSubArea = storeSubArea.find((item) => item.id === subAreaID);

  useEffect(() => {
    setRemarks(oneSubArea?.remarks || "");
  }, [oneSubArea]);

  //modal show handler
  const handleClose = () => {
    setEditShow(false);
  };

  // Edit subarea
  const subAreaEditHandler = async (data) => {
    setIsLoading(true);
    const IDs = {
      ispOwnerID: ispId,
      ispOwner: ispId,
      id: subAreaID,
      name: data.name,
      remarks,
    };
    editSubArea(dispatch, IDs, setIsLoading, setEditShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={editShow}
        setShow={setEditShow}
        header={t("editSubArea")}
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
              form="subAreaEdit"
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
            name: subAreaName || "",
          }}
          validationSchema={linemanValidator}
          onSubmit={(values) => {
            subAreaEditHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="subAreaEdit">
              <div className="displayGrid">
                <FtextField type="text" label={t("subAreaName")} name="name" />

                <div>
                  <label className="changeLabelFontColor">{t("remarks")}</label>
                  <textarea
                    cols={200}
                    className="form-control shadow-none"
                    id="noteField"
                    value={remarks}
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
};

export default SubAreaEdit;
