import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { FtextField } from "../../../components/common/FtextField";
import { fetchMikrotik } from "../../../features/apiCalls";
import {
  editHotspotCustomer,
  getHotspotPackage,
} from "../../../features/hotspotApi";
import Loader from "../../../components/common/Loader";
import useDataInputOption from "../../../hooks/useDataInputOption";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const EditCustomer = ({ show, setShow, customerId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // get hotspot customer
  const customer = useSelector((state) => state.hotspot.customer);

  // find editable data
  const data = customer.find((item) => item.id === customerId);

  // get ispOwner Id
  const ispOwnerId = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerId
  );

  // loading state
  const [hotspotPackageLoading, setHotspotPackageLoading] = useState(false);
  const [mikrotikLoading, setMikrotikLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // l the data input option function
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
    "edit",
    data
  );

  // customer status change
  const [status, setStatus] = useState("");

  useEffect(() => {
    // get mikrotik api call
    fetchMikrotik(dispatch, ispOwnerId, setMikrotikLoading);

    // get hotspot package api call
    getHotspotPackage(dispatch, ispOwnerId, setHotspotPackageLoading);
  }, []);

  // handle Submit
  const handleSubmit = (formValue) => {
    const { billingCycle, hotspotName, password, profile, ...rest } = formValue;

    const sendingData = {
      ...rest,
      ispOwner: ispOwnerId,
      billingCycle: new Date(billingCycle).toISOString(),
      hotspot: {
        name: hotspotName,
        password: password,
        profile: profile,
        disabled: data?.hotspot.disabled,
      },
    };
    editHotspotCustomer(
      dispatch,
      sendingData,
      customerId,
      setIsLoading,
      setShow
    );
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        size="md"
        header={data?.name + " " + t("editProfile")}
        status={data?.status}
        paymentStatus={data?.paymentStatus}
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

export default EditCustomer;
