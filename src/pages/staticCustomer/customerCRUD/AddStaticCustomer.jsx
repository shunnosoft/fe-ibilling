/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Form, Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { addStaticCustomerApi } from "../../../features/staticCustomerApi";
import { useTranslation } from "react-i18next";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import getName from "../../../utils/getLocationName";

//custom hooks
import useISPowner from "../../../hooks/useISPOwner";

import useDataInputOption from "../../../hooks/useDataInputOption";
import InformationTooltip from "../../../components/common/tooltipInformation/InformationTooltip";
import { informationEnBn } from "../../../components/common/tooltipInformation/informationEnBn";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thanas = thanaJSON.thana;

const AddStaticCustomer = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner
  const { ispOwnerId, bpSettings } = useISPowner();

  //get user type
  const type = useSelector(
    (state) => state.persistedReducer.auth?.ispOwnerData?.bpSettings.queueType
  );

  const [isLoading, setIsloading] = useState(false);

  // customer auto disable state
  const [autoDisable, setAutoDisable] = useState(true);

  // customer next month auto disable state
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
    status: true,
    referenceName: true,
    referenceMobile: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(
    inputPermission,
    "static",
    "post",
    null
  );

  // sending data to backed
  const customerHandler = async (formValue, resetForm) => {
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
      paymentStatus: "unpaid",
      ...rest,
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

    if (type === "firewall-queue") {
      mainData.userType = "firewall-queue";
      mainData.queue = {
        type: type,
        address: ipAddress,
        list: "allow_ip",
      };
      if (maxUpLimit) {
        mainData.queue.maxLimit = `${maxUpLimit}/${maxUpLimit}`;
      }
    }

    if (type === "core-queue") {
      mainData.userType = "core-queue";
      mainData.queue = {
        type: type,
        srcAddress: ipAddress,
      };
    }

    if (type === "simple-queue") {
      mainData.userType = "simple-queue";
      mainData.queue = {
        name: queueName,
        type: type,
        target: ipAddress,
        maxLimit: `${maxUpLimit}/${maxDownLimit}`,
      };
    }

    // sending data to api
    addStaticCustomerApi(dispatch, mainData, setIsloading, setShow, resetForm);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        centered={false}
        size="xl"
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
              form="customerPost"
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
            <Form id="customerPost">
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

export default AddStaticCustomer;
