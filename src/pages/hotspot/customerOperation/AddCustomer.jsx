import React from "react";
import { useState } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

//- - - - - Internal Imports - - - - -
import { FtextField } from "../../../components/common/FtextField";
import { addHotspotCustomer } from "../../../features/hotspotApi";
import Loader from "../../../components/common/Loader";
import useDataInputOption from "../../../hooks/useDataInputOption";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import useISPowner from "../../../hooks/useISPOwner";

const AddCustomer = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const inputPermission = {
    customerId: true,
    mikrotik: true,
    hotspotPackage: true,
    monthlyFee: true,
    hotspotName: true,
    password: true,
    name: true,
    mobile: true,
    billingCycle: true,
    status: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(
    inputPermission,
    "hotspot",
    "post",
    null
  );

  //---> Get user & current user data form useISPOwner hooks
  const { ispOwnerId } = useISPowner();

  //_ _ _ _ _ _ _ Local State _ _ _ _ _ _ _
  const [isLoading, setIsLoading] = useState(false);

  // handle Submit
  const handleSubmit = (formValues) => {
    const { billingCycle, hotspotName, password, profile, status, ...rest } =
      formValues;

    const sendingData = {
      ...rest,
      ispOwner: ispOwnerId,
      billingCycle: new Date(billingCycle).toISOString(),
      hotspot: {
        name: hotspotName,
        password: password,
        profile: profile,
        disabled: status === "active" ? false : true,
      },
    };

    addHotspotCustomer(dispatch, sendingData, setIsLoading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        size="md"
        header={t("addNewCustomer")}
        footer={
          <div className="displayGrid1 float-end">
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
              form="customerEdit"
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
            ...dataInputOption?.inputInitialValues,
          }}
          validationSchema={dataInputOption?.validationSchema}
          onSubmit={(values) => handleSubmit(values)}
          enableReinitialize
        >
          {() => (
            <Form id="customerEdit">
              <div className="displayGrid">
                {dataInputOption?.inputOption.map(
                  (item) =>
                    item?.isVisible && <FtextField {...item} as={item.as} />
                )}
              </div>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default AddCustomer;
