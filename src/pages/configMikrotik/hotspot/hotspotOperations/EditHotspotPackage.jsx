import { Form, Formik } from "formik";
import React, { useState } from "react";
import { FtextField } from "../../../../components/common/FtextField";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import Loader from "../../../../components/common/Loader";
import { useDispatch } from "react-redux";
import { hotspotPackageEdit } from "../../../../features/hotspotApi";

const EditHotspotPackage = ({ packageId }) => {
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
    hotspotPackageEdit(dispatch, mikrotikId, packageId, data, setEditLoading);
  };

  return (
    <div
      className="modal fade modal-dialog-scrollable "
      id="hotspotPackageEdit"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              {data?.name} - {t("rateEdit")}
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
                      disabled={editLoading}
                    >
                      {editLoading ? <Loader /> : t("save")}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHotspotPackage;
