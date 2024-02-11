import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

//custom hook
import useISPowner from "../../../../hooks/useISPOwner";
import useDataInputOption from "../../../../hooks/useDataInputOption";

// internal imports
import "../../../collector/collector.css";
import "../../customer.css";
import { FtextField } from "../../../../components/common/FtextField";
import Loader from "../../../../components/common/Loader";
import { editCustomer } from "../../../../features/apiCalls";
import InformationTooltip from "../../../../components/common/tooltipInformation/InformationTooltip";
import { informationEnBn } from "../../../../components/common/tooltipInformation/informationEnBn";
import ComponentCustomModal from "../../../../components/common/customModal/ComponentCustomModal";

//divisional location
import divisionsJSON from "../../../../bdAddress/bd-divisions.json";
import districtsJSON from "../../../../bdAddress/bd-districts.json";
import thanaJSON from "../../../../bdAddress/bd-upazilas.json";
import getName from "../../../../utils/getLocationName";

const divisions = divisionsJSON.divisions;
const districts = districtsJSON.districts;
const thanas = thanaJSON.thana;

const EditPPPoECustomer = ({ show, setShow, single }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // get user & current user data form useISPOwner hook
  const { ispOwnerId, bpSettings, hasMikrotik } = useISPowner();

  // get all customer
  const customer = useSelector((state) => state?.customer?.customer);

  // get all subAreas
  const storeSubArea = useSelector((state) => state.area?.subArea);

  // find editable data
  const data = customer.find((item) => item.id === single);

  // loading state
  const [isLoading, setIsloading] = useState(false);

  // set customer modified data
  const [customerModifiedData, setCustomerModifiedData] = useState({});

  // customer auto disable state
  const [autoDisable, setAutoDisable] = useState(false);

  // customer next month auto disable state
  const [nextMonthAutoDisable, setNextMonthAutoDisable] = useState(false);

  // data set to state
  useEffect(() => {
    // set customer auto disable
    setAutoDisable(data?.autoDisable);

    // set customer next month auto disable
    setNextMonthAutoDisable(data?.nextMonthAutoDisable);

    // set customer data area id
    storeSubArea?.map((sub) => {
      if (sub?.id === data?.subArea) {
        const customerData = {
          ...data,
          area: sub.area,
        };
        setCustomerModifiedData(customerData);
      }
    });
  }, [data]);

  // call the data input option function
  const inputPermission = {
    customerId: true,
    mikrotik: true,
    mikrotikPackage: true,
    monthlyFee: true,
    balance: true,
    pppoeName: true,
    password: true,
    area: true,
    subArea: true,
    poleBox: true,
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
  };

  // customer validator
  const customerValidator = Yup.object({
    address: Yup.string(),
    comment: Yup.string(),
    customerBillingType: Yup.string().required(t("select billing type")),
    connectionFee: Yup.number(),
    customerId:
      bpSettings?.genCustomerId && Yup.string().required(t("selectCustomer")),
    email: Yup.string().email(t("incorrectEmail")),
    mobile: Yup.string()
      .matches(/^(01){1}[3456789]{1}(\d){8}$/, t("incorrectMobile"))
      .min(11, t("write11DigitMobileNumber"))
      .max(11, t("over11DigitMobileNumber")),
    monthlyFee: Yup.number()
      .integer()
      .min(0, t("minimumPackageRate"))
      .required(t("enterPackageRate")),
    nid: Yup.string().matches(/^(?:\d{10}|\d{13}|\d{17})$/, t("invalidNID")),
    name: Yup.string().required(t("writeCustomerName")),
    pppoeName: Yup.string().required(t("writePPPoEName")),
    password: Yup.string().required(t("writePPPoEPassword")),
  });

  // get data input option from useDataInputOption hook
  const dataInputOption = useDataInputOption(
    inputPermission,
    "pppoe",
    "edit",
    customerModifiedData
  );

  // sending data to backed
  const customerHandler = async (formValue) => {
    const {
      birthDate,
      customerId,
      customerBillingType,
      district,
      division,
      pppoeName,
      password,
      profile,
      comment,
      mobile,
      mikrotikPackage,
      poleBox,
      thana,
      ...rest
    } = formValue;

    // if customer id is empty then alert write customer id
    if (!bpSettings.genCustomerId) {
      if (customerId === "") {
        setIsloading(false);
        return alert(t("writeCustomerId"));
      }
    }

    // if mobile number is empty then alert write mobile number
    if (bpSettings?.addCustomerWithMobile) {
      if (mobile === "") {
        setIsloading(false);
        return alert(t("writeMobileNumber"));
      }
    }

    // if payment status is unpaid and customer status is active and customer type is prepaid then alert recharge
    if (
      data?.paymentStatus === "unpaid" &&
      data?.status === "active" &&
      data?.customerBillingType === "prepaid"
    ) {
      if (customerBillingType === "postpaid") {
        setIsloading(false);
        return toast.warn(t("rechargeYourCustomer"));
      }
    }

    // customer modification sending data to api
    const mainData = {
      customerId,
      customerBillingType,
      singleCustomerID: data?.id,
      ispOwner: ispOwnerId,
      mikrotikPackage,
      autoDisable,
      nextMonthAutoDisable,
      mobile,
      birthDate: birthDate,
      poleBox,
      ...rest,
      pppoe: {
        name: pppoeName,
        password: password,
        service: "pppoe",
        comment: comment,
        profile: profile,
        disabled: data?.pppoe.disabled,
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

    // if balance is empty then delete balance
    if (
      mainData.balance === "" ||
      mainData.balance === undefined ||
      mainData === null
    ) {
      delete mainData.balance;
    }

    // if bpsettings genCustomerId is false then add customerId
    if (!bpSettings.genCustomerId) {
      mainData.customerId = customerId;
    }

    // if poleBox is empty then delete poleBox
    if (!poleBox) {
      delete mainData.poleBox;
    }

    // if has mikrotik is empty then delete mikrotik
    if (!bpSettings?.hasMikrotik) {
      delete mainData.mikrotik;
    }

    // sending data to api
    editCustomer(dispatch, mainData, setIsloading, setShow);
  };

  return (
    <>
      <ComponentCustomModal
        show={show}
        setShow={setShow}
        size="xl"
        header={data?.name + " " + t("editProfile")}
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
            area: customerModifiedData?.area,
          }}
          validationSchema={customerValidator}
          onSubmit={(values) => {
            customerHandler(values);
          }}
          enableReinitialize
        >
          {() => (
            <Form id="customerEdit">
              <div className="displayGrid3">
                {dataInputOption?.inputOption.map(
                  (item) =>
                    item?.isVisible && (
                      <FtextField
                        as={item.as}
                        info={item?.info}
                        name={item?.name}
                        type={item?.type}
                        disabled={item.disabled}
                        validation={item.validation}
                        label={item?.label}
                        placeholder={item?.placeholder}
                        placeholderText={item?.placeholderText}
                        firstOptions={item?.firstOptions}
                        textAccessor={item.textAccessor}
                        valueAccessor={item.valueAccessor}
                        options={item.options}
                        value={item?.value}
                        onChange={item?.onChange}
                        component={item?.component}
                        inputField={item?.inputField}
                        selected={item?.selected}
                        dateFormat={item?.dateFormat}
                        timeIntervals={item?.timeIntervals}
                        showTimeSelect={item?.showTimeSelect}
                        showYearDropdown={item?.showYearDropdown}
                        scrollableYearDropdown={item?.scrollableYearDropdown}
                        yearDropdownItemNumbers={item?.yearDropdownItemNumbers}
                      />
                    )
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

                      {data.balance <= 0 && (
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
                      )}
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

export default EditPPPoECustomer;
