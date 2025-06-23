import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";

// custom hooks import
import useISPowner from "../../../hooks/useISPOwner";
import useDataInputOption from "../../../hooks/useDataInputOption";

// internal imports
import "../../collector/collector.css";
import "../customer.css";
import { FtextField } from "../../../components/common/FtextField";
import Loader from "../../../components/common/Loader";
import { addCustomer } from "../../../features/apiCallReseller";
import ComponentCustomModal from "../../../components/common/customModal/ComponentCustomModal";
import { informationEnBn } from "../../../components/common/tooltipInformation/informationEnBn";
import InformationTooltip from "../../../components/common/tooltipInformation/InformationTooltip";

//divisional location
import divisionsJSON from "../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../bdAddress/bd-upazilas.json";
import getName from "../../../utils/getLocationName";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thanas = thanaJSON.thana;

const CustomerModal = ({ show, setShow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // call the data input option function
  const inputPermission = {
    mikrotik: true,
    mikrotikPackage: true,
    monthlyFee: true,
    balance: true,
    pppoeName: true,
    password: true,
    area: true,
    subArea: true,
    name: true,
    mobile: true,
    birthDate: true,
    nid: true,
    address: true,
    email: true,
    billingCycle: true,
    connectionDate: true,
    connectionFee: true,
    customerBillingType: true,
    division: true,
    district: true,
    thana: true,
    comment: true,
    status: true,
  };

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(
    inputPermission,
    "pppoe",
    "post",
    null
  );

  // get user & current user data form useISPOwner hooks
  const { role, bpSettings, resellerData, userData, permission } =
    useISPowner();

  // reseller id from role base
  const resellerId = role === "collector" ? userData.reseller : userData.id;

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // customer auto disable state
  const [autoDisable, setAutoDisable] = useState(true);

  // customer next month auto disable state
  const [nextMonthAutoDisable, setNextMonthAutoDisable] = useState(false);

  // sending data to backed
  const customerHandler = async (formValue, resetForm) => {
    const {
      birthDate,
      billingCycle,
      connectionDate,
      customerId,
      district,
      division,
      pppoeName,
      password,
      profile,
      comment,
      thana,
      ...rest
    } = formValue;

    const mainData = {
      autoDisable: autoDisable,
      birthDate: birthDate ? new Date(birthDate).toISOString() : birthDate,
      billingCycle: new Date(billingCycle).toISOString(),
      connectionDate: new Date(connectionDate).toISOString(),
      ispOwner: userData?.ispOwner,
      nextMonthAutoDisable: nextMonthAutoDisable,
      paymentStatus: "unpaid",
      reseller: resellerId,
      ...rest,
      pppoe: {
        name: pppoeName,
        password: password,
        service: "pppoe",
        comment: comment,
        profile: profile,
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

    // if has mikrotik is empty then delete mikrotik
    if (!bpSettings?.hasMikrotik) {
      delete mainData.mikrotik;
    }

    // sending data to api
    addCustomer(dispatch, mainData, setIsloading, resetForm, setShow);
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
          <div className="displayGrid1 flex-end">
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
              {isLoading ? <Loader /> : t("submit")}
            </button>
          </div>
        }
      >
        <Formik
          initialValues={{
            ...dataInputOption.inputInitialValues,
          }}
          validationSchema={dataInputOption?.validationSchema}
          onSubmit={(values, { resetForm }) => {
            customerHandler(values, resetForm);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="customerPost">
              <div className="displayGrid3">
                {dataInputOption?.inputOption.map(
                  (item) => item.isVisible && <FtextField {...item} />
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
                          disabled={
                            nextMonthAutoDisable ||
                            !(
                              permission?.customerAutoDisableEdit ||
                              resellerData.permission?.customerAutoDisableEdit
                            )
                          }
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

export default CustomerModal;
