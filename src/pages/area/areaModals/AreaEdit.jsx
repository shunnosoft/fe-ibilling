import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// internal imports
import "../../collector/collector.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { editArea } from "../../../features/apiCalls";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const AreaEdit = ({ show, setShow, areaId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get ispOwnerId
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // get mikrotik
  const mikrotiks = useSelector((state) => state.mikrotik.mikrotik);

  // get areas
  const area = useSelector((state) => state?.area?.area);

  // find editable area
  const oneArea = area.find((val) => val.id === areaId);

  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    setRemarks(oneArea?.remarks || "");
  }, [oneArea]);

  const checkMikrotikName = () => {
    const match = mikrotiks.some((item) => item.name == oneArea?.name);
    return match;
  };

  // validator
  const areaEditValidator = Yup.object({
    name: Yup.string().required(t("enterName")),
  });

  // edit handleroneArea
  const areaEditHandler = async (data) => {
    setIsLoading(true);
    if (ispOwnerId) {
      const sendingData = {
        name: data.name,
        ispOwner: ispOwnerId,
        id: oneArea ? oneArea.id : "",
        remarks,
      };
      editArea(dispatch, sendingData, setIsLoading, setShow);
    }
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={t("editArea")}
      >
        <Formik
          initialValues={{
            name: oneArea?.name,
          }}
          validationSchema={areaEditValidator}
          onSubmit={(values) => {
            areaEditHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <div className="displayGrid">
                <FtextField
                  type="text"
                  label={t("editAreaName")}
                  name="name"
                  disabled={checkMikrotikName()}
                />

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

export default AreaEdit;
