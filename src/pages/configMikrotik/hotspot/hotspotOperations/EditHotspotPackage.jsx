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

  // Define input fields with properties
  const inputOptions = [
    {
      as: "select",
      id: "packageType",
      name: "packageType",
      label: t("packageType"),
      firstOptions: t("selectPackageType"),
      options: [
        {
          label: "Hour",
          value: "hour",
        },
        {
          label: "Day",
          value: "day",
        },
        {
          label: "Month",
          value: "month",
        },
      ],
      textAccessor: "label",
      valueAccessor: "value",
      validation: true,
      isVisible: true,
      disabled: false,
    },
    {
      type: "number",
      id: "validity",
      name: "validity",
      label: t("validity"),
      validation: true,
      isVisible: true,
      disabled: false,
    },
    {
      type: "number",
      id: "rate",
      name: "rate",
      label: t("packageRate"),
      validation: true,
      isVisible: true,
      disabled: false,
    },
    {
      type: "text",
      id: "dataLimit",
      name: "dataLimit",
      label: t("dataLimit"),
      validation: false,
      isVisible: true,
      disabled: false,
    },
  ];

  // hotspot edit handler
  const editHotspotPackage = (formValues) => {
    // edit api call
    hotspotPackageEdit(
      dispatch,
      mikrotikId,
      packageId,
      formValues,
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
            packageType: data?.packageType,
            validity: data?.validity,
            rate: data?.rate || 1,
            dataLimit: data?.dataLimit,
          }}
          validationSchema={pppoeValidator}
          onSubmit={(values) => {
            editHotspotPackage(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form>
              <div className="displayGrid mb-3">
                {inputOptions?.map(
                  (item) => item?.isVisible && <FtextField {...item} />
                )}
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
