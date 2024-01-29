import { Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

// internal import
import { FtextField } from "../../../../components/common/FtextField";
import Loader from "../../../../components/common/Loader";
import { hotspotPackageEdit } from "../../../../features/hotspotApi";
import ComponentCustomModal from "../../../../components/common/customModal/ComponentCustomModal";

const EditHotspotPackage = ({ show, setShow, packageId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //validator
  const pppoeValidator = Yup.object({
    rate: Yup.number(),
  });

  // get hotspot package
  const hotsPackage = useSelector((state) => state.hotspot?.package);

  // find editable package
  const data = hotsPackage.find((item) => item.id === packageId);

  // edit loading state
  const [editLoading, setEditLoading] = useState(false);

  // set mikrotik id into variable
  var mikrotikId = data?.mikrotik;

  // hotspot edit handler
  const editHotspotPackage = (value) => {
    const data = {
      rate: value.rate.toString(),
    };

    // edit api call
    hotspotPackageEdit(
      dispatch,
      mikrotikId,
      packageId,
      data,
      setEditLoading,
      setShow
    );
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size={"md"}
        header={data?.name + " " + t("rateEdit")}
      >
        <Formik
          initialValues={{
            rate: data?.rate || "",
          }}
          validationSchema={pppoeValidator}
          onSubmit={(values) => {
            editHotspotPackage(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <FtextField
                min={0}
                type="number"
                label={t("packageRate")}
                name="rate"
              />

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
                  disabled={editLoading}
                >
                  {editLoading ? <Loader /> : t("save")}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default EditHotspotPackage;
