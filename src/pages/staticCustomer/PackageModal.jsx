import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
// internal imports
import "../Customer/customer.css";
import { FtextField } from "../../components/common/FtextField";
import Loader from "../../components/common/Loader";
import {
  addQueuePackage,
  updateWithoutMikrotikPackage,
} from "../../features/apiCalls";
import { useTranslation } from "react-i18next";
import ComponentCustomModal from "../../components/common/customModal/ComponentCustomModal";
import useISPowner from "../../hooks/useISPOwner";

const DEFAULT_VALUE = {
  mikrotik: "",
  name: "",
  rate: 0,
};

const PackageModal = ({ show, setShow, isUpdate, singlePackage }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //---> Get user & current user data form useISPOwner hooks
  const { ispOwnerId, hasMikrotik } = useISPowner();

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  //---> Form default value
  const [defaultValues, setDefaultValue] = useState(DEFAULT_VALUE);

  // get mikrotik
  const mikrotik = useSelector((state) => state?.mikrotik?.mikrotik);

  // form validator
  const collectorValidator = Yup.object({
    mikrotik: hasMikrotik && Yup.string().required(t("selectMikrotik")),
    name: Yup.string().required(t("enterPackageName")),
    rate: Yup.number()
      .integer()
      .min(1, t("minimumPackageRate1"))
      .required(t("enterPackageRate")),
  });

  useEffect(() => {
    if (isUpdate) {
      setDefaultValue(singlePackage);
    } else {
      setDefaultValue(DEFAULT_VALUE);
    }
  }, [isUpdate]);

  //---> Handle queue package create and update
  const packageAddHandler = (data) => {
    if (isUpdate) {
      const sendingData = {
        ...data,
        id: singlePackage?.id,
        ispOwner: ispOwnerId,
      };

      updateWithoutMikrotikPackage(
        sendingData,
        dispatch,
        setIsLoading,
        setShow
      );
    } else {
      const sendingData = {
        ...data,
        ispOwner: ispOwnerId,
        packageType: "queue",
      };

      addQueuePackage(sendingData, dispatch, setIsLoading, setShow);
    }
  };

  return (
    <ComponentCustomModal
      show={show}
      setShow={setShow}
      header={
        isUpdate
          ? singlePackage?.name + " " + t("rateEdit")
          : t("newStaticPackage")
      }
      centered={true}
      size="md"
      footer={
        <div className="displayGrid1">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isLoading}
            onClick={() => setShow(false)}
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            form="queue_package_create_update"
            className="btn btn-success customBtn"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : t("save")}
          </button>
        </div>
      }
    >
      <Formik
        initialValues={defaultValues}
        validationSchema={collectorValidator}
        onSubmit={(values) => {
          packageAddHandler(values);
        }}
        enableReinitialize
      >
        {() => (
          <Form id="queue_package_create_update">
            <div className="displayGrid">
              {hasMikrotik && (
                <FtextField
                  as="select"
                  name="mikrotik"
                  label={t("selectPackage")}
                  options={mikrotik}
                  firstOptions={t("selectPackage")}
                  textAccessor="name"
                  valueAccessor="id"
                  placeholder="Ex: 1m, 512k"
                  validation={true}
                />
              )}

              <FtextField
                type="text"
                label={t("packageName")}
                name="name"
                placeholder="Ex: 1m, 512k"
                validation={true}
              />

              <FtextField
                min={0}
                type="number"
                label={t("packagePrice")}
                name="rate"
                validation={true}
              />
            </div>
          </Form>
        )}
      </Formik>
    </ComponentCustomModal>
  );
};

export default PackageModal;
