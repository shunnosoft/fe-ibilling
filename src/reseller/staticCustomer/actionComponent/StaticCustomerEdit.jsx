import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { fetchPackagefromDatabase } from "../../../features/apiCalls";
import { useTranslation } from "react-i18next";

import getName from "../../../utils/getLocationName";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import { updateResellerStaticCustomer } from "../../../features/apiCallReseller";
import useDataInputOption from "../../../hooks/useDataInputOption";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { informationEnBn } from "../../../components/common/tooltipInformation/informationEnBn";
import InformationTooltip from "../../../components/common/tooltipInformation/InformationTooltip";
import useISPowner from "../../../hooks/useISPOwner";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thanas = thanaJSON.thana;

const StaticCustomerEdit = ({ show, setShow, single }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hooks
  const { role, ispOwnerId, bpSettings, userData } = useISPowner();

  const customer = useSelector((state) =>
    state?.customer?.staticCustomer.find((item) => item.id === single)
  );

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  const [isLoading, setIsloading] = useState(false);
  const [autoDisable, setAutoDisable] = useState();
  const [nextMonthAutoDisable, setNextMonthAutoDisable] = useState(false);

  // call the data input option function
  const inputPermission = {
    customerId: true,
    mikrotik: true,
    mikrotikPackage: true,
    ipAddress: true,
    monthlyFee: true,
    balance: true,
    area: true,
    subArea: true,
    poleBox: true,
    queueName: true,
    name: true,
    mobile: true,
    birthDate: true,
    nid: true,
    address: true,
    email: true,
    billingCycle: true,
    promiseDate: true,
    connectionDate: true,
    connectionFee: true,
    customerBillingType: true,
    division: true,
    district: true,
    thana: true,
    comment: true,
    status: true,
    referenceName: true,
    referenceMobile: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(
    inputPermission,
    "static",
    "edit",
    customer
  );

  useEffect(() => {
    const IDs = {
      ispOwner: ispOwnerId,
      mikrotikId: customer?.mikrotik,
    };
    if (bpSettings?.hasMikrotik) {
      fetchPackagefromDatabase(dispatch, IDs, setIsloading);
    }
  }, [customer?.mikrotik]);

  // sending data to backed
  const customerHandler = async (formValue) => {
    const {
      birthDate,
      billingCycle,
      connectionDate,
      customerId,
      district,
      division,
      ipAddress,
      queueName,
      poleBox,
      promiseDate,
      thana,
      maxUpLimit,
      maxDownLimit,
      profile,
      comment,
      ...rest
    } = formValue;

    const mainData = {
      birthDate: birthDate ? new Date(birthDate).toISOString() : birthDate,
      billingCycle: new Date(billingCycle).toISOString(),
      promiseDate: new Date(promiseDate).toISOString(),
      connectionDate: new Date(connectionDate).toISOString(),
      autoDisable: autoDisable,
      ispOwner: ispOwnerId,
      nextMonthAutoDisable: nextMonthAutoDisable,
      ...rest,
      queue: {
        name: queueName,
        target: ipAddress,
        profile: profile,
        maxLimit: `${maxUpLimit}/${maxDownLimit}`,
        comment: comment,
      },
    };

    // set the value of division district and thana dynamically
    if (district || division || thana) {
      const divisionName = getName(divisions, division)?.name;
      const districtName = getName(districts, district)?.name;
      const thanaName = getName(thanas, thana)?.name;

      //if  exist add the data
      if (divisionName) mainData.division = divisionName;
      if (districtName) mainData.district = districtName;
      if (thanaName) mainData.thana = thanaName;
    }

    // if customer id auto generate is false then add customer id
    if (!bpSettings?.genCustomerId) {
      mainData.customerId = customerId;
    }

    // if has mikrotik is empty then delete mikrotik
    if (!bpSettings?.hasMikrotik) {
      delete mainData.mikrotik;
    }

    // if poleBox is empty then delete poleBox
    if (!poleBox) {
      delete mainData.poleBox;
    }

    // return;
    updateResellerStaticCustomer(
      customer.id,
      resellerId,
      dispatch,
      mainData,
      setIsloading,
      null,
      setShow
    );
  };
  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="xl"
        header={customer?.name + " " + t("updateCustomer")}
        status={customer?.status}
        paymentStatus={customer?.paymentStatus}
        footer={
          <div className="displayGrid1 float-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShow(false)}
              disabled={isLoading}
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
          validationSchema={dataInputOption.validationSchema}
          onSubmit={(values, { resetForm }) => {
            customerHandler(values, resetForm);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="customerEdit">
              <div className="displayGrid3">
                {dataInputOption?.inputOption.map(
                  (item) => item?.isVisible && <FtextField {...item} />
                )}
                {bpSettings?.hasMikrotik && (
                  <div>
                    <label className="changeLabelFontColor">
                      {t("automaticConnectionOff")}
                    </label>

                    <div className="displayGrid2">
                      <div className="customerAutoDisable">
                        <input
                          className="form-check-input me-2"
                          type="checkbox"
                          name="autoDisable"
                          id="autoDisable"
                          checked={autoDisable}
                          disabled={nextMonthAutoDisable}
                          onChange={(e) => setAutoDisable(e.target.checked)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="autoDisable"
                        >
                          {t("willContinue")}
                        </label>
                      </div>

                      <div className="d-flex align-items-center">
                        <div className="customerAutoDisable">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            name="autoDisable"
                            id="nextMonthAutoDisable"
                            checked={nextMonthAutoDisable}
                            disabled={autoDisable}
                            onChange={(e) =>
                              setNextMonthAutoDisable(e.target.checked)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="nextMonthAutoDisable"
                          >
                            {t("nextMonth")}
                          </label>
                        </div>

                        {/* there is information to grant permission tooltip */}
                        {informationEnBn()?.[1] && (
                          <InformationTooltip data={informationEnBn()?.[1]} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </ComponentCustomModal>
    </>
  );
};

export default StaticCustomerEdit;
